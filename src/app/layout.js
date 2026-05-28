'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Image from 'next/image'
import './globals.css'

// ─── NAVIGATION DATA ──────────────────────────────────────────
const mainLinks = [
  { label: 'Home',         href: '/',            icon: '🏠' },
  { label: 'Membership',   href: '/membership',  icon: '💎' },
  { label: 'Trading',      href: '/trading',     icon: '🤖' },
  { label: 'Casino',       href: '/casino',      icon: '🎰' },
  { label: 'Surveys',      href: '/surveys',     icon: '📊' },
  { label: 'Tasks',        href: '/tasks',       icon: '📋' },
  { label: 'Stocks',       href: '/stocks',      icon: '📈' },
  { label: 'Work With Us', href: '/work-with-us',icon: '🤝' },
  { label: 'Support',      href: '/support',     icon: '🎧' },
]

const bottomTabs = [
  { label: 'Home',     href: '/',           icon: '🏠' },
  { label: 'Trade',    href: '/trading',    icon: '🤖' },
  { label: 'Dashboard',href: '/dashboard',  icon: '📊' },
  { label: 'Casino',   href: '/casino',     icon: '🎰' },
  { label: 'More',     href: '#more',       icon: '⋯'  },
]

// ─── HEADER ───────────────────────────────────────────────────
function Header() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [moreOpen,    setMoreOpen]    = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const moreRef  = useRef(null)
  const isLoggedIn = useUserStore(state => state.isLoggedIn)
  const hasActivePlan = useUserStore(state => state.hasActivePlan)
  const refreshSession = useUserStore(state => state.refreshSession)
  const user = useUserStore(state => state.user)
  const isLoading = useUserStore(state => state.isLoading)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!user && !isLoading) {
      refreshSession()
    }
  }, [user, isLoading, refreshSession])

  const getTargetHref = href => {
    if (!isLoggedIn) return '/auth'
    if (!hasActivePlan) return '/membership'
    return href
  }

  const handleNavClick = (event, href) => {
    event.preventDefault()
    router.push(getTargetHref(href))
    setMobileOpen(false)
    setMoreOpen(false)
  }

  useEffect(() => {
    const fn = e => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Hide header on dashboard (it has its own layout)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '8px 20px' : '14px 20px',
        background: scrolled ? 'rgba(8,20,40,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(100,255,218,0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/koinovate-logo.png"
            alt="KOINOVATE"
            style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(100,255,218,0.3))' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {mainLinks.slice(0, 5).map(l => (
            <button key={l.href} onClick={e => handleNavClick(e, l.href)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: pathname === l.href ? '#64ffda' : '#8892b0',
              textDecoration: 'none', fontSize: 13, fontWeight: 500,
              fontFamily: '"DM Sans", sans-serif', transition: 'color 0.2s',
              borderBottom: pathname === l.href ? '1px solid #64ffda' : '1px solid transparent',
              paddingBottom: 2,
            }}>{l.label}</button>
          ))}

          {/* More dropdown */}
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button onClick={() => setMoreOpen(!moreOpen)} style={{
              background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.15)',
              color: '#64ffda', padding: '6px 14px', borderRadius: 8,
              fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
            }}>More ▾</button>
            {moreOpen && (
              <div style={{
                position: 'absolute', top: '115%', right: 0,
                background: 'rgba(8,20,40,0.98)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(100,255,218,0.12)', borderRadius: 16,
                padding: '8px', minWidth: 200, zIndex: 200,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                {mainLinks.slice(5).map(l => (
                  <button key={l.href} onClick={e => handleNavClick(e, l.href)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '11px 14px', borderRadius: 10,
                    color: '#a8b2d8', fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif', transition: 'all 0.2s',
                    textAlign: 'left', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,255,218,0.08)'; e.currentTarget.style.color = '#64ffda' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a8b2d8' }}
                  >
                    <span style={{ fontSize: 16 }}>{l.icon}</span>{l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/auth" style={{ color: '#8892b0', textDecoration: 'none', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>Sign In</Link>
          <Link href="/auth" style={{
            padding: '9px 20px', borderRadius: 9,
            background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
            color: '#0a192f', fontWeight: 700, fontSize: 13,
            textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 0 20px rgba(100,255,218,0.25)',
          }}>Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-only"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#64ffda', fontSize: 24, cursor: 'pointer', padding: 4 }}
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(5,12,24,0.98)', backdropFilter: 'blur(20px)',
          paddingTop: 72, paddingBottom: 80,
          overflowY: 'auto',
          animation: 'slideInRight 0.3s ease',
        }}>
          <style>{`@keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}`}</style>

          {/* Mobile logo */}
          <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(100,255,218,0.08)' }}>
            <img src="/koinovate-logo.png" alt="KOINOVATE" style={{ height: 44, objectFit: 'contain' }} />
          </div>

          <nav style={{ padding: '16px 12px' }}>
            {mainLinks.map(l => (
              <button key={l.href} onClick={e => handleNavClick(e, l.href)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                width: '100%', background: pathname === l.href ? 'rgba(100,255,218,0.08)' : 'transparent',
                border: 'none', padding: '15px 16px', borderRadius: 12, marginBottom: 4,
                color: pathname === l.href ? '#64ffda' : '#a8b2d8',
                fontSize: 15,
                fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                borderLeft: pathname === l.href ? '3px solid #64ffda' : '3px solid transparent',
                transition: 'all 0.2s', cursor: 'pointer',
                textAlign: 'left',
              }}>
                <span style={{ fontSize: 20 }}>{l.icon}</span>{l.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/auth" onClick={() => setMobileOpen(false)} style={{
              padding: '14px', borderRadius: 12, textAlign: 'center',
              background: 'linear-gradient(135deg, #64ffda, #00b4d8)',
              color: '#0a192f', fontWeight: 800, fontSize: 15,
              textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 0 30px rgba(100,255,218,0.25)',
            }}>Create Free Account →</Link>
            <Link href="/auth" onClick={() => setMobileOpen(false)} style={{
              padding: '14px', borderRadius: 12, textAlign: 'center',
              background: 'transparent', border: '1px solid rgba(100,255,218,0.2)',
              color: '#e6f1ff', fontWeight: 600, fontSize: 15,
              textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
            }}>Sign In</Link>
          </div>
        </div>
      )}
    </>
  )
}

// ─── BOTTOM NAV (Mobile only) ─────────────────────────────────
function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!pathname.startsWith('/dashboard')) return null

  return (
    <>
      {moreOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 899, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More sheet */}
      {moreOpen && (
        <div style={{
          position: 'fixed', bottom: 70, left: 12, right: 12, zIndex: 900,
          background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(100,255,218,0.15)', borderRadius: 20,
          padding: '16px 8px',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.25s ease',
        }}>
          <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans", sans-serif', padding: '0 12px 12px' }}>More Pages</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Membership',   href: '/membership',  icon: '💎' },
              { label: 'Surveys',      href: '/surveys',     icon: '📊' },
              { label: 'Tasks',        href: '/tasks',       icon: '📋' },
              { label: 'Stocks',       href: '/stocks',      icon: '📈' },
              { label: 'Work With Us', href: '/work-with-us',icon: '🤝' },
              { label: 'Learning',     href: '/learning',    icon: '📚' },
              { label: 'Support',      href: '/support',     icon: '🎧' },
              { label: 'Sign In',      href: '/auth',        icon: '🔐' },
            ].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 14px', borderRadius: 12,
                background: 'rgba(100,255,218,0.04)', border: '1px solid rgba(100,255,218,0.08)',
                color: '#a8b2d8', textDecoration: 'none', fontSize: 13,
                fontFamily: '"DM Sans", sans-serif',
              }}>
                <span style={{ fontSize: 18 }}>{l.icon}</span>{l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
        background: 'rgba(8,18,36,0.97)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(100,255,218,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 4px 12px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}>
        {bottomTabs.map(tab => {
          const isMore    = tab.href === '#more'
          const isActive  = !isMore && pathname === tab.href
          return (
            <button
              key={tab.href}
              onClick={() => isMore ? setMoreOpen(!moreOpen) : null}
              style={{ background: 'none', border: 'none', padding: '4px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              {isMore ? (
                <span style={{ fontSize: 22 }}>{tab.icon}</span>
              ) : (
                <Link href={tab.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 22, filter: isActive ? 'drop-shadow(0 0 8px #64ffda)' : 'none' }}>{tab.icon}</span>
                  <span style={{ color: isActive ? '#64ffda' : '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: isActive ? 700 : 400 }}>{tab.label}</span>
                </Link>
              )}
              {isMore && <span style={{ color: moreOpen ? '#64ffda' : '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: moreOpen ? 700 : 400 }}>{tab.label}</span>}
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#64ffda', boxShadow: '0 0 6px #64ffda' }} />}
            </button>
          )
        })}
      </nav>
    </>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null

  return (
    <footer style={{
      background: '#060f1e',
      borderTop: '1px solid rgba(100,255,218,0.08)',
      padding: '56px 24px 120px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <img src="/koinovate-logo.png" alt="KOINOVATE" style={{ height: 48, objectFit: 'contain', marginBottom: 16, filter: 'drop-shadow(0 0 8px rgba(100,255,218,0.2))' }} />
            <p style={{ color: '#8892b0', fontSize: 13, lineHeight: 1.75, fontFamily: '"DM Sans", sans-serif' }}>
              The next-generation wealth-building platform for 500,000+ members. No KYC. Instant access. Real earnings.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['𝕏', 'in', '📱', '📧'].map((s, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(100,255,218,0.06)',
                  border: '1px solid rgba(100,255,218,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#8892b0', textDecoration: 'none', fontSize: 14,
                  transition: 'all 0.2s',
                }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Platform',  links: [['Membership','/membership'],['AI Trading','/trading'],['Casino','/casino'],['Surveys','/surveys']] },
            { title: 'Earn',      links: [['Daily Tasks','/tasks'],['Stocks','/stocks'],['Work With Us','/work-with-us'],['Learning','/learning']] },
            { title: 'Company',   links: [['About','#'],['Blog','#'],['Careers','#'],['Press','#']] },
            { title: 'Legal',     links: [['Privacy Policy','#'],['Terms of Service','#'],['Cookies','#'],['Support','/support']] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ color: '#e6f1ff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: '"Syne", sans-serif' }}>{col.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ color: '#8892b0', textDecoration: 'none', fontSize: 13, fontFamily: '"DM Sans", sans-serif', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#64ffda'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}
                  >{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(100,255,218,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>© 2026 KOINOVATE Technologies Ltd. All rights reserved.</p>
          <p style={{ color: 'rgba(136,146,176,0.4)', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Secured · Scalable · Futuristic</p>
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT LAYOUT ──────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ margin: 0, background: '#0a192f', color: '#e6f1ff', minHeight: '100vh', overflowX: 'hidden' }}>
        <Header />
        <main style={{ paddingBottom: 80, width: '100%', maxWidth: '100vw', minWidth: 0, overflowX: 'hidden' }}>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}