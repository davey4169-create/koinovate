'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Currency config ────────────────────────────────────────────
const CURRENCIES = [
  { code: 'NGN', symbol: '₦', rate: 1,    flag: '🇳🇬' },
  { code: 'USD', symbol: '$', rate: 1300,  flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 1650,  flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 2000,  flag: '🇬🇧' },
]

// ── Wallet data ────────────────────────────────────────────────
const WALLETS = [
  { id: 'total',   icon: '💰', label: 'Total Wallet',     color: '#64ffda', ngn: 342500, change: '+₦12,500',  pct: '+3.8%', desc: 'Master sum of all earnings'   },
  { id: 'revenue', icon: '🤝', label: 'Revenue Share',     color: '#00b4d8', ngn: 98100,  change: '+₦8,000',   pct: '+8.9%', desc: 'Affiliate & referral earnings' },
  { id: 'ai',      icon: '🤖', label: 'AI Trade Balance',  color: '#a855f7', ngn: 244400, change: '+₦4,500',   pct: '+1.9%', desc: 'AI trading engine returns'     },
]

const TRANSACTIONS = [
  { icon: '💰', name: 'Wallet Top-up',    type: 'Deposit',      amount: 50000,  pos: true,  date: 'Today 10:32 AM'    },
  { icon: '🤖', name: 'AI Signal Profit', type: 'Trading',      amount: 12500,  pos: true,  date: 'Today 09:15 AM'    },
  { icon: '📋', name: 'Daily Tasks',      type: 'Task Reward',  amount: 8000,   pos: true,  date: 'Today 08:00 AM'    },
  { icon: '📊', name: 'Survey Done',      type: 'Survey',       amount: 13000,  pos: true,  date: 'Yesterday 5:20 PM' },
  { icon: '🎰', name: 'Casino Win',       type: 'Casino',       amount: 25000,  pos: true,  date: 'Yesterday 3:10 PM' },
  { icon: '💎', name: 'Pulse Membership', type: 'Subscription', amount: 15000,  pos: false, date: 'May 22'            },
]

const NOTIFICATIONS = [
  { icon: '🤖', msg: 'AI signal: BTC/USDT breakout. Check Trading Hub.', time: '2m ago',   unread: true  },
  { icon: '🎉', msg: 'Account activated. All features now unlocked.',    time: '1hr ago',  unread: true  },
  { icon: '📚', msg: 'New course: "Advanced DeFi" available.',           time: '3hrs ago', unread: true  },
  { icon: '💰', msg: '₦50,000 top-up confirmed.',                        time: 'Today',    unread: false },
  { icon: '🏆', msg: 'You ranked #24 on this week\'s leaderboard!',      time: 'Yesterday',unread: false },
]

// ── Format amount ──────────────────────────────────────────────
function fmt(ngn, currency) {
  const converted = ngn / currency.rate
  return `${currency.symbol}${converted.toLocaleString('en', { maximumFractionDigits: currency.code === 'NGN' ? 0 : 2 })}`
}

