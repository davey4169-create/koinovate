'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Data ──────────────────────────────────────────────────────
const categories = ['All Courses', 'Trading Basics', 'AI & Crypto', 'Wealth Building', 'DeFi', 'Stock Market', 'Mindset']

const courses = [
  {
    id: 1, category: 'Trading Basics',
    title: 'Trading Fundamentals Masterclass',
    instructor: 'Dr. Emeka Okafor',
    duration: '6h 30m', lessons: 24, level: 'Beginner',
    rating: 4.9, students: 12400,
    color: '#64ffda',
    icon: '📈',
    description: 'Master the foundations of trading — charts, patterns, risk management, and your first live trade.',
    tags: ['Charts', 'Risk Management', 'Live Trading'],
    featured: true,
  },
  {
    id: 2, category: 'AI & Crypto',
    title: 'AI-Powered Crypto Trading',
    instructor: 'Fatima Al-Hassan',
    duration: '8h 15m', lessons: 32, level: 'Intermediate',
    rating: 4.8, students: 9800,
    color: '#00b4d8',
    icon: '🤖',
    description: 'Use AI signals and bots to automate crypto trades and maximise daily profits.',
    tags: ['AI Signals', 'Automation', 'Crypto'],
    featured: true,
  },
  {
    id: 3, category: 'Wealth Building',
    title: 'Building a ₦1M Monthly Income',
    instructor: 'Chidi Nwachukwu',
    duration: '5h 45m', lessons: 20, level: 'Beginner',
    rating: 4.9, students: 18700,
    color: '#ffd700',
    icon: '💰',
    description: 'Proven strategies to build multiple income streams and reach your first ₦1M monthly.',
    tags: ['Income Streams', 'Passive Income', 'Strategy'],
    featured: false,
  },
  {
    id: 4, category: 'DeFi',
    title: 'Advanced DeFi Strategies',
    instructor: 'Yusuf Abdullahi',
    duration: '7h 00m', lessons: 28, level: 'Advanced',
    rating: 4.7, students: 5600,
    color: '#a855f7',
    icon: '⛓️',
    description: 'Yield farming, liquidity pools, and advanced DeFi protocols that generate passive income.',
    tags: ['Yield Farming', 'Liquidity', 'Protocols'],
    featured: false,
  },
  {
    id: 5, category: 'Stock Market',
    title: 'Nigerian Stock Exchange Mastery',
    instructor: 'Adaeze Obi',
    duration: '4h 20m', lessons: 16, level: 'Beginner',
    rating: 4.8, students: 7200,
    color: '#fb923c',
    icon: '🏦',
    description: 'Navigate the NSE with confidence — from opening your account to your first profitable trade.',
    tags: ['NSE', 'Stocks', 'Dividends'],
    featured: false,
  },
  {
    id: 6, category: 'Mindset',
    title: 'Wealth Psychology & Mindset',
    instructor: 'Dr. Ngozi Eze',
    duration: '3h 50m', lessons: 14, level: 'All Levels',
    rating: 5.0, students: 22100,
    color: '#f472b6',
    icon: '🧠',
    description: 'Rewire your money mindset, break financial blocks, and adopt the psychology of the wealthy.',
    tags: ['Mindset', 'Psychology', 'Habits'],
    featured: false,
  },
  {
    id: 7, category: 'AI & Crypto',
    title: 'Bitcoin & Altcoin Deep Dive',
    instructor: 'Fatima Al-Hassan',
    duration: '6h 10m', lessons: 22, level: 'Intermediate',
    rating: 4.7, students: 8300,
    color: '#f59e0b',
    icon: '₿',
    description: 'Comprehensive analysis of Bitcoin, top altcoins, and how to position for maximum gains.',
    tags: ['Bitcoin', 'Altcoins', 'Analysis'],
    featured: false,
  },
  {
    id: 8, category: 'Wealth Building',
    title: 'Real Estate & Digital Assets',
    instructor: 'Chidi Nwachukwu',
    duration: '5h 30m', lessons: 18, level: 'Intermediate',
    rating: 4.8, students: 6700,
    color: '#34d399',
    icon: '🏘️',
    description: 'Combine real estate investment with digital assets to build a bulletproof wealth portfolio.',
    tags: ['Real Estate', 'Portfolio', 'Assets'],
    featured: false,
  },
]

