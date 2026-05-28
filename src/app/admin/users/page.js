"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const tierOptions = ['free', 'pulse', 'premium']
const tierLabels = { free: 'FREE', pulse: 'PULSE', premium: 'PREMIUM' }

// Color maps used in the admin UI
const tc = { SPARK: '#a8b2d8', PULSE: '#64ffda', MOMENTUM: '#00b4d8', spark: '#a8b2d8', pulse: '#64ffda', momentum: '#00b4d8' }
const sc = { Active: '#64ffda', Suspended: '#ff8080', Pending: '#f59e0b' }

export default function AdminUsersPage() {
  const router = useRouter()
  const user = useUserStore(state => state.user)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [newTier, setNewTier] = useState('')
  const [flash, setFlash] = useState('')
  const [creditAmt, setCreditAmt] = useState('')
  const [creditType, setCreditType] = useState('credit')

  useEffect(() => {
    if (user === null) return
    if (!user || user.role !== 'admin') {
      router.push('/user/dashboard')
      return
    }
    fetchUsers()
  }, [user, router])

  const getAuthHeaders = async () => {
    const token = await useUserStore.getState().getToken?.()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/admin/users', { headers })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to fetch users')
      }
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id, updates) => {
    try {
      const headers = { 'Content-Type': 'application/json', ...(await getAuthHeaders()) }
      const res = await fetch(`/api/admin/users/${id}`, { method: 'PUT', headers, body: JSON.stringify(updates) })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Update failed')
      }
      const json = await res.json()
      setUsers(prev => prev.map(u => (u.id === id ? json.user : u)))
      setFlash('✅ User updated successfully.')
      setTimeout(() => setFlash(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = (userItem) => updateUser(userItem.id, { membership_active: !userItem.membership_active })
  const handleShowTierModal = (userItem) => { setSelectedUser(userItem); setNewTier(userItem.membership_tier); setModalType('tier') }
  const handleSaveTier = () => { if (!selectedUser || !newTier) return; updateUser(selectedUser.id, { membership_tier: newTier }); setModalType(null) }

  const filteredUsers = users.filter(item => {
    const searchMatch = item.full_name?.toLowerCase().includes(search.toLowerCase()) || item.email?.toLowerCase().includes(search.toLowerCase())
    const tierMatch = tierFilter === 'ALL' || item.membership_tier === tierFilter
    const statusMatch = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' && item.membership_active) || (statusFilter === 'SUSPENDED' && !item.membership_active)
    return searchMatch && tierMatch && statusMatch
  })

  const doCredit = async () => {
    if (!creditAmt || !selectedUser) return
    try {
      const headers = { 'Content-Type': 'application/json', ...(await getAuthHeaders()) }
      const res = await fetch('/api/admin/wallet', { method: 'POST', headers, body: JSON.stringify({ userId: selectedUser.id, amount: Number(creditAmt), mode: creditType }) })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Wallet operation failed')
      }
      // refresh users list to reflect changes
      fetchUsers()
      setFlash('✅ Wallet updated successfully')
      setTimeout(() => setFlash(''), 2500)
      setModalType(null); setCreditAmt('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 28, margin: 0, color: '#e6f1ff' }}>Admin User Management</h1>
        <p style={{ color: '#8892b0', marginTop: 8 }}>Review all users and make changes that apply across every account.</p>
      </div>

      {flash && <div style={{ marginBottom: 18, padding: 14, borderRadius: 16, background: '#152c44', color: '#64ffda' }}>{flash}</div>}
      {error && <div style={{ marginBottom: 18, padding: 14, borderRadius: 16, background: '#3b1e26', color: '#ff6b6b' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email" style={{ flex: 1, minWidth: 240, padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }} />
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }}>
          <option value="ALL">All tiers</option>
          {tierOptions.map(t => <option key={t} value={t}>{tierLabels[t]}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }}>
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 20, background: '#07101a', border: '1px solid rgba(255,107,107,0.08)' }}>
        <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#091521' }}>
              {['User','Email','Tier','Status','Joined','Actions'].map(h => <th key={h} style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#8892b0' }}>Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#8892b0' }}>No matching users found.</td></tr>
            ) : (
              filteredUsers.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 14, color: '#e6f1ff' }}>{item.full_name}</td>
                  <td style={{ padding: 14, color: '#8892b0' }}>{item.email}</td>
                  <td style={{ padding: 14 }}><span style={{ padding: '6px 12px', borderRadius: 999, background: `${tc[item.membership_tier] || '#333'}15`, color: tc[item.membership_tier] || '#a8b2d8', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>{item.membership_tier}</span></td>
                  <td style={{ padding: 14, color: item.membership_active ? '#64ffda' : '#ff8080' }}>{item.membership_active ? 'Active' : 'Suspended'}</td>
                  <td style={{ padding: 14, color: '#8892b0' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => handleToggleStatus(item)} style={{ padding: '8px 12px', borderRadius: 12 }}>{item.membership_active ? 'Suspend' : 'Activate'}</button>
                    <button onClick={() => handleShowTierModal(item)} style={{ padding: '8px 12px', borderRadius: 12 }}>Change Tier</button>
                    <button onClick={() => { setSelectedUser(item); setModalType('credit') }} style={{ padding: '8px 12px', borderRadius: 12 }}>💰</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Credit Modal */}
      {modalType === 'credit' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && setModalType(null)}>
          <div style={{ background: '#08141e', padding: 28, borderRadius: 18, width: 420 }}>
            <h3 style={{ color: '#e6f1ff' }}>💳 Credit / Debit Wallet</h3>
            <p style={{ color: '#8892b0' }}>User: <strong style={{ color: '#e6f1ff' }}>{selectedUser.full_name}</strong></p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <button onClick={() => setCreditType('credit')} style={{ flex: 1, padding: 10, borderRadius: 10, background: creditType === 'credit' ? '#64ffda' : undefined }}>Credit</button>
              <button onClick={() => setCreditType('debit')} style={{ flex: 1, padding: 10, borderRadius: 10, background: creditType === 'debit' ? '#ff8080' : undefined }}>Debit</button>
            </div>
            <input type="number" value={creditAmt} onChange={e => setCreditAmt(e.target.value)} placeholder="Amount" style={{ width: '100%', padding: 12, borderRadius: 10, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={doCredit} style={{ flex: 1, padding: 12, borderRadius: 10, background: '#64ffda' }}>Submit</button>
              <button onClick={() => setModalType(null)} style={{ padding: 12, borderRadius: 10 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tier Modal */}
      {modalType === 'tier' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && setModalType(null)}>
          <div style={{ background: '#08141e', padding: 28, borderRadius: 18, width: 420 }}>
            <h3 style={{ color: '#e6f1ff' }}>💎 Change Tier</h3>
            <p style={{ color: '#8892b0' }}>Update tier for <strong style={{ color: '#e6f1ff' }}>{selectedUser.full_name}</strong></p>
            <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
              {tierOptions.map(t => (
                <button key={t} onClick={() => setNewTier(t)} style={{ padding: 12, borderRadius: 10, background: newTier === t ? '#3b82f6' : undefined }}>{tierLabels[t]}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSaveTier} style={{ flex: 1, padding: 12, borderRadius: 10, background: '#3b82f6' }}>Save</button>
              <button onClick={() => setModalType(null)} style={{ padding: 12, borderRadius: 10 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
