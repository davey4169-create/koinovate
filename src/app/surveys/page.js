'use client'
import { useState } from 'react'
import Link from 'next/link'

const surveyList = [
  { id: 1, title: 'Global Consumer Spending Habits 2025', reward: '$5',  time: '8 min',  questions: 12, category: 'Finance',    difficulty: 'Easy',   tier: 'spark',    available: true },
  { id: 2, title: 'AI & Technology Adoption Survey',      reward: '$10', time: '12 min', questions: 18, category: 'Technology', difficulty: 'Medium', tier: 'pulse',    available: true },
  { id: 3, title: 'Cryptocurrency Investment Patterns',   reward: '$10', time: '10 min', questions: 15, category: 'Crypto',     difficulty: 'Medium', tier: 'pulse',    available: true },
  { id: 4, title: 'Luxury Brand Preference Study',        reward: '$25', time: '15 min', questions: 22, category: 'Lifestyle',  difficulty: 'Medium', tier: 'momentum', available: true },
  { id: 5, title: 'Healthcare & Wellness 2025 Report',    reward: '$35', time: '18 min', questions: 28, category: 'Health',     difficulty: 'Hard',   tier: 'momentum', available: true },
  { id: 6, title: 'Premium Financial Products Research',  reward: '$50', time: '25 min', questions: 35, category: 'Finance',    difficulty: 'Hard',   tier: 'momentum', available: true },
]