const instructors = [
  { name: 'Dr. Emeka Okafor',   role: 'Trading Expert',          courses: 3, students: '34K', avatar: '👨🏾‍💼', color: '#64ffda' },
  { name: 'Fatima Al-Hassan',   role: 'AI & Crypto Specialist',  courses: 2, students: '18K', avatar: '👩🏽‍💻', color: '#00b4d8' },
  { name: 'Chidi Nwachukwu',    role: 'Wealth Strategist',       courses: 2, students: '25K', avatar: '👨🏿‍🏫', color: '#ffd700' },
  { name: 'Dr. Ngozi Eze',      role: 'Financial Psychologist',  courses: 1, students: '22K', avatar: '👩🏾‍🎓', color: '#f472b6' },
]

// ── Course Card ───────────────────────────────────────────────
function CourseCard({ course, locked }) {
  return (
    <div style={{
      background: 'rgba(17,34,64,0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(100,255,218,0.08)',
      borderRadius: 20, overflow: 'hidden',
      transition: 'all 0.3s',
      position: 'relative',
      filter: locked ? 'brightness(0.4)' : 'none',
    }}
    onMouseEnter={e => {
      if (!locked) {
        e.currentTarget.style.border = '1px solid rgba(100,255,218,0.2)'
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.border = '1px solid rgba(100,255,218,0.08)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Course Banner */}
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, ${course.color}20, rgba(17,34,64,0.9))`,
        borderBottom: `1px solid ${course.color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, position: 'relative',
      }}>
        {course.icon}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(10,25,47,0.8)',
          border: `1px solid ${course.color}40`,
          color: course.color, fontSize: 11,
          fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
        }}>{course.level}</div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'inline-block', padding: '3px 10px',
          borderRadius: 6, background: `${course.color}15`,
          color: course.color, fontSize: 11,
          fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
          marginBottom: 10, letterSpacing: '0.05em',
        }}>{course.category}</div>

        <h3 style={{
          fontFamily: '"Syne", sans-serif',
          color: '#e6f1ff', fontSize: 16,
          fontWeight: 700, marginBottom: 8, lineHeight: 1.3,
        }}>{course.title}</h3>

        <p style={{
          color: '#8892b0', fontSize: 12,
          fontFamily: '"DM Sans", sans-serif',
          lineHeight: 1.6, marginBottom: 14,
        }}>{course.description}</p>

        <p style={{
          color: '#a8b2d8', fontSize: 12,
          fontFamily: '"DM Sans", sans-serif', marginBottom: 16,
        }}>by {course.instructor}</p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 16,
          paddingTop: 14,
          borderTop: '1px solid rgba(100,255,218,0.06)',
        }}>
          <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
            ⏱ {course.duration}
          </span>
          <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
            📖 {course.lessons} lessons
          </span>
          <span style={{ color: '#ffd700', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginLeft: 'auto' }}>
            ⭐ {course.rating}
          </span>
        </div>

        {/* Enroll button */}
        <button style={{
          width: '100%', marginTop: 16,
          padding: '11px', borderRadius: 10,
          background: `${course.color}15`,
          border: `1px solid ${course.color}40`,
          color: course.color,
          fontSize: 13, fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          Start Course →
        </button>
      </div>
    </div>
  )
}

