'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { authFetch } from '@/lib/clientApi'

export default function SurveysPage() {
  const router = useRouter()
  const isLoggedIn = useUserStore(state => state.isLoggedIn)
  const [hydrated, setHydrated] = useState(false)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) {
      router.replace('/auth')
      return
    }

    const loadSurveys = async () => {
      try {
        const res = await authFetch('/api/user/surveys/available')
        if (!res.ok) throw new Error('Failed to load surveys')
        const data = await res.json()
        setSurveys(data.surveys || [])
      } catch (error) {
        console.error(error)
        setMessage('Unable to load surveys. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    loadSurveys()
  }, [hydrated, isLoggedIn, router])

  const markComplete = async (surveyId) => {
    try {
      const res = await authFetch(`/api/user/surveys/${surveyId}/complete`, {
        method: 'POST',
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Unable to complete survey')
      }
      setSurveys(prev => prev.map(s => s.id === surveyId ? { ...s, completed: true } : s))
      setMessage('Survey marked complete successfully.')
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Unable to complete survey')
    }
  }

  if (!hydrated) {
    return null
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a192f', paddingTop: 88, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <p style={{ color: '#64ffda', fontFamily: '"Orbitron", monospace', fontSize: 12, letterSpacing: '0.18em', marginBottom: 14 }}>SURVEYS</p>
          <h1 style={{ color: '#e6f1ff', fontFamily: '"Syne", sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: 14 }}>Trusted surveys with direct rewards</h1>
          <p style={{ color: '#8892b0', fontFamily: '"DM Sans", sans-serif', fontSize: 15, maxWidth: 720, margin: '0 auto' }}>
            Browse available surveys, open secure redirect links, and mark them complete once you finish. Your membership tier controls the surveys you can access.
          </p>
        </div>

        {message && (
          <div style={{ marginBottom: 26, padding: 18, borderRadius: 16, background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.18)', color: '#64ffda' }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 32, borderRadius: 20, background: 'rgba(17,34,64,0.85)', border: '1px solid rgba(100,255,218,0.08)', color: '#8892b0', textAlign: 'center' }}>Loading available surveys…</div>
        ) : surveys.length === 0 ? (
          <div style={{ padding: 32, borderRadius: 20, background: 'rgba(17,34,64,0.85)', border: '1px solid rgba(100,255,218,0.08)', color: '#8892b0', textAlign: 'center' }}>No surveys are available for your current tier yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {surveys.map((survey) => (
              <div key={survey.id} style={{ borderRadius: 24, background: 'rgba(17,34,64,0.86)', border: '1px solid rgba(100,255,218,0.12)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ background: 'rgba(100,255,218,0.08)', color: '#64ffda', fontSize: 11, fontFamily: '"Orbitron", monospace', padding: '6px 10px', borderRadius: 999 }}>{survey.min_tier?.toUpperCase() || 'FREE'}</span>
                    <span style={{ color: survey.completed ? '#64ffda' : '#a8b2d8', fontFamily: '"DM Sans", sans-serif', fontSize: 12 }}>{survey.completed ? 'Completed' : 'Pending'}</span>
                  </div>
                  <h2 style={{ color: '#e6f1ff', fontFamily: '"Syne", sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{survey.title}</h2>
                  <p style={{ color: '#8892b0', fontSize: 14, lineHeight: 1.75, fontFamily: '"DM Sans", sans-serif', marginBottom: 22 }}>{survey.description || 'Complete this survey to earn a direct reward in your wallet.'}</p>
                </div>

                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: '#64ffda', fontFamily: '"Orbitron", monospace', fontSize: 16 }}>₦{survey.reward}</span>
                    <span style={{ color: '#8892b0', fontFamily: '"DM Sans", sans-serif', fontSize: 13 }}>{survey.frequency || 'One-time'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <a href={survey.redirect_url || '#'} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 130, padding: '14px 18px', borderRadius: 14, background: 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', textAlign: 'center', fontWeight: 700, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>{survey.redirect_url ? 'Go to Survey' : 'No redirect available'}</a>
                    <button onClick={() => markComplete(survey.id)} disabled={survey.completed} style={{ flex: 1, minWidth: 130, padding: '14px 18px', borderRadius: 14, border: 'none', background: survey.completed ? 'rgba(100,255,218,0.14)' : 'rgba(255,255,255,0.08)', color: survey.completed ? '#64ffda' : '#e6f1ff', cursor: survey.completed ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>
                      {survey.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
