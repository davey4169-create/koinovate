// ============================================================
// src/app/admin/users/[id]/page.js
// Admin user detail edit page
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import '../../admin.css'

export default function AdminUserDetail() {
  const router = useRouter()
  const params = useParams()
  const user = useUserStore(state => state.user)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    role: 'user',
    membership_tier: 'free',
    membership_active: false,
    membership_end_date: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/user/dashboard')
      return
    }
    fetchUser()
  }, [user, router, params.id])

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setUserData(data.user)
        setFormData({
          role: data.user.role,
          membership_tier: data.user.membership_tier,
          membership_active: data.user.membership_active,
          membership_end_date: data.user.membership_end_date || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch user', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('User updated successfully!')
        fetchUser()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (err) {
      setMessage('Failed to update user')
    }
  }

  if (user?.role !== 'admin') return null

  if (loading) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ marginBottom: '30px' }}>
          <Link href="/admin/users" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← Back to Users
          </Link>
        </div>

        <h1>Edit User: {userData.full_name}</h1>

        {message && (
          <div
            style={{
              padding: '15px',
              background: message.includes('Error') ? '#ffcdd2' : '#c8e6c9',
              color: message.includes('Error') ? '#c62828' : '#2e7d32',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ marginBottom: '30px' }}>
            <h3>User Information</h3>
            <p style={{ color: '#666', margin: '10px 0' }}>
              <strong>Email:</strong> {userData.email}
            </p>
            <p style={{ color: '#666', margin: '10px 0' }}>
              <strong>Phone:</strong> {userData.phone || 'Not provided'}
            </p>
            <p style={{ color: '#666', margin: '10px 0' }}>
              <strong>Joined:</strong> {new Date(userData.created_at).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Membership Tier
              </label>
              <select
                value={formData.membership_tier}
                onChange={(e) => setFormData({ ...formData, membership_tier: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="free">Free</option>
                <option value="pulse">Pulse</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500', color: '#333' }}>
                <input
                  type="checkbox"
                  checked={formData.membership_active}
                  onChange={(e) => setFormData({ ...formData, membership_active: e.target.checked })}
                />
                Active Membership
              </label>
            </div>

            {formData.membership_active && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Membership End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.membership_end_date}
                  onChange={(e) => setFormData({ ...formData, membership_end_date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Save Changes
            </button>
          </form>
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
        <Link href="/admin/users" className="nav-item active">
          👥 Users
        </Link>
        <Link href="/admin/plans" className="nav-item">
          💎 Plans
        </Link>
      </nav>
    </div>
  )
}
