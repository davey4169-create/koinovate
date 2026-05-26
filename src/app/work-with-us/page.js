'use client'
import { useState } from 'react'
import Link from 'next/link'

const USER_TIER = 'pulse' // Change to 'momentum' to preview unlocked

const partnerTiers = [
  {
    id: 'agent', name: 'Agent', icon: '🤝', color: '#a8b2d8',
    earnings: 'Up to ₦150,000/mo',
    requirements: ['Minimum 50 active referrals', 'MOMENTUM membership'],
    perks: ['₦10,000/referral commission', 'Weekly payouts', 'Dedicated support line', 'Agent dashboard access'],
  },
  {
    id: 'senior', name: 'Senior Agent', icon: '⭐', color: '#64ffda',
    earnings: 'Up to ₦300,000/mo',
    requirements: ['Minimum 150 active referrals', 'MOMENTUM membership', 'Minimum 3 months active'],
    perks: ['₦15,000/referral commission', 'Bi-weekly bonuses', 'VIP support access', 'Co-branded marketing materials', 'Performance bonuses'],
  },
  {
    id: 'leader', name: 'Team Leader', icon: '👑', color: '#f59e0b',
    earnings: 'Up to ₦500,000/mo',
    requirements: ['Minimum 300 active referrals', 'MOMENTUM membership', 'Senior Agent for 2+ months'],
    perks: ['₦20,000/referral + team override', 'Weekly payouts', 'Personal account manager', 'Branded KOINOVATE kit', 'Revenue share on team earnings', 'Exclusive VIP events'],
  },
]

const steps = [
  { n: '01', icon: '💎', title: 'Upgrade to Momentum', desc: 'Work With KOINOVATE is exclusively available to Momentum members. Upgrade your plan to unlock this feature.' },
  { n: '02', icon: '📝', title: 'Submit Application', desc: 'Fill out the partnership application form. Our team reviews it within 48 hours and contacts you directly.' },
  { n: '03', icon: '🚀', title: 'Get Your Partner Kit', desc: 'Receive your referral link, marketing materials, and access to the partner dashboard. Start earning immediately.' },
]