// ── Access Gate ───────────────────────────────────────────────
function AccessGate() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      background: 'rgba(10,25,47,0.85)',
      backdropFilter: 'blur(4px)',
      borderRadius: 20,
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
        <p style={{
          color: '#e6f1ff', fontSize: 13, fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif', marginBottom: 4,
        }}>Momentum Only</p>
        <Link href="/membership" style={{
          color: '#64ffda', fontSize: 12,
          fontFamily: '"DM Sans", sans-serif',
          textDecoration: 'none',
        }}>Upgrade →</Link>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState('All Courses')
  // Simulate: set to true to preview as Momentum member
  const [isMomentum, setIsMomentum] = useState(false)

  const filtered = activeCategory === 'All Courses'
    ? courses
    : courses.filter(c => c.category === activeCategory)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* ── ACCESS BANNER ──────────────────────────────────── */}
      {!isMomentum && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(100,255,218,0.1), rgba(0,180,216,0.1))',
          borderBottom: '1px solid rgba(100,255,218,0.2)',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <p style={{
            color: '#e6f1ff', fontSize: 14,
            fontFamily: '"DM Sans", sans-serif',
          }}>
            🔒 <strong>Learning Hub</strong> is exclusive to <strong style={{ color: '#00b4d8' }}>Momentum</strong> members.
          </p>
          <Link href="/membership" style={{
            padding: '7px 18px', borderRadius: 8,
            background: '#64ffda', color: '#0a192f',
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
            fontFamily: '"DM Sans", sans-serif',
          }}>Upgrade to Momentum →</Link>

          {/* Demo toggle */}
          <button
            onClick={() => setIsMomentum(true)}
            style={{
              padding: '7px 18px', borderRadius: 8,
              background: 'transparent',
              border: '1px solid rgba(100,255,218,0.3)',
              color: '#64ffda', fontWeight: 600, fontSize: 13,
              fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >👁 Preview as Momentum Member</button>
        </div>
      )}

      {isMomentum && (
        <div style={{
          background: 'rgba(100,255,218,0.08)',
          borderBottom: '1px solid rgba(100,255,218,0.15)',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <p style={{
            color: '#64ffda', fontSize: 13,
            fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
          }}>
            Momentum Member — Full access to all 13+ courses unlocked
          </p>
          <button
            onClick={() => setIsMomentum(false)}
            style={{
              background: 'none', border: 'none',
              color: '#8892b0', fontSize: 12,
              fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >(exit preview)</button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '70px 24px 50px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 100,
          background: 'rgba(0,180,216,0.1)',
          border: '1px solid rgba(0,180,216,0.25)',
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 14 }}>💎</span>
          <span style={{
            color: '#00b4d8', fontSize: 12,
            fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
            letterSpacing: '0.05em',
          }}>Exclusive to Momentum Members</span>
        </div>

        <h1 style={{
          fontFamily: '"Syne", sans-serif',
          fontSize: 'clamp(32px, 6vw, 62px)',
          fontWeight: 800, color: '#e6f1ff',
          lineHeight: 1.1, marginBottom: 20,
        }}>
          KOINOVATE{' '}
          <span style={{
            background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Learning Hub</span>
        </h1>
        <p style={{
          color: '#8892b0', fontSize: 17,
          maxWidth: 560, margin: '0 auto 40px',
          fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7,
        }}>
          13+ premium courses taught by Nigeria's top financial experts. Learn trading, AI investing, wealth building, and more.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 40, flexWrap: 'wrap',
        }}>
          {[
            { value: '13+', label: 'Premium Courses' },
            { value: '170K+', label: 'Students Enrolled' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '4', label: 'Expert Instructors' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: '"Orbitron", monospace',
                color: '#64ffda', fontSize: 24, fontWeight: 700,
                textShadow: '0 0 20px rgba(100,255,218,0.3)',
              }}>{s.value}</p>
              <p style={{
                color: '#8892b0', fontSize: 12,
                fontFamily: '"DM Sans", sans-serif',
              }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ─────────────────────────────────── */}
      <section style={{ padding: '20px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: '"Syne", sans-serif',
          color: '#e6f1ff', fontSize: 22,
          fontWeight: 700, marginBottom: 24,
        }}>⭐ Featured Courses</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 60 }}>
          {courses.filter(c => c.featured).map(course => (
            <div key={course.id} style={{ position: 'relative' }}>
              <div style={{
                background: `linear-gradient(135deg, rgba(17,34,64,0.9), rgba(10,25,47,0.95))`,
                border: `1px solid ${course.color}30`,
                borderRadius: 24, overflow: 'hidden',
                display: 'flex', gap: 0,
                boxShadow: `0 0 40px ${course.color}10`,
                filter: !isMomentum ? 'brightness(0.4)' : 'none',
              }}>
                {/* Left accent */}
                <div style={{ width: 6, background: `linear-gradient(180deg, ${course.color}, transparent)`, flexShrink: 0 }} />
                <div style={{ padding: '28px 24px', flex: 1 }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{course.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6,
                      background: `${course.color}15`,
                      color: course.color, fontSize: 11,
                      fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
                    }}>{course.category}</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6,
                      background: 'rgba(255,215,0,0.1)',
                      color: '#ffd700', fontSize: 11,
                      fontFamily: '"DM Sans", sans-serif',
                    }}>⭐ {course.rating}</span>
                  </div>
                  <h3 style={{
                    fontFamily: '"Syne", sans-serif',
                    color: '#e6f1ff', fontSize: 20,
                    fontWeight: 800, marginBottom: 10, lineHeight: 1.2,
                  }}>{course.title}</h3>
                  <p style={{
                    color: '#8892b0', fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                    lineHeight: 1.7, marginBottom: 16,
                  }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {course.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(100,255,218,0.06)',
                        border: '1px solid rgba(100,255,218,0.1)',
                        color: '#a8b2d8', fontSize: 11,
                        fontFamily: '"DM Sans", sans-serif',
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>⏱ {course.duration}</span>
                      <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>📖 {course.lessons} lessons</span>
                      <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>👥 {course.students.toLocaleString()}</span>
                    </div>
                    <button style={{
                      padding: '10px 22px', borderRadius: 10,
                      background: course.color, color: '#0a192f',
                      fontWeight: 700, fontSize: 13,
                      fontFamily: '"DM Sans", sans-serif',
                      border: 'none', cursor: 'pointer',
                    }}>Start Now →</button>
                  </div>
                </div>
              </div>
              {!isMomentum && <AccessGate />}
            </div>
          ))}
        </div>

        {/* ── CATEGORY FILTER ────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 10,
          flexWrap: 'wrap', marginBottom: 32,
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '9px 18px', borderRadius: 100,
                border: activeCategory === cat
                  ? '1px solid rgba(100,255,218,0.4)'
                  : '1px solid rgba(100,255,218,0.12)',
                background: activeCategory === cat
                  ? 'rgba(100,255,218,0.12)'
                  : 'transparent',
                color: activeCategory === cat ? '#64ffda' : '#8892b0',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* ── COURSE GRID ────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {filtered.map(course => (
            <div key={course.id} style={{ position: 'relative' }}>
              <CourseCard course={course} locked={!isMomentum} />
              {!isMomentum && <AccessGate />}
            </div>
          ))}
        </div>
      </section>

      {/* ── INSTRUCTORS ──────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(17,34,64,0.3)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: '"Syne", sans-serif',
              color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800, marginBottom: 12,
            }}>Meet Your Instructors</h2>
            <p style={{
              color: '#8892b0', fontSize: 15,
              fontFamily: '"DM Sans", sans-serif',
            }}>Nigeria's top financial experts — all in one platform</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {instructors.map(inst => (
              <div key={inst.name} style={{
                padding: '32px 24px', textAlign: 'center',
                background: 'rgba(17,34,64,0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(100,255,218,0.08)',
                borderRadius: 20,
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${inst.color}30`
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(100,255,218,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${inst.color}30, ${inst.color}10)`,
                  border: `2px solid ${inst.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, margin: '0 auto 16px',
                }}>{inst.avatar}</div>
                <h3 style={{
                  fontFamily: '"Syne", sans-serif',
                  color: '#e6f1ff', fontSize: 15,
                  fontWeight: 700, marginBottom: 6,
                }}>{inst.name}</h3>
                <p style={{
                  color: inst.color, fontSize: 12,
                  fontFamily: '"DM Sans", sans-serif',
                  marginBottom: 16,
                }}>{inst.role}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#e6f1ff', fontSize: 16, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>{inst.courses}</p>
                    <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Courses</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#e6f1ff', fontSize: 16, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>{inst.students}</p>
                    <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Students</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPGRADE CTA ──────────────────────────────────────── */}
      {!isMomentum && (
        <section style={{
          padding: '100px 24px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,180,216,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 52, marginBottom: 24 }}>🔒</div>
          <h2 style={{
            fontFamily: '"Syne", sans-serif',
            color: '#e6f1ff', fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, marginBottom: 16, position: 'relative',
          }}>
            Unlock All{' '}
            <span style={{
              background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>13+ Courses</span>
          </h2>
          <p style={{
            color: '#8892b0', fontSize: 16, marginBottom: 14,
            fontFamily: '"DM Sans", sans-serif',
            maxWidth: 500, margin: '0 auto 40px',
            lineHeight: 1.7, position: 'relative',
          }}>
            Upgrade to <strong style={{ color: '#00b4d8' }}>Momentum (₦25,000/mo)</strong> and get instant access to the full Learning Hub — plus 5GB data, AI trading, and up to ₦1M casino potential.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/membership" style={{
              padding: '16px 40px', borderRadius: 12,
              background: '#64ffda', color: '#0a192f',
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 0 40px rgba(100,255,218,0.3)',
            }}>
              Upgrade to Momentum →
            </Link>
            <Link href="/membership" style={{
              padding: '16px 40px', borderRadius: 12,
              background: 'transparent', color: '#e6f1ff',
              border: '1px solid rgba(100,255,218,0.2)',
              fontWeight: 600, fontSize: 16, textDecoration: 'none',
              fontFamily: '"DM Sans", sans-serif',
            }}>
              Compare All Plans
            </Link>
          </div>
        </section>
      )}

    </div>
  )
}