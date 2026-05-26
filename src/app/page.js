'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

// ── Animated Particle Field ────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 5,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'rgba(100,255,218,0.4)',
          animation: `floatParticle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          boxShadow: '0 0 6px rgba(100,255,218,0.3)',
        }} />
      ))}
      <style>{`
        @keyframes floatParticle {
          0%,100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 0.8; }
        }
        @keyframes spin3d {
          0% { transform: perspective(600px) rotateY(0deg) rotateX(8deg); }
          100% { transform: perspective(600px) rotateY(360deg) rotateX(8deg); }
        }
        @keyframes floatCard {
          0%,100% { transform: perspective(800px) rotateY(-12deg) rotateX(5deg) translateY(0px); }
          50% { transform: perspective(800px) rotateY(-12deg) rotateX(5deg) translateY(-16px); }
        }
        @keyframes floatCard2 {
          0%,100% { transform: perspective(800px) rotateY(12deg) rotateX(-5deg) translateY(0px); }
          50% { transform: perspective(800px) rotateY(12deg) rotateX(-5deg) translateY(-12px); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
// ── 3D Floating UI Card ────────────────────────────────────────
function Float3DCard({ style, children, animation = 'floatCard' }) {
  return (
    <div style={{
      background: 'rgba(17,34,64,0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(100,255,218,0.15)',
      borderRadius: 16,
      padding: '18px 22px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(100,255,218,0.05)',
      animation: `${animation} 5s ease-in-out infinite`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Stat Counter ───────────────────────────────────────────────
function StatCard({ value, label, icon }) {
  return (
    <div style={{
      textAlign: 'center', padding: '28px 24px',
      background: 'rgba(17,34,64,0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(100,255,218,0.08)',
      borderRadius: 18,
      animation: 'fadeUp 0.8s ease forwards',
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <p style={{
        fontFamily: '"Orbitron", monospace', color: '#64ffda',
        fontSize: 28, fontWeight: 700, marginBottom: 6,
        textShadow: '0 0 20px rgba(100,255,218,0.3)',
      }}>{value}</p>
      <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{label}</p>
    </div>
  )
}

// Add this subscription popup component BEFORE the FeatureCard function
function SubscriptionPopup({ featureName, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 0.2s ease',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'rgba(10,22,40,0.99)', border: '1px solid rgba(100,255,218,0.2)',
        borderRadius: 24, padding: '40px 32px', maxWidth: 460, width: '100%',
        textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(100,255,218,0.08)', border: '2px solid rgba(100,255,218,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(100,255,218,0.1)',
        }}>🔒</div>

        <h2 style={{
          fontFamily: '"Syne", sans-serif', color: '#e6f1ff',
          fontSize: 22, fontWeight: 800, marginBottom: 10,
          letterSpacing: '-0.01em',
        }}>
          SUBSCRIBE FOR A PLAN
        </h2>
        <h3 style={{
          fontFamily: '"Orbitron", monospace', color: '#64ffda',
          fontSize: 16, fontWeight: 700, marginBottom: 16,
          textShadow: '0 0 20px rgba(100,255,218,0.4)',
          letterSpacing: '0.05em',
        }}>
          BEFORE GETTING ACCESS TO<br />
          <span style={{ color: '#f59e0b' }}>{featureName.toUpperCase()}</span>
        </h3>
        <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, marginBottom: 28 }}>
          This feature is available to active KOINOVATE members. Choose a plan that suits you — from <strong style={{ color: '#a8b2d8' }}>₦8,000/mo</strong> — and unlock everything instantly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/membership" onClick={onClose} style={{
            padding: '14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
            color: '#0a192f', fontWeight: 800, fontSize: 15,
            textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 0 30px rgba(100,255,218,0.25)',
            display: 'block', textAlign: 'center',
          }}>
            View Membership Plans →
          </Link>
          <button onClick={onClose} style={{
            padding: '12px', borderRadius: 12,
            background: 'transparent', border: '1px solid rgba(100,255,218,0.15)',
            color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif',
            cursor: 'pointer',
          }}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// Replace the existing FeatureCard function with this:
function FeatureCard({ icon, title, desc, color, href }) {
  const [hov,        setHov]        = useState(false)
  const [showPopup,  setShowPopup]  = useState(false)

  // Simulate: user is not logged in or doesn't have a plan
  // In production, replace these with real auth state from Supabase
  const IS_LOGGED_IN   = false  // change to true when user is authenticated
  const HAS_ACTIVE_PLAN = false  // change to true when user has active membership

  const handleExplore = e => {
    if (!IS_LOGGED_IN) {
      // Not logged in → redirect to auth
      window.location.href = '/auth'
      return
    }
    if (!HAS_ACTIVE_PLAN) {
      // Logged in but no plan → show popup
      e.preventDefault()
      setShowPopup(true)
    }
    // Has active plan → Link handles the navigation normally
  }

  return (
    <>
      {showPopup && <SubscriptionPopup featureName={title} onClose={() => setShowPopup(false)} />}

      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: '30px 26px',
          background: hov ? `linear-gradient(135deg, ${color}12, rgba(17,34,64,0.8))` : 'rgba(15,30,58,0.5)',
          border: `1px solid ${hov ? color + '40' : 'rgba(100,255,218,0.07)'}`,
          borderRadius: 20, transition: 'all 0.35s ease',
          transform: hov ? 'perspective(600px) translateY(-8px) rotateX(3deg)' : 'none',
          boxShadow: hov ? `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${color}15` : 'none',
          cursor: 'pointer',
        }}
        onClick={handleExplore}
      >
        <div style={{
          width: 54, height: 54, borderRadius: 15,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, marginBottom: 20,
          boxShadow: hov ? `0 0 20px ${color}30` : 'none',
          transition: 'all 0.3s',
        }}>{icon}</div>
        <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: '#8892b0', fontSize: 14, lineHeight: 1.75, fontFamily: '"DM Sans", sans-serif', marginBottom: 16 }}>{desc}</p>
        <span style={{
          color: color, fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Explore
          <span style={{ transition: 'transform 0.2s', transform: hov ? 'translateX(5px)' : 'translateX(0)', display: 'inline-block' }}>→</span>
        </span>
      </div>
    </>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '100px 32px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(100,255,218,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(0,180,216,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        <Particles />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

          {/* Left — Text */}
          <div style={{ flex: 1, minWidth: 320, animation: 'slideInLeft 0.8s ease forwards' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 100,
              background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.2)',
              marginBottom: 32,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#64ffda', display: 'inline-block', boxShadow: '0 0 8px #64ffda' }} />
              <span style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em' }}>
                Zero KYC · Instant Access · 500,000+ Members
              </span>
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: 'clamp(42px, 6vw, 80px)',
              fontWeight: 900, lineHeight: 1.05,
              color: '#e6f1ff', marginBottom: 28,
            }}>
              Build Wealth.<br />
              <span style={{
                background: 'linear-gradient(135deg, #64ffda 0%, #00b4d8 50%, #64ffda 100%)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
              }}>Smarter.</span>
              <style>{`@keyframes shimmer { 0% { background-position: 0% } 100% { background-position: 200% } }`}</style>
            </h1>

            <p style={{
              color: '#8892b0', fontSize: 18, lineHeight: 1.8,
              maxWidth: 500, marginBottom: 44,
              fontFamily: '"DM Sans", sans-serif',
            }}>
              AI-powered trading, elite courses, daily tasks, surveys, casino gaming, and real-time stock tracking — all in one futuristic fintech platform.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/auth" style={{
                padding: '16px 36px', borderRadius: 12,
                background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
                color: '#0a192f', fontWeight: 800, fontSize: 16,
                textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0 0 30px rgba(100,255,218,0.3)',
                letterSpacing: '0.02em',
              }}>Start Free  →</Link>
              <Link href="/membership" style={{
                padding: '16px 36px', borderRadius: 12,
                background: 'rgba(100,255,218,0.06)',
                border: '1px solid rgba(100,255,218,0.2)',
                color: '#e6f1ff', fontWeight: 600, fontSize: 16,
                textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
              }}>View Plans</Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['⚡ Instant Setup', '🔒 Secured Platform', '🇳🇬 NGN Supported'].map(b => (
                <span key={b} style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right — 3D UI Cards */}
          <div style={{ flex: 1, minWidth: 320, position: 'relative', height: 480, animation: 'slideInRight 0.8s ease forwards' }}>

            {/* Main wallet card */}
            <Float3DCard style={{ position: 'absolute', top: '10%', right: '5%', width: 260 }} animation="floatCard">
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Total Balance</p>
              <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 26, fontWeight: 700, textShadow: '0 0 20px rgba(100,255,218,0.4)', marginBottom: 4 }}>₦342,500</p>
              <p style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>↑ +₦12,500 this week</p>
              <div style={{ marginTop: 16, height: 4, background: 'rgba(100,255,218,0.1)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg, #64ffda, #00b4d8)', borderRadius: 2 }} />
              </div>
            </Float3DCard>

            {/* AI signal card */}
            <Float3DCard style={{ position: 'absolute', top: '38%', left: '0%', width: 220 }} animation="floatCard2">
              <p style={{ color: '#00b4d8', fontSize: 11, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, marginBottom: 8 }}>🤖 AI SIGNAL</p>
              <p style={{ color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, marginBottom: 4 }}>BTC/USDT</p>
              <p style={{ color: '#64ffda', fontSize: 22, fontWeight: 700, fontFamily: '"Orbitron", monospace' }}>↑ BUY</p>
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>Confidence: 94%</p>
            </Float3DCard>

            {/* Earnings card */}
            <Float3DCard style={{ position: 'absolute', bottom: '5%', right: '8%', width: 220 }} animation="floatCard">
              <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today's Earnings</p>
              {[['📋 Daily Tasks', '₦8,000'], ['📊 Surveys', '$10'], ['🎰 Casino', '₦50,000']].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
                  <span style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </Float3DCard>

            {/* Glow orb */}
            <div style={{
              position: 'absolute', top: '20%', left: '30%',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(100,255,218,0.1) 0%, transparent 70%)',
              animation: 'glowPulse 4s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <p style={{ color: '#8892b0', fontSize: 10, letterSpacing: '0.15em', fontFamily: '"DM Sans", sans-serif', marginBottom: 8 }}>SCROLL</p>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(#64ffda, transparent)', margin: '0 auto' }} />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section style={{ padding: '60px 32px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <StatCard icon="👥" value="500K+" label="Active Members" />
          <StatCard icon="💰" value="₦2.4B" label="Total Paid Out" />
          <StatCard icon="🤖" value="97%" label="AI Accuracy" />
          <StatCard icon="🌍" value="150+" label="Countries" />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#64ffda', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontFamily: '"DM Sans", sans-serif' }}>Everything In One Place</p>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 800 }}>
            One Platform.{' '}
            <span style={{ background: 'linear-gradient(135deg, #64ffda, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Infinite Income.
            </span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <FeatureCard icon="🤖" title="AI Trading Hub"       color="#64ffda" href="/trading"      desc="Real-time AI signals and live market charts. Earn up to $100/day on Pulse & Momentum." />
          <FeatureCard icon="🎰" title="Casino"               color="#f59e0b" href="/casino"       desc="High-stakes instant-win games. Casino potential up to ₦1M for Momentum members." />
          <FeatureCard icon="📋" title="Daily Tasks"          color="#a855f7" href="/tasks"        desc="Complete simple daily tasks and earn up to ₦16,000 per task on Momentum." />
          <FeatureCard icon="📊" title="Online Surveys"       color="#00b4d8" href="/surveys"      desc="Share your opinion. Earn up to $50 per survey on Momentum tier." />
          <FeatureCard icon="📈" title="Stocks Tracker"       color="#34d399" href="/stocks"       desc="Live global stock market indices. KOINOVATE stocks with priority dividends." />
          <FeatureCard icon="📚" title="Learning Hub"         color="#f472b6" href="/learning"     desc="13+ premium courses exclusively for Momentum members. Learn from Nigeria's best." />
          <FeatureCard icon="🤝" title="Work With KOINOVATE"  color="#fb923c" href="/work-with-us" desc="Earn up to ₦500k/mo by partnering and recruiting for KOINOVATE. Momentum only." />
          <FeatureCard icon="💎" title="Membership Tiers"     color="#8b5cf6" href="/membership"   desc="SPARK, PULSE, MOMENTUM. Each tier unlocks more earning power and features." />
        </div>
      </section>

      {/* ── MEMBERSHIP PREVIEW ───────────────────────────── */}
      <section style={{ padding: '80px 32px', background: 'rgba(17,34,64,0.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800 }}>
              Choose Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #64ffda, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Income Level</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'SPARK',    price: '₦8,000',  color: '#a8b2d8', perks: ['5 Daily Tasks', '₦5,000 Starter Reward', '₦5,100 Referral Bonus', 'Up to $5/survey', 'Casino up to ₦100k'] },
              { name: 'PULSE',    price: '₦15,000', color: '#64ffda', perks: ['12 Daily Tasks', '₦11,000 Starter Reward', 'AI Trading Access', 'Up to $10/survey', 'Casino up to ₦500k'], hot: true },
              { name: 'MOMENTUM', price: '₦25,000', color: '#00b4d8', perks: ['Unlimited Tasks', '₦20,000 Starter Reward', 'Work With KOINOVATE', 'Up to $50/survey', 'Casino up to ₦1M'] },
            ].map(tier => (
              <div key={tier.name} style={{
                padding: '32px 26px',
                background: tier.hot ? 'rgba(100,255,218,0.05)' : 'rgba(17,34,64,0.6)',
                border: `1px solid ${tier.hot ? 'rgba(100,255,218,0.3)' : 'rgba(100,255,218,0.08)'}`,
                borderRadius: 22, position: 'relative',
                boxShadow: tier.hot ? '0 0 40px rgba(100,255,218,0.08)' : 'none',
              }}>
                {tier.hot && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#64ffda', color: '#0a192f', padding: '3px 16px', borderRadius: 20, fontSize: 10, fontWeight: 800, fontFamily: '"Orbitron", monospace', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <p style={{ fontFamily: '"Orbitron", monospace', color: tier.color, fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>{tier.name}</p>
                <p style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 36, fontWeight: 800, marginBottom: 20 }}>
                  {tier.price}<span style={{ fontSize: 14, color: '#8892b0', fontFamily: '"DM Sans", sans-serif' }}>/mo</span>
                </p>
                {tier.perks.map(p => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: tier.color, fontSize: 13 }}>✓</span>
                    <span style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{p}</span>
                  </div>
                ))}
                <Link href="/membership" style={{
                  display: 'block', textAlign: 'center', marginTop: 24,
                  padding: '12px', borderRadius: 10,
                  background: tier.hot ? '#64ffda' : 'transparent',
                  color: tier.hot ? '#0a192f' : tier.color,
                  border: tier.hot ? 'none' : `1px solid ${tier.color}40`,
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                }}>
                  {tier.hot ? '🚀 Get Started' : `Choose ${tier.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '120px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(100,255,218,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
          Start Earning Today.<br />
          <span style={{ background: 'linear-gradient(135deg, #64ffda, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Zero Verification.
          </span>
        </h2>
        <p style={{ color: '#8892b0', fontSize: 17, marginBottom: 48, fontFamily: '"DM Sans", sans-serif', position: 'relative' }}>
          Join 500,000+ members. No KYC. No delays. Instant wallet activation.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <Link href="/auth" style={{ padding: '18px 48px', borderRadius: 12, background: 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', fontWeight: 800, fontSize: 17, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 0 40px rgba(100,255,218,0.3)' }}>
            Create Free Account →
          </Link>
          <Link href="/membership" style={{ padding: '18px 48px', borderRadius: 12, background: 'transparent', color: '#e6f1ff', border: '1px solid rgba(100,255,218,0.2)', fontWeight: 600, fontSize: 17, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>
            Compare Plans
          </Link>
        </div>
      </section>
    </div>
  )
}