export default function WorkWithUsPage() {
  const isMomentum = USER_TIER === 'momentum'
  const [form, setForm] = useState({ name: '', email: '', phone: '', tier: 'agent', experience: '', motivation: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitted(true); setLoading(false)
  }

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* Access Banner */}
      {!isMomentum && (
        <div style={{ background: 'linear-gradient(90deg, rgba(0,180,216,0.1), rgba(100,255,218,0.08))', borderBottom: '1px solid rgba(100,255,218,0.15)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>
            👑 <strong>Work With KOINOVATE</strong> is exclusively for <strong style={{ color: '#00b4d8' }}>Momentum</strong> members.
          </p>
          <Link href="/membership" style={{ padding: '7px 18px', borderRadius: 8, background: '#64ffda', color: '#0a192f', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>Upgrade to Momentum →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '70px 24px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)', backgroundSize: '55px 55px', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 24, position: 'relative' }}>
          <span style={{ fontSize: 14 }}>👑</span>
          <span style={{ color: '#f59e0b', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Momentum Members Only · Earn Up to ₦500k/mo</span>
        </div>

        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(32px, 6vw, 62px)', fontWeight: 900, marginBottom: 16, position: 'relative' }}>
          Work With{' '}
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>KOINOVATE</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 17, maxWidth: 560, margin: '0 auto 20px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, position: 'relative' }}>
          Become a KOINOVATE Partner, Agent, or Team Leader. Earn real commissions by growing our community — up to <strong style={{ color: '#f59e0b' }}>₦500,000 per month.</strong>
        </p>

        {!isMomentum && (
          <div style={{ display: 'inline-block', padding: '16px 28px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, position: 'relative', marginTop: 8 }}>
            <p style={{ color: '#f59e0b', fontSize: 14, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>🔒 Upgrade to Momentum to unlock this feature and start earning</p>
          </div>
        )}
      </section>

      {/* Partner Tiers */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 12 }}>Partnership Tiers</h2>
          <p style={{ color: '#8892b0', fontSize: 15, fontFamily: '"DM Sans", sans-serif' }}>Grow with us and unlock more earning power</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
          {partnerTiers.map(tier => (
            <div key={tier.id} style={{
              padding: '32px 26px',
              background: isMomentum ? 'rgba(17,34,64,0.7)' : 'rgba(17,34,64,0.4)',
              border: `1px solid ${tier.color}20`,
              borderRadius: 22,
              filter: !isMomentum ? 'grayscale(40%)' : 'none',
              opacity: !isMomentum ? 0.7 : 1,
              transition: 'all 0.3s',
              position: 'relative',
            }}
            onMouseEnter={e => isMomentum && (e.currentTarget.style.border = `1px solid ${tier.color}40`)}
            onMouseLeave={e => isMomentum && (e.currentTarget.style.border = `1px solid ${tier.color}20`)}
            >
              {!isMomentum && (
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 18 }}>🔒</div>
              )}
              <div style={{ fontSize: 36, marginBottom: 14 }}>{tier.icon}</div>
              <p style={{ fontFamily: '"Orbitron", monospace', color: tier.color, fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>{tier.name.toUpperCase()}</p>
              <p style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{tier.earnings}</p>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans", sans-serif', marginBottom: 10 }}>Requirements</p>
                {tier.requirements.map(r => (
                  <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ color: '#f59e0b', fontSize: 12, flexShrink: 0 }}>→</span>
                    <span style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{r}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: `linear-gradient(90deg, ${tier.color}30, transparent)`, marginBottom: 20 }} />

              <div>
                <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans", sans-serif', marginBottom: 10 }}>Benefits</p>
                {tier.perks.map(p => (
                  <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: tier.color, fontSize: 12 }}>✓</span>
                    <span style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 24px', background: 'rgba(17,34,64,0.3)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800 }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {steps.map(s => (
              <div key={s.n} style={{ padding: '28px 22px', background: 'rgba(17,34,64,0.6)', border: '1px solid rgba(100,255,218,0.08)', borderRadius: 20, textAlign: 'center' }}>
                <p style={{ fontFamily: '"Orbitron", monospace', color: 'rgba(245,158,11,0.3)', fontSize: 36, fontWeight: 800, marginBottom: 10 }}>{s.n}</p>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ padding: '40px 36px', background: 'rgba(17,34,64,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${isMomentum ? 'rgba(245,158,11,0.2)' : 'rgba(100,255,218,0.08)'}`, borderRadius: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Partnership Application</h2>
          <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 28 }}>
            {isMomentum ? 'Fill out the form below. Our team reviews applications within 48 hours.' : '🔒 Upgrade to Momentum to submit an application.'}
          </p>

          {!isMomentum ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>👑</div>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#f59e0b', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Momentum Required</h3>
              <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 28, lineHeight: 1.7 }}>This feature is exclusively for Momentum members. Upgrade your plan to unlock the partnership program and start earning up to ₦500k/mo.</p>
              <Link href="/membership" style={{ padding: '14px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a192f', fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>Upgrade to Momentum →</Link>
            </div>
          ) : submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#f59e0b', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Application Submitted!</h3>
              <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7 }}>Our partnership team will review your application and contact you within 48 hours via the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+234 800 000 0000' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 18 }}>
                  <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(245,158,11,0.4)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>Partnership Tier</label>
                <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="agent">Agent — Up to ₦150,000/mo</option>
                  <option value="senior">Senior Agent — Up to ₦300,000/mo</option>
                  <option value="leader">Team Leader — Up to ₦500,000/mo</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>Relevant Experience</label>
                <textarea rows={3} placeholder="Tell us about your sales/marketing experience..." value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                onFocus={e => e.target.style.border = '1px solid rgba(245,158,11,0.4)'}
                onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>Why do you want to partner with KOINOVATE?</label>
                <textarea rows={4} placeholder="Share your motivation and goals..." value={form.motivation} onChange={e => setForm(p => ({ ...p, motivation: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                onFocus={e => e.target.style.border = '1px solid rgba(245,158,11,0.4)'}
                onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(245,158,11,0.4)' : 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a192f', fontWeight: 800, fontSize: 15, fontFamily: '"DM Sans", sans-serif', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 25px rgba(245,158,11,0.25)' }}>
                {loading ? '⏳ Submitting...' : '👑 Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}