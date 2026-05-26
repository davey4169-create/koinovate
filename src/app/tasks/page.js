'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const USER_TIER = 'momentum'

const tierLimits = { spark: 5, pulse: 12, momentum: Infinity }
const tierRewards = { spark: 2000, pulse: 8000, momentum: 16000 }
const tierColors = { spark: '#a8b2d8', pulse: '#64ffda', momentum: '#00b4d8' }

const allTasks = [
  { id: 1,  icon: '▶️',  title: 'Watch Brand Video',          desc: 'Watch the KOINOVATE intro video (3 mins)',        reward: 500,  duration: '3 min',   category: 'Content',  tier: 'spark'    },
  { id: 2,  icon: '📘',  title: 'Follow KOINOVATE on Facebook', desc: 'Follow our official Facebook page',             reward: 300,  duration: '1 min',   category: 'Social',   tier: 'spark'    },
  { id: 3,  icon: '🐦',  title: 'Follow on Twitter/X',         desc: 'Follow @KoinovateHQ on Twitter',                reward: 300,  duration: '1 min',   category: 'Social',   tier: 'spark'    },
  { id: 4,  icon: '📸',  title: 'Follow on Instagram',         desc: 'Follow KOINOVATE on Instagram',                 reward: 300,  duration: '1 min',   category: 'Social',   tier: 'spark'    },
  { id: 5,  icon: '🔔',  title: 'Subscribe on YouTube',        desc: 'Subscribe to the KOINOVATE YouTube channel',    reward: 500,  duration: '2 min',   category: 'Content',  tier: 'spark'    },
  { id: 6,  icon: '📝',  title: 'Daily Finance Quiz',          desc: 'Answer 5 financial literacy questions',         reward: 1000, duration: '5 min',   category: 'Learning', tier: 'spark'    },
  { id: 7,  icon: '🔗',  title: 'Share Referral Link',         desc: 'Share your KOINOVATE link on any platform',     reward: 2000, duration: '2 min',   category: 'Referral', tier: 'pulse'    },
  { id: 8,  icon: '💬',  title: 'Leave a Review',              desc: 'Write a review on Google or Trustpilot',        reward: 3000, duration: '5 min',   category: 'Content',  tier: 'pulse'    },
  { id: 9,  icon: '📊',  title: 'Complete Market Survey',      desc: 'Fill out a 10-question market analysis survey', reward: 2500, duration: '10 min',  category: 'Survey',   tier: 'pulse'    },
  { id: 10, icon: '🎥',  title: 'Watch Trading Tutorial',      desc: 'Watch a 15-minute AI trading tutorial',         reward: 3500, duration: '15 min',  category: 'Learning', tier: 'pulse'    },
  { id: 11, icon: '📰',  title: 'Share KOINOVATE Article',     desc: 'Share a KOINOVATE blog post on LinkedIn',       reward: 4000, duration: '3 min',   category: 'Social',   tier: 'pulse'    },
  { id: 12, icon: '🤝',  title: 'Refer a Friend (Pulse+)',     desc: 'Invite a friend to join KOINOVATE',             reward: 5000, duration: '5 min',   category: 'Referral', tier: 'pulse'    },
  { id: 13, icon: '🏆',  title: 'Complete Platform Tour',      desc: 'Explore all KOINOVATE features (guided tour)',  reward: 8000, duration: '20 min',  category: 'Learning', tier: 'momentum' },
  { id: 14, icon: '💎',  title: 'VIP Community Post',          desc: 'Post in the Momentum VIP community group',      reward: 6000, duration: '5 min',   category: 'Social',   tier: 'momentum' },
  { id: 15, icon: '📈',  title: 'Execute a Live Trade',        desc: 'Place a trade using the AI Trading Hub',        reward: 10000,'duration': '10 min', category: 'Trading',  tier: 'momentum' },
  { id: 16, icon: '🎯',  title: 'Weekly Momentum Challenge',   desc: 'Complete all 12 standard tasks this week',      reward: 16000,'duration': '1 week', category: 'Challenge','tier': 'momentum'},
]

