
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'

function StatCard({ title, value, sub }) {
  return (
    <div style={{ padding: 20, background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 12 }}>
      <p style={{ color: '#8892b0', fontSize: 12, margin: 0 }}>{title}</p>
      <p style={{ color: '#e6f1ff', fontSize: 22, fontWeight: 800, margin: '8px 0' }}>{value}</p>
      {sub && <p style={{ color: '#64ffda', margin: 0 }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [plansCount, setPlansCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    if (!user) return
    if (user.role !== 'admin') return
    fetchStats()
  }, [user])

  const getAuthHeaders = async () => {
    const token = await useUserStore.getState().getToken?.()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const [uRes, pRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/plans', { headers }),
      ])

      if (!uRes.ok) throw new Error('Failed to fetch users')
      if (!pRes.ok) throw new Error('Failed to fetch plans')

      const uJson = await uRes.json()
      const pJson = await pRes.json()

      const users = uJson.users || []
      setUsersCount(users.length)
      setActiveCount(users.filter(u => u.membership_active).length)

      const plans = pJson.plans || []
      setPlansCount(plans.length)
    } catch (err) {
      console.error('[admin dashboard]', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 28, color: '#e6f1ff', margin: 0 }}>⚡ Admin Control Center</h1>
        <p style={{ color: '#8892b0', marginTop: 8 }}>Overview and quick links for admin actions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard title="Total Users" value={loading ? '...' : usersCount} sub={loading ? null : `${activeCount} active`} />
        <StatCard title="Membership Plans" value={loading ? '...' : plansCount} />
        <StatCard title="Pending Actions" value="—" />
        <StatCard title="Platform Revenue" value="₦—" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Link href="/admin/users"><button style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#64ffda', color: '#052025', fontWeight: 700 }}>Manage Users</button></Link>
        <Link href="/admin"><button style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#e6f1ff', fontWeight: 700 }}>Open Admin Console</button></Link>
      </div>
    </div>
  )
}