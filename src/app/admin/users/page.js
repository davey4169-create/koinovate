'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const tierOptions = ['free', 'pulse', 'premium']
const tierLabels = {
  free: 'FREE',
  pulse: 'PULSE',
  premium: 'PREMIUM',
}
const tierColors = {
  free: '#a8b2d8',
  pulse: '#64ffda',
  premium: '#00b4d8',
}

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

  const filteredUsers = users.filter((item) => {
    const searchMatch =
      item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase())
    const tierMatch = tierFilter === 'ALL' || item.membership_tier === tierFilter
    const statusMatch =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && item.membership_active) ||
      (statusFilter === 'SUSPENDED' && !item.membership_active)
    return searchMatch && tierMatch && statusMatch
  })

  const updateUser = async (id, updates) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      }
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Update failed')
      }
      const json = await res.json()
      setUsers((prev) => prev.map((user) => (user.id === id ? json.user : user)))
      setFlash('✅ User updated successfully.')
      setTimeout(() => setFlash(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = (userItem) => {
    updateUser(userItem.id, {
      membership_active: !userItem.membership_active,
    })
  }

  const handleSaveTier = () => {
    if (!selectedUser || !newTier) return
    updateUser(selectedUser.id, { membership_tier: newTier })
    setModalType(null)
  }

  const handleShowTierModal = (userItem) => {
    setSelectedUser(userItem)
    setNewTier(userItem.membership_tier)
    setModalType('tier')
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 28, margin: 0, color: '#e6f1ff' }}>Admin User Management</h1>
        <p style={{ color: '#8892b0', marginTop: 8 }}>Review all users and make changes that apply across every account.</p>
      </div>

      {flash && (
        <div style={{ marginBottom: 18, padding: 14, borderRadius: 16, background: '#152c44', color: '#64ffda' }}>{flash}</div>
      )}

      {error && (
        <div style={{ marginBottom: 18, padding: 14, borderRadius: 16, background: '#3b1e26', color: '#ff6b6b' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email"
          style={{ flex: 1, minWidth: 240, padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }}
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }}
        >
          <option value="ALL">All tiers</option>
          {tierOptions.map((tier) => (
            <option key={tier} value={tier}>{tierLabels[tier]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(100,100,100,0.25)', background: '#08141e', color: '#e6f1ff' }}
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 20, background: '#07101a', border: '1px solid rgba(255,107,107,0.08)' }}>
        <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#091521' }}>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>User</th>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>Email</th>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>Tier</th>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>Status</th>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>Joined</th>
              <th style={{ padding: 14, color: '#8892b0', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#8892b0' }}>Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#8892b0' }}>No matching users found.</td>
              </tr>
            ) : (
              filteredUsers.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 14, color: '#e6f1ff' }}>{item.full_name}</td>
                  <td style={{ padding: 14, color: '#8892b0' }}>{item.email}</td>
                  <td style={{ padding: 14 }}>
                    <span style={{ padding: '6px 12px', borderRadius: 999, background: `${tierColors[item.membership_tier]}15`, color: tierColors[item.membership_tier], fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>
                      {tierLabels[item.membership_tier] || item.membership_tier}
                    </span>
                  </td>
                  <td style={{ padding: 14, color: item.membership_active ? '#64ffda' : '#ff8080' }}>{item.membership_active ? 'Active' : 'Suspended'}</td>
                  <td style={{ padding: 14, color: '#8892b0' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => handleToggleStatus(item)} style={{ padding: '8px 12px', background: item.membership_active ? '#1f2732' : '#0f2d33', border: '1px solid rgba(100,255,218,0.15)', color: '#e6f1ff', borderRadius: 12, cursor: 'pointer' }}>
                      {item.membership_active ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={() => handleShowTierModal(item)} style={{ padding: '8px 12px', background: '#121c2a', border: '1px solid rgba(100,178,218,0.15)', color: '#64ffda', borderRadius: 12, cursor: 'pointer' }}>
                      Change Tier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalType === 'tier' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: 420, maxWidth: '100%', borderRadius: 24, background: '#08141e', border: '1px solid rgba(255,255,255,0.08)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ margin: 0, color: '#e6f1ff', fontSize: 20 }}>Change Tier</h2>
              <button onClick={() => setModalType(null)} style={{ border: 'none', background: 'transparent', color: '#8892b0', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <p style={{ color: '#8892b0', marginBottom: 22 }}>Update the tier for <strong style={{ color: '#fff' }}>{selectedUser.full_name}</strong>.</p>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {tierOptions.map((tier) => (
                <button key={tier} onClick={() => setNewTier(tier)} style={{ padding: 14, borderRadius: 16, border: newTier === tier ? `1px solid ${tierColors[tier]}` : '1px solid rgba(255,255,255,0.08)', background: newTier === tier ? `${tierColors[tier]}15` : '#0d1822', color: '#e6f1ff', textAlign: 'left', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{tierLabels[tier]}</span>
                    {newTier === tier && <span style={{ color: tierColors[tier] }}>Selected</span>}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={handleSaveTier} style={{ width: '100%', padding: 14, borderRadius: 16, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Save Tier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
  const [search, setSearch] = useState('')
  const [tierF, setTierF] = useState('ALL')
  const [statF, setStatF] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modal, setModal] = useState(null) // 'credit'|'tier'|'detail'
  const [creditAmt, setCreditAmt] = useState('')
  const [creditType, setCreditType] = useState('credit')
  const [newTier, setNewTier] = useState('')
  const [actionMsg, setActionMsg] = useState(null)

  const filtered = users.filter(u => {
    const s = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const t = tierF === 'ALL' || u.tier === tierF
    const st = statF === 'ALL' || u.status === statF
    return s && t && st
  })

  const toggleSuspend = id => setUsers(l => l.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))

  const doCredit = () => {
    if (!creditAmt) return
    setUsers(l => l.map(u => u.id === selectedUser.id ? { ...u, balance: creditType === 'credit' ? u.balance + Number(creditAmt) : Math.max(0, u.balance - Number(creditAmt)) } : u))
    setActionMsg(`✅ ${creditType === 'credit' ? 'Credited' : 'Debited'} ₦${Number(creditAmt).toLocaleString()} ${creditType === 'credit' ? 'to' : 'from'} ${selectedUser.name}`)
    setModal(null); setCreditAmt('')
    setTimeout(() => setActionMsg(null), 3000)
  }

  const doTier = () => {
    if (!newTier) return
    setUsers(l => l.map(u => u.id === selectedUser.id ? { ...u, tier: newTier } : u))
    setActionMsg(`✅ ${selectedUser.name}'s tier changed to ${newTier}`)
    setModal(null); setNewTier('')
    setTimeout(() => setActionMsg(null), 3000)
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>👥 User Management</h1>
      <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Manage all {users.length} KOINOVATE members</p>

      {actionMsg && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{actionMsg}</div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Users',  value: users.length,                                color: '#64ffda' },
          { label: 'Active',       value: users.filter(u=>u.status==='Active').length,  color: '#64ffda' },
          { label: 'Suspended',    value: users.filter(u=>u.status==='Suspended').length,color: '#ff8080'},
          { label: 'Momentum',     value: users.filter(u=>u.tier==='MOMENTUM').length,  color: '#00b4d8' },
          { label: 'Pulse',        value: users.filter(u=>u.tier==='PULSE').length,     color: '#64ffda' },
          { label: 'Spark',        value: users.filter(u=>u.tier==='SPARK').length,     color: '#a8b2d8' },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14 }}>
            <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"DM Sans", sans-serif', marginBottom: 6 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, padding: '16px 20px', background: 'rgba(8,18,36,0.6)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14 }}>
        <input type="text" placeholder="🔍 Search name or email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }} />
        <select value={tierF} onChange={e => setTierF(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
          {['ALL','SPARK','PULSE','MOMENTUM'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statF} onChange={e => setStatF(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
          {['ALL','Active','Suspended'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'rgba(6,15,30,0.6)' }}>
                {['User','Tier','Status','Balance','Referrals','Tasks','Joined','Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,107,107,0.06)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,107,107,0.04)', background: i % 2 === 0 ? 'rgba(8,18,36,0.3)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${tc[u.tier]}30, transparent)`, border: `1px solid ${tc[u.tier]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc[u.tier], fontSize: 14, fontWeight: 700, fontFamily: '"Syne", sans-serif', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                      <div>
                        <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{u.name}</p>
                        <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 6, background: `${tc[u.tier]}15`, color: tc[u.tier], fontSize: 10, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>{u.tier}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc[u.status] }} />
                      <span style={{ color: sc[u.status], fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>₦{u.balance.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', textAlign: 'center' }}>{u.referrals}</td>
                  <td style={{ padding: '14px 16px', color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', textAlign: 'center' }}>{u.tasks}</td>
                  <td style={{ padding: '14px 16px', color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.joined}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button onClick={() => { setSelectedUser(u); setModal('credit') }} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(100,255,218,0.2)', background: 'rgba(100,255,218,0.06)', color: '#64ffda', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>💰</button>
                      <button onClick={() => { setSelectedUser(u); setNewTier(u.tier); setModal('tier') }} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.06)', color: '#a855f7', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>💎</button>
                      <button onClick={() => toggleSuspend(u.id)} style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${u.status === 'Active' ? 'rgba(255,107,107,0.2)' : 'rgba(100,255,218,0.2)'}`, background: u.status === 'Active' ? 'rgba(255,107,107,0.06)' : 'rgba(100,255,218,0.06)', color: u.status === 'Active' ? '#ff8080' : '#64ffda', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                        {u.status === 'Active' ? '🚫' : '✅'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Modal */}
      {modal === 'credit' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 400, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700 }}>💰 Credit / Debit Wallet</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>
              User: <strong style={{ color: '#e6f1ff' }}>{selectedUser.name}</strong><br />
              Current: <strong style={{ color: '#64ffda' }}>₦{selectedUser.balance.toLocaleString()}</strong>
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[['credit','✅ Credit'],['debit','💸 Debit']].map(([val, label]) => (
                <button key={val} onClick={() => setCreditType(val)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: `1px solid ${creditType === val ? (val === 'credit' ? 'rgba(100,255,218,0.3)' : 'rgba(255,107,107,0.3)') : 'rgba(100,100,100,0.2)'}`, background: creditType === val ? (val === 'credit' ? 'rgba(100,255,218,0.1)' : 'rgba(255,107,107,0.1)') : 'rgba(20,35,60,0.8)', color: creditType === val ? (val === 'credit' ? '#64ffda' : '#ff8080') : '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
            <input type="number" placeholder="Amount in ₦" value={creditAmt} onChange={e => setCreditAmt(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
            <button onClick={doCredit} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: creditType === 'credit' ? 'linear-gradient(135deg,#64ffda,#00b4d8)' : 'linear-gradient(135deg,#ff6b6b,#ff4040)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              {creditType === 'credit' ? '✅ Credit Wallet' : '💸 Debit Wallet'}
            </button>
          </div>
        </div>
      )}

      {/* Tier Change Modal */}
      {modal === 'tier' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 380, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700 }}>💎 Change Tier</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>Changing tier for: <strong style={{ color: '#e6f1ff' }}>{selectedUser.name}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {['SPARK','PULSE','MOMENTUM'].map(t => (
                <button key={t} onClick={() => setNewTier(t)} style={{
                  padding: '14px', borderRadius: 12, border: `1px solid ${newTier === t ? tc[t] + '40' : 'rgba(100,100,100,0.2)'}`,
                  background: newTier === t ? `${tc[t]}15` : 'rgba(20,35,60,0.8)',
                  color: newTier === t ? tc[t] : '#8892b0',
                  fontSize: 14, fontFamily: '"Orbitron", monospace', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                }}>{t} {newTier === t && '← Selected'}</button>
              ))}
            </div>
            <button onClick={doTier} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              ✅ Update Tier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}