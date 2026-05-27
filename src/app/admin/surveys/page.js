// ============================================================
// src/app/admin/surveys/page.js
// Admin surveys management
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import '../admin.css'

export default function AdminSurveys() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 0,
    min_tier: 'free',
    status: 'active',
    redirect_url: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/user/dashboard')
      return
    }
    fetchSurveys()
  }, [user, router])

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/admin/surveys')
      if (res.ok) {
        const data = await res.json()
        setSurveys(data.surveys || [])
      }
    } catch (err) {
      console.error('Failed to fetch surveys', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Survey created successfully!')
        setFormData({
          title: '',
          description: '',
          reward: 0,
          min_tier: 'free',
          status: 'active',
          redirect_url: '',
        })
        setShowForm(false)
        fetchSurveys()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (err) {
      setMessage('Failed to create survey')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/surveys/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSurveys()
        setMessage('Survey deleted!')
      }
    } catch (err) {
      setMessage('Failed to delete survey')
    }
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>📝 Surveys Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {showForm ? 'Close' : '➕ New Survey'}
            </button>
          </div>

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

          {showForm && (
            <div
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                marginBottom: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                      Reward Amount
                    </label>
                    <input
                      type="number"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) })}
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

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                      Min Tier
                    </label>
                    <select
                      value={formData.min_tier}
                      onChange={(e) => setFormData({ ...formData, min_tier: e.target.value })}
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
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Redirect URL (External survey link)
                  </label>
                  <input
                    type="url"
                    value={formData.redirect_url}
                    onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                    placeholder="https://example.com/survey"
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

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
                  Create Survey
                </button>
              </form>
            </div>
          )}
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>All Surveys</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
          ) : surveys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No surveys yet</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Reward</th>
                  <th>Min Tier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map(survey => (
                  <tr key={survey.id}>
                    <td>{survey.title}</td>
                    <td>₦{survey.reward}</td>
                    <td>
                      <span className={`badge tier-${survey.min_tier}`}>{survey.min_tier}</span>
                    </td>
                    <td>
                      <span className={`badge ${survey.status === 'active' ? 'active' : 'inactive'}`}>
                        {survey.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/surveys/${survey.id}`} className="action-link">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(survey.id)}
                        style={{
                          marginLeft: '10px',
                          color: '#d32f2f',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
        <Link href="/admin/surveys" className="nav-item active">
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
        <Link href="/admin/plans" className="nav-item">
          💎 Plans
        </Link>
      </nav>
    </div>
  )
}
