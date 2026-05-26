'use client'
import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { icon: '💳', title: 'Payments & Withdrawals', desc: 'Wallet top-up, withdrawal issues, bank transfers', color: '#64ffda' },
  { icon: '🔐', title: 'Account & Security',     desc: 'Login issues, password reset, account access',    color: '#00b4d8' },
  { icon: '🤖', title: 'AI Trading',             desc: 'Signal errors, trade positions, AI profits',       color: '#a855f7' },
  { icon: '💎', title: 'Membership & Upgrades',  desc: 'Plan changes, billing, tier benefits',             color: '#f59e0b' },
  { icon: '🎰', title: 'Casino & Games',          desc: 'Game issues, winnings, casino balance',            color: '#fb923c' },
  { icon: '📚', title: 'Learning Hub',           desc: 'Course access, progress, certifications',           color: '#f472b6' },
]

const faqs = [
  { q: 'How long do withdrawals take?',               a: 'SPARK: up to 30 days | PULSE: up to 14 days | MOMENTUM: up to 7 days. All withdrawals are processed to your registered bank account.' },
  { q: 'I cannot access my account. What do I do?',   a: 'Use the "Forgot Password" link on the login page. If you still can\'t access it, contact us via the form below with your registered email.' },
  { q: 'How do I upgrade my membership tier?',        a: 'Go to the Membership page, choose your new plan, and complete payment. Your new benefits activate immediately.' },
  { q: 'Why haven\'t I received my starter reward?',  a: 'Starter rewards are credited within 24 hours of payment confirmation. If it\'s been longer, contact support with your payment receipt.' },
  { q: 'How does AI trading work?',                    a: 'Our AI engine analyses global markets 24/7, identifies high-probability opportunities, and executes trades on your behalf. Pulse and Momentum members earn up to $100/day.' },
  { q: 'Can I have multiple accounts?',               a: 'No. KOINOVATE allows one account per person. Multiple accounts result in permanent suspension and forfeiture of all balances.' },
  { q: 'Is my money safe?',                           a: 'Yes. All funds are held in segregated accounts with bank-grade encryption. We use industry-standard security protocols to protect every user.' },
  { q: 'How does the referral bonus work?',           a: 'Share your referral link. When someone signs up and activates a paid membership, your referral bonus is credited automatically to your Revenue Share wallet.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: `1px solid ${open ? 'rgba(100,255,218,0.2)' : 'rgba(100,255,218,0.08)'}`,
      borderRadius: 14, marginBottom: 10, overflow: 'hidden', transition: 'all 0.3s',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '18px 22px', background: open ? 'rgba(100,255,218,0.05)' : 'rgba(17,34,64,0.5)',
        border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}>
        <span style={{ color: '#e6f1ff', fontSize: 14, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', textAlign: 'left' }}>{q}</span>
        <span style={{ color: '#64ffda', fontSize: 20, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0)', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '16px 22px 20px', background: 'rgba(17,34,64,0.3)' }}>
          <p style={{ color: '#8892b0', fontSize: 14, lineHeight: 1.75, fontFamily: '"DM Sans", sans-serif' }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true); setLoading(false)
  }

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <section style={{ padding: '60px 24px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.2)', marginBottom: 24, position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#64ffda', display: 'inline-block', boxShadow: '0 0 8px #64ffda' }} />
          <span style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>24/7 Live Support · Average response: 2 hours</span>
        </div>

        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
          🎧 How Can We{' '}
          <span style={{ background: 'linear-gradient(135deg, #64ffda, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Help You?</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 17, maxWidth: 540, margin: '0 auto 40px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, position: 'relative' }}>
          Our support team is available around the clock. Browse the help categories, check our FAQ, or send us a direct message.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', position: 'relative' }}>
          {[['⚡','Within 2hrs','Response Time'],['✅','99.2%','Resolution Rate'],['🌍','24/7','Availability'],['👥','50+','Support Agents']].map(([icon, val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{icon} {val}</p>
              <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 60px' }}>
        <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Browse by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat.title} style={{
              padding: '24px', background: 'rgba(17,34,64,0.6)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(100,255,218,0.08)', borderRadius: 18, cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${cat.color}30`; e.currentTarget.style.transform = 'translateY(-5px)' }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(100,255,218,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 13, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{cat.icon}</div>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{cat.title}</h3>
              <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6 }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + Contact */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, flexWrap: 'wrap' }}>
        
        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h2>
          {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
        </div>

        {/* Contact Form */}
        <div style={{ padding: '32px', background: 'rgba(17,34,64,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(100,255,218,0.12)', borderRadius: 22, height: 'fit-content', position: 'sticky', top: 100 }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Send a Message</h3>
          <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>We'll get back to you within 2 hours.</p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#64ffda', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>We'll respond to your email within 2 hours.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, border: '1px solid rgba(100,255,218,0.2)', background: 'transparent', color: '#64ffda', cursor: 'pointer', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(100,255,218,0.4)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>Message</label>
                <textarea rows={5} placeholder="Describe your issue in detail..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                onFocus={e => e.target.style.border = '1px solid rgba(100,255,218,0.4)'}
                onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 11, border: 'none', background: loading ? 'rgba(100,255,218,0.4)' : 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 25px rgba(100,255,218,0.2)' }}>
                {loading ? '⏳ Sending...' : '📨 Send Message'}
              </button>
            </form>
          )}

          {/* Live chat button */}
          <div style={{ marginTop: 20, padding: '14px', background: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div>
              <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>Live Chat Available</p>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Mon–Fri · 8AM–10PM WAT</p>
            </div>
            <button style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: 8, background: '#64ffda', border: 'none', color: '#0a192f', fontWeight: 700, fontSize: 12, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Chat</button>
          </div>
        </div>
      </section>
    </div>
  )
}