// ============================================================
// src/app/admin/plans/page.js
// Admin membership plans management
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import '../admin.css'

export default function AdminPlans() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    tier: '',
    price: 0,
    currency: 'NGN',
    duration_days: 30,
    description: '',
    features: [],
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user === null) return
    if (user?.role !== 'admin') {
      router.push('/user/dashboard')
      return
    }
    fetchPlans()
  }, [user, router])

  const fetchPlans = async () => {
    try {
      const token = await useUserStore.getState().getToken?.()
      const res = await fetch('/api/admin/plans', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans || [])
      }
    } catch (err) {
      console.error('Failed to fetch plans', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await useUserStore.getState().getToken?.()
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Plan created successfully!')
        setFormData({
          name: '',
          tier: '',
          price: 0,
          currency: 'NGN',
          duration_days: 30,
          description: '',
          features: [],
        })
        setShowForm(false)
        fetchPlans()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (err) {
      setMessage('Failed to create plan')
    }
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ marginBottom: '30px' }}>
          <h1>💎 Membership Plans</h1>

          {message && (
            <div
              style={{
                padding: '15px',
                background: message.includes('Error') ? '#ffcdd2' : '#c8e6c9',
                color: message.includes('Error') ? '#c62828' : '#2e7d32',
                borderRadius: '8px',
                marginTop: '20px',
              }}
            >
              {message}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No plans yet</div>
          ) : (
            plans.map(plan => (
              <div
                key={plan.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>{plan.name}</h3>
                <p style={{ color: '#666', margin: '0 0 15px 0' }}>{plan.description}</p>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '10px',
                  }}
                >
                  {plan.currency === 'NGN' ? '₦' : '$'}{plan.price}
                </div>
                <p style={{ color: '#999', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                  {plan.duration_days} days
                </p>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#333',
                    margin: '15px 0',
                    padding: '15px 0',
                    borderTop: '1px solid #eee',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <strong>Features:</strong>
                  <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                    {plan.features && plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#999' }}>
          <p>Plans are predefined. To update them, use the Supabase dashboard.</p>
        </div>
      </div>
    </div>
  )
}

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-nav">
        <Link href="/admin" className="nav-item">
          📊 Dashboard
        </Link>
        <Link href="/admin/surveys" className="nav-item">
          📝 Surveys
        </Link>
        <Link href="/admin/courses" className="nav-item">
          📚 Courses
        </Link>
        <Link href="/admin/tasks" className="nav-item">
          ✅ Tasks
        </Link>
        <Link href="/admin/users" className="nav-item">
          👥 Users
        </Link>
        <Link href="/admin/plans" className="nav-item active">
          💎 Plans
        </Link>
      </nav>
    </div>
  )
}
