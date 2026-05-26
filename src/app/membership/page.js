'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    id: 'spark',
    name: 'SPARK',
    price: '₦8,000',
    period: '/yr',
    color: '#a8b2d8',
    glow: 'rgba(168,178,216,0.15)',
    highlight: false,
    badge: null,
    tagline: 'Start your wealth journey',
    features: {
      'Work With KOINOVATE':  { value: 'Not Available',     available: false },
      'Starter Reward':       { value: '₦5,000',            available: true  },
      'Starter Freebie':      { value: '2GB Data',          available: true  },
      'Referral Bonus':       { value: '₦5,100',            available: true  },
      'Survey Earnings':      { value: 'Up to $5/survey',   available: true  },
      'AI Investment Trade':  { value: 'Not Available',     available: false },
      'Daily AI Profit':      { value: 'N/A',               available: false },
      'Max Earning/Task':     { value: 'Up to ₦2,000',      available: true  },
      'Daily Tasks':          { value: '5 Tasks',           available: true  },
      'KOINOVATE Stocks':     { value: 'Limited Access',            available: true  },
      'Casino Potential':     { value: 'Up to ₦100k',       available: true  },
      'Withdrawal':           { value: 'Monthly',           available: true  },
    },
  },
  {
    id: 'pulse',
    name: 'PULSE',
    price: '₦15,000',
    period: '/yr',
    color: '#64ffda',
    glow: 'rgba(100,255,218,0.15)',
    highlight: true,
    badge: 'MOST POPULAR',
    tagline: 'Accelerate your earnings',
    features: {
      'Work With KOINOVATE':  { value: 'Not Available',      available: false },
      'Starter Reward':       { value: '₦11,000',            available: true  },
      'Starter Freebie':      { value: '5GB Data',           available: true  },
      'Referral Bonus':       { value: '₦8,000',             available: true  },
      'Survey Earnings':      { value: 'Up to $10/survey',   available: true  },
      'AI Investment Trade':  { value: 'Available',          available: true  },
      'Daily AI Profit':      { value: 'Up to $100/day',     available: true  },
      'Max Earning/Task':     { value: 'Up to ₦8,000',       available: true  },
      'Daily Tasks':          { value: '12 Tasks',           available: true  },
      'KOINOVATE Stocks':     { value: 'Access',             available: true  },
      'Casino Potential':     { value: 'Up to ₦500k',        available: true  },
      'Withdrawal':           { value: 'Bi-Weekly',          available: true  },
    },
  },
  {
    id: 'momentum',
    name: 'MOMENTUM',
    price: '₦25,000',
    period: '/yr',
    color: '#00b4d8',
    glow: 'rgba(0,180,216,0.15)',
    highlight: false,
    badge: 'MAXIMUM POWER',
    tagline: 'Unlock your full potential',
    features: {
      'Work With KOINOVATE':  { value: 'Up to ₦500k/mo',         available: true  },
      'Starter Reward':       { value: '₦20,000',                 available: true  },
      'Starter Freebie':      { value: '13+ Premium Courses + 5GB', available: true },
      'Referral Bonus':       { value: '₦15,000',                 available: true  },
      'Survey Earnings':      { value: 'Up to $50/survey',        available: true  },
      'AI Investment Trade':  { value: 'Available',               available: true  },
      'Daily AI Profit':      { value: 'Up to $100/day',          available: true  },
      'Max Earning/Task':     { value: 'Up to ₦16,000',           available: true  },
      'Daily Tasks':          { value: 'Unlimited',               available: true  },
      'KOINOVATE Stocks':     { value: 'Access + Priority Dividends', available: true },
      'Casino Potential':     { value: 'Up to ₦1M',               available: true  },
      'Withdrawal':           { value: 'Weekly',                  available: true  },
    },
  },
]

const featureRows = [
  'Work With KOINOVATE',
  'Starter Reward',
  'Starter Freebie',
  'Referral Bonus',
  'Survey Earnings',
  'AI Investment Trade',
  'Daily AI Profit',
  'Max Earning/Task',
  'Daily Tasks',
  'KOINOVATE Stocks',
  'Casino Potential',
  'Withdrawal',
]

const faqs = [
  {
    q: 'Can I upgrade my plan at any time?',
    a: 'Yes! You can upgrade from Spark → Pulse → Momentum at any time. Your new benefits activate immediately and your billing is adjusted pro-rata.',
  },
  {
    q: 'When do I receive my Starter Reward?',
    a: 'Your starter reward is credited to your KOINOVATE wallet within 24 hours of your membership payment being confirmed.',
  },
  {
    q: 'How does the AI Investment Trade work?',
    a: 'Our AI system analyses market signals 24/7 and executes trades on your behalf. Pulse and Momentum members can earn up to $100/day through AI-managed positions.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers, Paystack, Flutterwave, and major debit cards. All transactions are secured and encrypted.',
  },
  {
    q: 'How do withdrawals work?',
    a: 'Withdrawal frequency depends on your tier — Monthly for Spark, Bi-Weekly for Pulse, and Weekly for Momentum. Funds are sent directly to your registered bank account.',
  },
]