const sampleQuestions = [
  { q: 'How often do you make online purchases per week?', opts: ['Never', '1–2 times', '3–5 times', 'Daily'] },
  { q: 'What is your primary method of payment?', opts: ['Cash', 'Debit Card', 'Credit Card', 'Mobile Money'] },
  { q: 'How much do you typically spend monthly on subscriptions?', opts: ['Under ₦5,000', '₦5,000–₦20,000', '₦20,000–₦50,000', 'Above ₦50,000'] },
  { q: 'Which financial goal is most important to you?', opts: ['Save for emergency fund', 'Invest in stocks/crypto', 'Pay off debts', 'Build passive income'] },
  { q: 'How satisfied are you with your current income level?', opts: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'] },
]

const tierColors = { spark: '#a8b2d8', pulse: '#64ffda', momentum: '#00b4d8' }
const tierLabels = { spark: 'SPARK', pulse: 'PULSE', momentum: 'MOMENTUM' }

// User tier — change this to 'pulse' or 'momentum' to unlock more
const USER_TIER = 'pulse'
const tierOrder = { spark: 0, pulse: 1, momentum: 2 }

export default function SurveysPage() {
  const [activeSurvey, setActiveSurvey] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [filter, setFilter] = useState('all')

  const canAccess = tier => tierOrder[USER_TIER] >= tierOrder[tier]

  const startSurvey = s => {
    if (!canAccess(s.tier)) return
    setActiveSurvey(s); setCurrentQ(0); setAnswers({}); setDone(false)
  }

  const answer = opt => {
    const newAns = { ...answers, [currentQ]: opt }
    setAnswers(newAns)
    if (currentQ < sampleQuestions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300)
    } else {
      setTimeout(() => setDone(true), 300)
    }
  }

  const filtered = surveyList.filter(s => filter === 'all' || s.tier === filter)

  if (activeSurvey) return (
    <div style={{ minHeight: '100vh', background: '#0a192f', paddingTop: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
      <div style={{ maxWidth: 600, width: '100%' }}>

        {/* Back */}
        <button onClick={() => setActiveSurvey(null)} style={{ background: 'none', border: 'none', color: '#64ffda', cursor: 'pointer', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Surveys
        </button>

        <div style={{ padding: '32px', background: 'rgba(17,34,64,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(100,255,218,0.12)', borderRadius: 24 }}>

          {!done ? (
            <>
              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Question {currentQ + 1} of {sampleQuestions.length}</p>
                <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Reward: <span style={{ color: '#64ffda' }}>{activeSurvey.reward}</span></p>
              </div>
              <div style={{ height: 5, background: 'rgba(100,255,218,0.1)', borderRadius: 3, marginBottom: 28 }}>
                <div style={{ height: '100%', width: `${((currentQ + 1) / sampleQuestions.length) * 100}%`, background: 'linear-gradient(90deg, #64ffda, #00b4d8)', borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>

              <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700, marginBottom: 28, lineHeight: 1.4 }}>
                {sampleQuestions[currentQ].q}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sampleQuestions[currentQ].opts.map((opt, i) => (
                  <button key={i} onClick={() => answer(opt)} style={{
                    padding: '15px 20px', borderRadius: 12, border: '1px solid rgba(100,255,218,0.12)',
                    background: answers[currentQ] === opt ? 'rgba(100,255,218,0.12)' : 'rgba(10,25,47,0.6)',
                    color: answers[currentQ] === opt ? '#64ffda' : '#a8b2d8',
                    fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s', fontWeight: answers[currentQ] === opt ? 600 : 400,
                    borderColor: answers[currentQ] === opt ? 'rgba(100,255,218,0.4)' : 'rgba(100,255,218,0.12)',
                  }}
                  onMouseEnter={e => { if (answers[currentQ] !== opt) e.currentTarget.style.background = 'rgba(100,255,218,0.06)' }}
                  onMouseLeave={e => { if (answers[currentQ] !== opt) e.currentTarget.style.background = 'rgba(10,25,47,0.6)' }}
                  >
                    <span style={{ marginRight: 10, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
              <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#64ffda', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Survey Complete!</h2>
              <p style={{ color: '#a8b2d8', fontSize: 16, fontFamily: '"DM Sans", sans-serif', marginBottom: 8 }}>
                You've earned <strong style={{ color: '#64ffda', fontSize: 20 }}>{activeSurvey.reward}</strong>
              </p>
              <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 32 }}>
                Reward will be credited to your Revenue Share wallet within 24 hours.
              </p>
              <button onClick={() => setActiveSurvey(null)} style={{ padding: '14px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                Take Another Survey →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <section style={{ padding: '60px 28px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,180,216,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(30px, 5vw, 54px)', fontWeight: 800, marginBottom: 16 }}>
          📊 Online{' '}
          <span style={{ background: 'linear-gradient(135deg, #64ffda, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Surveys</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 16, fontFamily: '"DM Sans", sans-serif', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Share your opinion. Get paid. Earn up to <strong style={{ color: '#64ffda' }}>$50 per survey</strong> based on your membership tier.
        </p>

        {/* Tier earnings */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[['SPARK','Up to $5/survey','#a8b2d8'],['PULSE','Up to $10/survey','#64ffda'],['MOMENTUM','Up to $50/survey','#00b4d8']].map(([tier, earn, color]) => (
            <div key={tier} style={{ padding: '12px 20px', background: 'rgba(17,34,64,0.6)', border: `1px solid ${color}30`, borderRadius: 14 }}>
              <p style={{ fontFamily: '"Orbitron", monospace', color: color, fontSize: 11, letterSpacing: '0.12em', marginBottom: 4 }}>{tier}</p>
              <p style={{ color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{earn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 32px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[['📊','6','Available Now'],['💰','$1,300','Total Potential'],['⏱','8–25 min','Survey Length'],['🏆','$10','Avg Reward']].map(([icon, val, label]) => (
          <div key={label} style={{ flex: 1, minWidth: 140, padding: '18px', background: 'rgba(17,34,64,0.6)', border: '1px solid rgba(100,255,218,0.07)', borderRadius: 14, textAlign: 'center' }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 20, fontWeight: 700, margin: '6px 0 4px' }}>{val}</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 24px', display: 'flex', gap: 10 }}>
        {[['all','All Surveys'],['spark','SPARK'],['pulse','PULSE'],['momentum','MOMENTUM']].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter === id ? 'rgba(100,255,218,0.3)' : 'rgba(100,255,218,0.1)'}`,
            background: filter === id ? 'rgba(100,255,218,0.1)' : 'transparent',
            color: filter === id ? '#64ffda' : '#8892b0',
            fontSize: 13, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
          }}>{label}</button>
        ))}
      </div>

      {/* Survey cards */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map(s => {
            const accessible = canAccess(s.tier)
            const color = tierColors[s.tier]
            return (
              <div key={s.id} style={{
                padding: '26px', background: 'rgba(17,34,64,0.6)',
                border: `1px solid ${accessible ? 'rgba(100,255,218,0.08)' : 'rgba(100,255,218,0.04)'}`,
                borderRadius: 20, position: 'relative',
                opacity: accessible ? 1 : 0.6,
                filter: accessible ? 'none' : 'grayscale(30%)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => accessible && (e.currentTarget.style.border = '1px solid rgba(100,255,218,0.2)')}
              onMouseLeave={e => accessible && (e.currentTarget.style.border = '1px solid rgba(100,255,218,0.08)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, background: `${color}15`, color: color, fontSize: 11, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{s.category}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(100,255,218,0.06)', border: `1px solid ${color}30`, color: color, fontSize: 10, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>
                    {!accessible ? '🔒 ' : ''}{tierLabels[s.tier]}
                  </span>
                </div>
                <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>⏱ {s.time}</span>
                  <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>📝 {s.questions} questions</span>
                  <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{s.difficulty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 22, fontWeight: 700 }}>{s.reward}</p>
                  <button onClick={() => startSurvey(s)} style={{
                    padding: '10px 20px', borderRadius: 10, border: 'none', cursor: accessible ? 'pointer' : 'not-allowed',
                    background: accessible ? 'linear-gradient(135deg, #64ffda, #00b4d8)' : 'rgba(100,100,100,0.2)',
                    color: accessible ? '#0a192f' : '#666',
                    fontWeight: 700, fontSize: 13, fontFamily: '"DM Sans", sans-serif',
                  }}>
                    {accessible ? 'Start Survey →' : 'Upgrade to Unlock'}
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