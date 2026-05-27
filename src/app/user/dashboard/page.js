// ============================================================
// src/app/user/dashboard/page.js
// Main user dashboard - fresh, fully functional
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import './dashboard.css'

export default function UserDashboard() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const isLoggedIn = useUserStore(state => state.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth')
      return
    }

    const fetchDashboard = async () => {
      try {
        const token = await useUserStore.getState().getToken?.()
        const res = await fetch('/api/user/dashboard', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        })

        if (res.ok) {
          const data = await res.json()
          setDashboardData(data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    )
  }

  const profile = dashboardData?.profile || {}
  const wallet = dashboardData?.wallet || {}
  const stats = dashboardData?.stats || {}

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {profile.full_name?.split(' ')[0]}! 👋</h1>
          <p>Here's your account overview</p>
        </div>
        <div className="header-right">
          <div className="membership-badge">
            <span className="tier-icon">
              {profile.membership_tier === 'premium' && '👑'}
              {profile.membership_tier === 'pulse' && '⚡'}
              {profile.membership_tier === 'free' && '🎯'}
            </span>
            <span className="tier-name">
              {profile.membership_tier === 'premium' && 'Premium'}
              {profile.membership_tier === 'pulse' && 'Pulse'}
              {profile.membership_tier === 'free' && 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="wallet-section">
        <div className="wallet-card main">
          <div className="wallet-top">
            <h3>💰 Total Balance</h3>
            <span className="balance-amount">₦{(wallet.balance || 0).toLocaleString()}</span>
          </div>
          <div className="wallet-bottom">
            <div className="stat">
              <span className="label">Total Earned</span>
              <span className="value">₦{(wallet.total_earned || 0).toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="label">Withdrawn</span>
              <span className="value">₦{(wallet.total_withdrawn || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="wallet-card">
          <h4>📊 Completed</h4>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="number">{stats.completedSurveys || 0}</span>
              <span className="label">Surveys</span>
            </div>
            <div className="stat-item">
              <span className="number">{stats.completedCourses || 0}</span>
              <span className="label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="number">{stats.completedTasks || 0}</span>
              <span className="label">Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-section">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'surveys' ? 'active' : ''}`}
            onClick={() => setActiveTab('surveys')}
          >
            📝 Surveys
          </button>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Learning
          </button>
          <button
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✅ Tasks
          </button>
          {profile.membership_tier !== 'free' && (
            <button
              className={`tab-btn ${activeTab === 'trading' ? 'active' : ''}`}
              onClick={() => setActiveTab('trading')}
            >
              🤖 AI Trading
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <Link href="/user/surveys" className="action-card">
                  <span className="icon">📝</span>
                  <span className="text">Available Surveys</span>
                </Link>
                <Link href="/user/learning" className="action-card">
                  <span className="icon">📚</span>
                  <span className="text">Learning Path</span>
                </Link>
                <Link href="/user/tasks" className="action-card">
                  <span className="icon">✅</span>
                  <span className="text">Daily Tasks</span>
                </Link>
                <Link href="/membership" className="action-card">
                  <span className="icon">💎</span>
                  <span className="text">Upgrade Plan</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Surveys Tab */}
        {activeTab === 'surveys' && (
          <div className="tab-content">
            <h3>Available Surveys</h3>
            <SurveysSection />
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="tab-content">
            <h3>Learning Courses</h3>
            <CoursesSection />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="tab-content">
            <h3>Daily Tasks</h3>
            <TasksSection />
          </div>
        )}

        {/* Trading Tab */}
        {profile.membership_tier !== 'free' && activeTab === 'trading' && (
          <div className="tab-content">
            <h3>🤖 AI Trading Signals</h3>
            <div className="trading-placeholder">
              <p>Premium feature - AI trading signals coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SurveysSection() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch('/api/user/surveys/available')
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

    fetchSurveys()
  }, [])

  if (loading) return <div className="loading">Loading surveys...</div>
  if (surveys.length === 0) return <div className="empty">No surveys available</div>

  return (
    <div className="items-grid">
      {surveys.map(survey => (
        <div key={survey.id} className="item-card">
          <h4>{survey.title}</h4>
          <p>{survey.description}</p>
          <div className="item-footer">
            <span className="reward">₦{survey.reward}</span>
            {survey.redirect_url ? (
              <a href={survey.redirect_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Take Survey →
              </a>
            ) : (
              <button className="btn-secondary" disabled>
                Coming Soon
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/user/courses/available')
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
        }
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <div className="loading">Loading courses...</div>
  if (courses.length === 0) return <div className="empty">No courses available</div>

  return (
    <div className="items-grid">
      {courses.map(course => (
        <div key={course.id} className="item-card">
          {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="item-thumbnail" />}
          <h4>{course.title}</h4>
          <p>{course.description}</p>
          <div className="item-footer">
            <span className="status">{course.completed ? '✅ Completed' : '📖 Learn'}</span>
            {course.redirect_url ? (
              <a href={course.redirect_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View Course →
              </a>
            ) : (
              <button className="btn-secondary" disabled>
                Coming Soon
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function TasksSection() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/user/tasks/available')
        if (res.ok) {
          const data = await res.json()
          setTasks(data.tasks || [])
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (loading) return <div className="loading">Loading tasks...</div>
  if (tasks.length === 0) return <div className="empty">No tasks available</div>

  return (
    <div className="items-grid">
      {tasks.map(task => (
        <div key={task.id} className="item-card">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <div className="task-meta">
            <span className="reward">Reward: ₦{task.reward}</span>
            <span className="frequency">{task.frequency}</span>
          </div>
          <div className="item-footer">
            {task.redirect_url ? (
              <a href={task.redirect_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Do Task →
              </a>
            ) : (
              <button className="btn-secondary" disabled>
                Coming Soon
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