const categories = ['All', 'Social', 'Content', 'Learning', 'Referral', 'Survey', 'Trading', 'Challenge']
const tierOrder = { spark: 0, pulse: 1, momentum: 2 }
const canAccess = (taskTier) => tierOrder[USER_TIER] >= tierOrder[taskTier]

export default function TasksPage() {
  const [completed, setCompleted] = useState({})
  const [filter, setFilter] = useState('All')
  const [timeLeft, setTimeLeft] = useState('')
  const [activeTask, setActiveTask] = useState(null)
  const [taskTimer, setTaskTimer] = useState(0)

  const taskLimit = tierLimits[USER_TIER]
  const maxReward = tierRewards[USER_TIER]
  const completedCount = Object.values(completed).filter(Boolean).length
  const totalEarned = allTasks.filter(t => completed[t.id]).reduce((sum, t) => sum + t.reward, 0)

  // Daily reset countdown
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const startTask = task => {
    if (!canAccess(task.tier) || completed[task.id] || completedCount >= taskLimit) return
    setActiveTask(task)
    setTaskTimer(0)
    const timer = setInterval(() => setTaskTimer(t => t + 1), 1000)
    setTimeout(() => {
      clearInterval(timer)
      setCompleted(prev => ({ ...prev, [task.id]: true }))
      setActiveTask(null)
    }, 8000) // Simulate 8 second task
  }

  const accessible = allTasks.filter(t => canAccess(t.tier))
  const locked = allTasks.filter(t => !canAccess(t.tier))
  const filtered = filter === 'All'
    ? allTasks
    : allTasks.filter(t => t.category === filter)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>
      <style>{`@keyframes taskSpin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>

      {/* Active Task Modal */}
      {activeTask && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(13,28,50,0.99)', border: '1px solid rgba(100,255,218,0.2)', borderRadius: 24, padding: '48px 40px', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'taskSpin 2s linear infinite', display: 'inline-block' }}>{activeTask.icon}</div>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{activeTask.title}</h3>
            <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Completing task... please wait</p>
            <div style={{ height: 8, background: 'rgba(100,255,218,0.1)', borderRadius: 4, marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${Math.min(100, (taskTimer / 8) * 100)}%`, background: 'linear-gradient(90deg, #64ffda, #00b4d8)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 28, fontWeight: 700 }}>+₦{activeTask.reward.toLocaleString()}</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginTop: 8 }}>Reward pending...</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(30px, 5vw, 54px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
          📋 Daily{' '}
          <span style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tasks</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 16, fontFamily: '"DM Sans", sans-serif', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.7, position: 'relative' }}>
          Complete simple tasks every day and earn real cash. Earn up to <strong style={{ color: '#a855f7' }}>₦{maxReward.toLocaleString()}/task</strong> on your tier.
        </p>

        {/* Reset timer */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 12, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', marginBottom: 24, position: 'relative' }}>
          <span style={{ color: '#a855f7', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>🔄 Resets in:</span>
          <span style={{ fontFamily: '"Orbitron", monospace', color: '#e6f1ff', fontSize: 15, fontWeight: 700 }}>{timeLeft}</span>
        </div>
      </section>

      {/* Progress Banner */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ padding: '22px 28px', background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(17,34,64,0.8))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 18, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>
                Tasks Completed: <strong style={{ color: '#e6f1ff' }}>{completedCount}/{taskLimit === Infinity ? 'Unlimited' : taskLimit}</strong>
              </p>
              <p style={{ color: '#a855f7', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                Earned: ₦{totalEarned.toLocaleString()}
              </p>
            </div>
            <div style={{ height: 8, background: 'rgba(168,85,247,0.1)', borderRadius: 4 }}>
              <div style={{ height: '100%', width: taskLimit === Infinity ? '0%' : `${(completedCount / taskLimit) * 100}%`, background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Orbitron", monospace', color: tierColors[USER_TIER], fontSize: 18, fontWeight: 700 }}>{taskLimit === Infinity ? '∞' : taskLimit - completedCount}</p>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Tasks Left</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Orbitron", monospace', color: '#a855f7', fontSize: 18, fontWeight: 700 }}>₦{((taskLimit === Infinity ? 16 : taskLimit) * maxReward).toLocaleString()}</p>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Max Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier rewards info */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[['SPARK','5 tasks','₦2,000/task','#a8b2d8'],['PULSE','12 tasks','₦8,000/task','#64ffda'],['MOMENTUM','Unlimited','₦16,000/task','#00b4d8']].map(([tier, limit, reward, color]) => (
          <div key={tier} style={{ flex: 1, minWidth: 160, padding: '14px 18px', background: USER_TIER === tier.toLowerCase() ? `${color}10` : 'rgba(17,34,64,0.5)', border: `1px solid ${USER_TIER === tier.toLowerCase() ? color + '30' : 'rgba(100,255,218,0.06)'}`, borderRadius: 14 }}>
            <p style={{ fontFamily: '"Orbitron", monospace', color, fontSize: 11, letterSpacing: '0.12em', marginBottom: 4 }}>{tier} {USER_TIER === tier.toLowerCase() && '← YOU'}</p>
            <p style={{ color: '#e6f1ff', fontSize: 15, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>{limit}</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{reward}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '8px 16px', borderRadius: 20,
            border: `1px solid ${filter === c ? 'rgba(168,85,247,0.4)' : 'rgba(100,255,218,0.1)'}`,
            background: filter === c ? 'rgba(168,85,247,0.1)' : 'transparent',
            color: filter === c ? '#a855f7' : '#8892b0',
            fontSize: 13, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
          }}>{c}</button>
        ))}
      </div>

      {/* Tasks Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(task => {
            const accessible = canAccess(task.tier)
            const done = completed[task.id]
            const atLimit = completedCount >= taskLimit && !done
            return (
              <div key={task.id} style={{
                padding: '22px', background: done ? 'rgba(100,255,218,0.04)' : 'rgba(17,34,64,0.6)',
                border: `1px solid ${done ? 'rgba(100,255,218,0.2)' : accessible ? 'rgba(100,255,218,0.07)' : 'rgba(100,100,100,0.1)'}`,
                borderRadius: 18, opacity: (!accessible || atLimit) && !done ? 0.6 : 1,
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? 'rgba(100,255,218,0.1)' : 'rgba(168,85,247,0.1)', border: `1px solid ${done ? 'rgba(100,255,218,0.2)' : 'rgba(168,85,247,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {done ? '✅' : task.icon}
                  </div>
                  <div style={{ display: 'flex', flex: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 6, background: `${tierColors[task.tier]}15`, color: tierColors[task.tier], fontSize: 10, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>{task.tier.toUpperCase()}</span>
                    <span style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>⏱ {task.duration}</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: '"Syne", sans-serif', color: done ? '#64ffda' : '#e6f1ff', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{task.title}</h3>
                <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6, marginBottom: 16 }}>{task.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: '"Orbitron", monospace', color: done ? '#64ffda' : '#a855f7', fontSize: 16, fontWeight: 700 }}>+₦{task.reward.toLocaleString()}</p>
                  <button onClick={() => startTask(task)} disabled={!accessible || done || atLimit} style={{
                    padding: '8px 18px', borderRadius: 9, border: 'none',
                    background: done ? 'rgba(100,255,218,0.1)' : !accessible ? 'rgba(100,100,100,0.2)' : atLimit ? 'rgba(100,100,100,0.2)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                    color: done ? '#64ffda' : !accessible || atLimit ? '#666' : '#fff',
                    fontWeight: 700, fontSize: 12, fontFamily: '"DM Sans", sans-serif',
                    cursor: accessible && !done && !atLimit ? 'pointer' : 'not-allowed',
                  }}>
                    {done ? '✅ Done' : !accessible ? '🔒 Upgrade' : atLimit ? '⏳ Limit' : 'Start →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}