// ── Wallet Card with flip animation ───────────────────────────
function WalletCard({ currency }) {
  const [idx,         setIdx]         = useState(0)
  const [flipping,    setFlipping]    = useState(false)
  const [flipClass,   setFlipClass]   = useState('')
  const [currIdx,     setCurrIdx]     = useState(0)
  const [showCurrPicker, setShowCurrPicker] = useState(false)
  const curr = CURRENCIES[currIdx]

  const flip = (direction = 1) => {
    if (flipping) return
    setFlipping(true)
    setFlipClass('card-flip-out')
    setTimeout(() => {
      setIdx(i => (i + direction + 3) % 3)
      setFlipClass('card-flip-in')
      setTimeout(() => { setFlipping(false); setFlipClass('') }, 260)
    }, 260)
  }

  const w = WALLETS[idx]

  return (
    <div style={{ position: 'relative' }}>
      {/* Currency switcher */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowCurrPicker(!showCurrPicker)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.2)',
            color: '#64ffda', fontSize: 12, cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
          }}>
            {CURRENCIES[currIdx].flag} {CURRENCIES[currIdx].code} ▾
          </button>
          {showCurrPicker && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, zIndex: 50,
              background: 'rgba(8,20,40,0.99)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(100,255,218,0.15)', borderRadius: 14,
              padding: '6px', minWidth: 180, boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}>
              <p style={{ color: '#8892b0', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px 8px', fontFamily: '"DM Sans", sans-serif' }}>Display Currency</p>
              {CURRENCIES.map((c, i) => (
                <button key={c.code} onClick={() => { setCurrIdx(i); setShowCurrPicker(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: i === currIdx ? 'rgba(100,255,218,0.1)' : 'transparent',
                  color: i === currIdx ? '#64ffda' : '#a8b2d8',
                  fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: i === currIdx ? 600 : 400, textAlign: 'left',
                }}>
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                  <span style={{ color: '#8892b0', fontSize: 11, marginLeft: 'auto' }}>{c.symbol}</span>
                  {i === currIdx && <span style={{ color: '#64ffda' }}>✓</span>}
                </button>
              ))}
              <div style={{ borderTop: '1px solid rgba(100,255,218,0.08)', margin: '6px 0 2px', padding: '6px 12px 2px' }}>
                <p style={{ color: '#8892b0', fontSize: 9, fontFamily: '"DM Sans", sans-serif' }}>$1=₦1,300 · €1=₦1,650 · £1=₦2,000</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* The flip card */}
      <div className={flipClass} style={{
        padding: '28px 24px',
        background: `linear-gradient(135deg, ${w.color}12, rgba(15,30,58,0.9))`,
        border: `1px solid ${w.color}30`,
        borderRadius: 22, position: 'relative', overflow: 'hidden',
        boxShadow: `0 0 40px ${w.color}10`,
        minHeight: 180,
        willChange: 'transform',
      }}>
        {/* BG orb */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${w.color}10, transparent)`, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{w.icon}</span>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{w.label}</p>
            </div>
            <p style={{
              fontFamily: '"Orbitron", monospace', color: w.color,
              fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 700,
              marginBottom: 6, textShadow: `0 0 30px ${w.color}40`,
              transition: 'all 0.3s',
            }}>
              {fmt(w.ngn, CURRENCIES[currIdx])}
            </p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
              ↑ <span style={{ color: w.color }}>{CURRENCIES[currIdx].code === 'NGN' ? w.change : fmt(parseInt(w.change.replace(/[+₦,]/g,'')), CURRENCIES[currIdx])} ({w.pct})</span> this week
            </p>
            <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>{w.desc}</p>
          </div>

          {/* Flip controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button onClick={() => flip(1)} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `${w.color}15`, border: `2px solid ${w.color}40`,
              color: w.color, fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s', boxShadow: `0 0 15px ${w.color}20`,
            }} title="Swap wallet">⇄</button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 5 }}>
              {WALLETS.map((_, i) => (
                <button key={i} onClick={() => {
                  if (i !== idx) { setFlipping(true); setFlipClass('card-flip-out'); setTimeout(() => { setIdx(i); setFlipClass('card-flip-in'); setTimeout(() => { setFlipping(false); setFlipClass('') }, 260) }, 260) }
                }} style={{
                  width: i === idx ? 18 : 7, height: 7, borderRadius: 4,
                  background: i === idx ? w.color : 'rgba(100,255,218,0.2)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Wallet tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
          {WALLETS.map((wal, i) => (
            <button key={wal.id} onClick={() => {
              if (i !== idx) { setFlipping(true); setFlipClass('card-flip-out'); setTimeout(() => { setIdx(i); setFlipClass('card-flip-in'); setTimeout(() => { setFlipping(false); setFlipClass('') }, 260) }, 260) }
            }} style={{
              flex: 1, padding: '6px 4px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: i === idx ? `${wal.color}20` : 'rgba(100,255,218,0.04)',
              color: i === idx ? wal.color : '#8892b0',
              fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
              border: `1px solid ${i === idx ? wal.color + '30' : 'transparent'}`,
              transition: 'all 0.2s',
            }}>
              {wal.icon} {wal.id === 'total' ? 'Total' : wal.id === 'revenue' ? 'Revenue' : 'AI'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Payout Modal ───────────────────────────────────────────────
function PayoutModal({ onClose }) {
  const [form,    setForm]    = useState({ bank: '', account: '', name: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState(null)

  const submit = async e => {
    e.preventDefault()
    if (!form.bank || !form.account || !form.name || !form.amount) return setError('Please fill all fields.')
    if (form.account.length !== 10) return setError('Account number must be exactly 10 digits.')
    setError(null); setLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setDone(true); setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'rgba(10,22,40,0.99)', border: '1px solid rgba(100,255,218,0.15)',
        borderRadius: 24, padding: '32px 28px', maxWidth: 440, width: '100%',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'slideUp 0.3s ease',
      }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#64ffda', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Withdrawal Submitted!</h3>
            <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7 }}>Your request is being processed. Funds will arrive based on your membership tier's withdrawal schedule.</p>
            <button onClick={onClose} style={{ marginTop: 24, padding: '12px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 800 }}>💳 Withdrawal Request</h2>
                <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>PULSE · Bi-weekly payout · Available: <strong style={{ color: '#64ffda' }}>₦342,500</strong></p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            {error && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8080', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>⚠️ {error}</div>}

            <form onSubmit={submit}>
              {[
                { label: 'Bank Name',       key: 'bank',    placeholder: 'e.g. First Bank, GTBank, Access...',   type: 'text'   },
                { label: 'Account Number', key: 'account', placeholder: '10-digit account number',              type: 'number' },
                { label: 'Account Name',   key: 'name',    placeholder: 'Name exactly as on bank account',      type: 'text'   },
                { label: 'Amount to Withdraw (₦)', key: 'amount', placeholder: 'Minimum ₦5,000',               type: 'number' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 7, fontWeight: 600 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', background: 'rgba(6,15,30,0.9)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(100,255,218,0.45)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(100,255,218,0.1)'}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(100,255,218,0.4)' : 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', fontWeight: 800, fontSize: 15, fontFamily: '"DM Sans", sans-serif', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {loading ? '⏳ Processing...' : '↑ Submit Withdrawal'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const [showPayout, setShowPayout] = useState(false)
  const [activeNav,  setActiveNav]  = useState('overview')
  const [toast,      setToast]      = useState(null)
  const [isMobile,   setIsMobile]   = useState(false)
  const [sidebarOpen,setSidebarOpen]= useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const sideLinks = [
    { id: 'overview', icon: '📊', label: 'Overview'  },
    { id: 'wallet',   icon: '👛', label: 'Wallet'    },
    { id: '', icon: '🤖', label: 'AI Trading',  href: '/trading'     },
    { id: '', icon: '📋', label: 'Daily Tasks',  href: '/tasks'       },
    { id: '', icon: '📊', label: 'Surveys',      href: '/surveys'     },
    { id: '', icon: '🎰', label: 'Casino',       href: '/casino'      },
    { id: '', icon: '📚', label: 'Learning',     href: '/learning'    },
    { id: '', icon: '📈', label: 'Stocks',       href: '/stocks'      },
    { id: '', icon: '💎', label: 'Membership',   href: '/membership'  },
    { id: '', icon: '🎧', label: 'Support',      href: '/support'     },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a192f', paddingTop: isMobile ? 0 : 70, display: 'flex' }}>

      {/* Toast */}
      {toast && <div className="toast">✅ {toast}</div>}

      {/* Payout modal */}
      {showPayout && <PayoutModal onClose={() => setShowPayout(false)} />}

      {/* Mobile overlay sidebar */}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{
        width: isMobile ? 260 : 220,
        background: 'rgba(8,18,38,0.97)', backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(100,255,218,0.07)',
        padding: '24px 12px',
        position: isMobile ? 'fixed' : 'sticky',
        top: isMobile ? 0 : 70,
        left: isMobile ? (sidebarOpen ? 0 : -280) : 0,
        height: isMobile ? '100vh' : 'calc(100vh - 70px)',
        zIndex: isMobile ? 850 : 1,
        overflowY: 'auto',
        flexShrink: 0,
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex !important',
      }}>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 12px', marginBottom: 24, background: 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #64ffda, #00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#0a192f', fontFamily: '"Syne", sans-serif', flexShrink: 0 }}>D</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>David</p>
            <p style={{ color: '#64ffda', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>● PULSE Member</p>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#8892b0', fontSize: 18, cursor: 'pointer' }}>✕</button>}
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sideLinks.map((l, i) => (
            l.href ? (
              <Link key={i} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, color: '#8892b0', textDecoration: 'none', fontSize: 13, fontFamily: '"DM Sans", sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.05)'; e.currentTarget.style.color = '#64ffda' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892b0' }}
              ><span>{l.icon}</span>{l.label}</Link>
            ) : (
              <button key={i} onClick={() => setActiveNav(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', background: activeNav === l.id ? 'rgba(100,255,218,0.1)' : 'transparent', color: activeNav === l.id ? '#64ffda' : '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', borderLeft: activeNav === l.id ? '2px solid #64ffda' : '2px solid transparent', transition: 'all 0.2s' }}>
                <span>{l.icon}</span>{l.label}
              </button>
            )
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, color: '#8892b0', textDecoration: 'none', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ff8080'}
          onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}
          >🚪 Sign Out</Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? '16px 14px' : '28px 24px', overflowX: 'hidden', paddingTop: isMobile ? 70 : 28, paddingBottom: isMobile ? 100 : 40 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.15)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64ffda', fontSize: 18, cursor: 'pointer' }}>☰</button>
            <img src="/koinovate-logo.png" alt="K" style={{ height: 30, objectFit: 'contain' }} />
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #64ffda, #00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a192f', fontWeight: 700, fontSize: 14 }}>D</div>
          </div>
        )}

        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: isMobile ? 22 : 26, fontWeight: 800, marginBottom: 4 }}>Good morning, David 👋</h1>
            <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>Your financial hub is active.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => showToast('Top-up page coming soon!')} style={{ padding: '10px 16px', borderRadius: 9, background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>+ Funds</button>
            <button onClick={() => setShowPayout(true)} style={{ padding: '10px 16px', borderRadius: 9, background: 'linear-gradient(135deg, #64ffda, #00b4d8)', border: 'none', color: '#0a192f', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>↑ Withdraw</button>
          </div>
        </div>

        {/* Wallet flip card */}
        <div style={{ marginBottom: 20 }}>
          <WalletCard />
        </div>

        {/* Stats */}
        <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📈', label: 'Total Profit', value: '₦87,500', badge: '+12.4%' },
            { icon: '🎯', label: 'Active Trades', value: '3',       badge: 'Live'   },
            { icon: '📋', label: 'Tasks Done',   value: '9/12',     badge: '75%'   },
            { icon: '🏆', label: 'Rank',         value: '#24',      badge: '↑ 6'   },
          ].map(s => (
            <div key={s.label} style={{ padding: '18px 14px', background: 'rgba(15,30,58,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,255,218,0.07)', borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: 'rgba(100,255,218,0.1)', color: '#64ffda', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{s.badge}</span>
              </div>
              <p style={{ color: '#8892b0', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"DM Sans", sans-serif', marginBottom: 4 }}>{s.label}</p>
              <p style={{ color: '#e6f1ff', fontSize: 18, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 16 }}>

          {/* Transactions */}
          <div style={{ padding: '20px', background: 'rgba(15,30,58,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,255,218,0.07)', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700 }}>Transactions</h3>
              <button style={{ background: 'none', border: 'none', color: '#64ffda', fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>View All →</button>
            </div>
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(100,255,218,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(100,255,218,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{tx.icon}</div>
                  <div>
                    <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 500, fontFamily: '"DM Sans", sans-serif' }}>{tx.name}</p>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>{tx.date}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: tx.pos ? '#64ffda' : '#ff8080', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{tx.pos ? '+' : '-'}₦{tx.amount.toLocaleString()}</p>
                  <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>{tx.type}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Notifications + Membership */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Membership */}
            <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(100,255,218,0.07), rgba(15,30,58,0.9))', border: '1px solid rgba(100,255,218,0.15)', borderRadius: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 14, fontWeight: 700 }}>My Plan</h3>
                <span style={{ background: 'rgba(100,255,218,0.15)', color: '#64ffda', fontSize: 9, padding: '3px 10px', borderRadius: 20, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>PULSE</span>
              </div>
              <div style={{ height: 5, background: 'rgba(100,255,218,0.1)', borderRadius: 3, marginBottom: 6 }}>
                <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, #64ffda, #00b4d8)', borderRadius: 3, transition: 'width 1s ease' }} />
              </div>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginBottom: 14 }}>19 days remaining</p>
              <Link href="/membership" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', textDecoration: 'none', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                Upgrade to Momentum →
              </Link>
            </div>

            {/* Notifications */}
            <div style={{ padding: '18px', background: 'rgba(15,30,58,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,255,218,0.07)', borderRadius: 18, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 14, fontWeight: 700 }}>Notifications</h3>
                <span style={{ background: '#64ffda', color: '#0a192f', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: '"DM Sans", sans-serif' }}>3 NEW</span>
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 10px', background: n.unread ? 'rgba(100,255,218,0.03)' : 'transparent', borderRadius: 10, marginBottom: 4, borderLeft: n.unread ? '2px solid rgba(100,255,218,0.4)' : '2px solid transparent' }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                  <div>
                    <p style={{ color: n.unread ? '#e6f1ff' : '#a8b2d8', fontSize: 11, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.5, marginBottom: 2 }}>{n.msg}</p>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}