// ── FAQ Item ──────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid rgba(100,255,218,0.1)',
      borderRadius: 14, overflow: 'hidden',
      marginBottom: 12,
      transition: 'all 0.3s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '18px 24px',
          background: open ? 'rgba(100,255,218,0.05)' : 'rgba(17,34,64,0.5)',
          border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{
          color: '#e6f1ff', fontSize: 15, fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif', textAlign: 'left',
        }}>{q}</span>
        <span style={{
          color: '#64ffda', fontSize: 20, flexShrink: 0,
          transition: 'transform 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: '16px 24px 20px',
          background: 'rgba(17,34,64,0.3)',
        }}>
          <p style={{
            color: '#8892b0', fontSize: 14, lineHeight: 1.75,
            fontFamily: '"DM Sans", sans-serif',
          }}>{a}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function MembershipPage() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 100,
          background: 'rgba(100,255,218,0.08)',
          border: '1px solid rgba(100,255,218,0.2)',
          marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64ffda', display: 'inline-block' }} />
          <span style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em' }}>
            Choose your plan — upgrade anytime
          </span>
        </div>

        <h1 style={{
          fontFamily: '"Syne", sans-serif',
          fontSize: 'clamp(32px, 6vw, 64px)',
          fontWeight: 800, color: '#e6f1ff',
          lineHeight: 1.1, marginBottom: 20,
        }}>
          KOINOVATE{' '}
          <span style={{
            background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Membership Plans</span>
        </h1>
        <p style={{
          color: '#8892b0', fontSize: 18, maxWidth: 560,
          margin: '0 auto 16px',
          fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7,
        }}>
          Pick the plan that matches your ambition. Every tier comes loaded with real earning power from day one.
        </p>
      </section>

      {/* ── PLAN CARDS ───────────────────────────────────────── */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24, alignItems: 'stretch',
        }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '36px 28px',
                background: plan.highlight
                  ? 'rgba(100,255,218,0.05)'
                  : 'rgba(17,34,64,0.6)',
                backdropFilter: 'blur(14px)',
                border: `1px solid ${plan.highlight
                  ? 'rgba(100,255,218,0.3)'
                  : hovered === plan.id
                    ? 'rgba(100,255,218,0.15)'
                    : 'rgba(100,255,218,0.08)'}`,
                borderRadius: 24,
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: plan.highlight ? 'scale(1.02)' : hovered === plan.id ? 'translateY(-6px)' : 'none',
                boxShadow: plan.highlight ? `0 0 50px ${plan.glow}` : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.highlight ? '#64ffda' : plan.color,
                  color: '#0a192f',
                  padding: '4px 18px', borderRadius: 20,
                  fontSize: 10, fontWeight: 800,
                  fontFamily: '"Orbitron", monospace',
                  letterSpacing: '0.1em', whiteSpace: 'nowrap',
                }}>{plan.badge}</div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  fontFamily: '"Orbitron", monospace',
                  color: plan.color, fontSize: 12,
                  letterSpacing: '0.2em', marginBottom: 10,
                }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{
                    fontFamily: '"Syne", sans-serif',
                    color: '#e6f1ff', fontSize: 42, fontWeight: 800,
                  }}>{plan.price}</span>
                  <span style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>{plan.period}</span>
                </div>
                <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{plan.tagline}</p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${plan.color}30, transparent)`, marginBottom: 24 }} />

              {/* Features list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, marginBottom: 32 }}>
                {featureRows.map(feature => {
                  const f = plan.features[feature]
                  return (
                    <div key={feature} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{
                        color: '#8892b0', fontSize: 13,
                        fontFamily: '"DM Sans", sans-serif', flexShrink: 0,
                      }}>{feature}</span>
                      <span style={{
                        color: f.available ? '#e6f1ff' : '#4a5568',
                        fontSize: 13, fontFamily: '"DM Sans", sans-serif',
                        fontWeight: f.available ? 500 : 400,
                        textAlign: 'right',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {!f.available && <span style={{ color: '#ff6b6b', fontSize: 12 }}>✗</span>}
                        {f.available && feature === 'Work With KOINOVATE' && <span style={{ color: '#64ffda', fontSize: 12 }}>✓</span>}
                        {f.available && feature === 'AI Investment Trade' && <span style={{ color: '#64ffda', fontSize: 12 }}>✓</span>}
                        {f.value}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <Link href="/auth" style={{
                display: 'block', textAlign: 'center',
                padding: '14px 24px', borderRadius: 12,
                background: plan.highlight
                  ? '#64ffda'
                  : 'transparent',
                color: plan.highlight ? '#0a192f' : plan.color,
                border: plan.highlight ? 'none' : `1px solid ${plan.color}50`,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.3s',
                letterSpacing: '0.02em',
              }}>
                {plan.highlight ? '🚀 Get Started Now' : `Choose ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(17,34,64,0.3)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: '"Syne", sans-serif',
              color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 800, marginBottom: 12,
            }}>Full Feature Comparison</h2>
            <p style={{ color: '#8892b0', fontSize: 15, fontFamily: '"DM Sans", sans-serif' }}>
              See exactly what you get with each plan
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '16px 20px', textAlign: 'left',
                    color: '#8892b0', fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                    borderBottom: '1px solid rgba(100,255,218,0.1)',
                    fontWeight: 600, letterSpacing: '0.05em',
                  }}>FEATURE</th>
                  {plans.map(plan => (
                    <th key={plan.id} style={{
                      padding: '16px 20px', textAlign: 'center',
                      fontFamily: '"Orbitron", monospace',
                      color: plan.color, fontSize: 12,
                      borderBottom: '1px solid rgba(100,255,218,0.1)',
                      letterSpacing: '0.15em',
                    }}>
                      {plan.name}
                      <div style={{ color: '#e6f1ff', fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, marginTop: 4, letterSpacing: 0 }}>
                        {plan.price}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((feature, idx) => (
                  <tr key={feature} style={{
                    background: idx % 2 === 0 ? 'rgba(17,34,64,0.3)' : 'transparent',
                  }}>
                    <td style={{
                      padding: '14px 20px',
                      color: '#a8b2d8', fontSize: 13,
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      borderBottom: '1px solid rgba(100,255,218,0.05)',
                    }}>{feature}</td>
                    {plans.map(plan => {
                      const f = plan.features[feature]
                      return (
                        <td key={plan.id} style={{
                          padding: '14px 20px', textAlign: 'center',
                          borderBottom: '1px solid rgba(100,255,218,0.05)',
                        }}>
                          {f.available ? (
                            <span style={{
                              color: '#e6f1ff', fontSize: 13,
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 500,
                            }}>{f.value}</span>
                          ) : (
                            <span style={{ color: '#ff6b6b', fontSize: 18 }}>✗</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: '"Syne", sans-serif',
            color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 800, marginBottom: 12,
          }}>How It Works</h2>
          <p style={{ color: '#8892b0', fontSize: 15, fontFamily: '"DM Sans", sans-serif' }}>
            Get started in 3 simple steps
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { step: '01', icon: '🚀', title: 'Choose Your Plan', desc: 'Select Spark, Pulse, or Momentum based on your goals and budget.' },
            { step: '02', icon: '✅', title: 'Verify & Activate', desc: 'Complete verification. Your starter reward and benefits activate instantly.' },
            { step: '03', icon: '💰', title: 'Start Earning', desc: 'Complete daily tasks, use AI trading, refer friends, and withdraw your earnings.' },
          ].map(item => (
            <div key={item.step} style={{
              padding: '32px 24px',
              background: 'rgba(17,34,64,0.5)',
              border: '1px solid rgba(100,255,218,0.08)',
              borderRadius: 20, textAlign: 'center',
            }}>
              <div style={{
                fontFamily: '"Orbitron", monospace',
                color: 'rgba(100,255,218,0.2)',
                fontSize: 40, fontWeight: 800, marginBottom: 12,
              }}>{item.step}</div>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{
                fontFamily: '"Syne", sans-serif',
                color: '#e6f1ff', fontSize: 17,
                fontWeight: 700, marginBottom: 12,
              }}>{item.title}</h3>
              <p style={{ color: '#8892b0', fontSize: 13, lineHeight: 1.75, fontFamily: '"DM Sans", sans-serif' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(17,34,64,0.2)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: '"Syne", sans-serif',
              color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 800, marginBottom: 12,
            }}>Frequently Asked Questions</h2>
          </div>
          {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(100,255,218,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{
          fontFamily: '"Syne", sans-serif',
          color: '#e6f1ff', fontSize: 'clamp(28px, 5vw, 50px)',
          fontWeight: 800, marginBottom: 16, position: 'relative',
        }}>
          Ready to{' '}
          <span style={{
            background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Start Earning?</span>
        </h2>
        <p style={{
          color: '#8892b0', fontSize: 16, marginBottom: 40,
          fontFamily: '"DM Sans", sans-serif', position: 'relative',
        }}>
          Join thousands of KOINOVATE members already building wealth today.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <Link href="/auth" style={{
            padding: '16px 40px', borderRadius: 12,
            background: '#64ffda', color: '#0a192f',
            fontWeight: 700, fontSize: 16, textDecoration: 'none',
            fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 0 40px rgba(100,255,218,0.3)',
          }}>
            Create Free Account →
          </Link>
          <Link href="/support" style={{
            padding: '16px 40px', borderRadius: 12,
            background: 'transparent', color: '#e6f1ff',
            border: '1px solid rgba(100,255,218,0.2)',
            fontWeight: 600, fontSize: 16, textDecoration: 'none',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            Talk to an Expert
          </Link>
        </div>
      </section>

    </div>
  )
}