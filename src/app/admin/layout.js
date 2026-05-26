'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminLinks = [
  { href: '/admin',             icon: '📊', label: 'Overview' },
  { href: '/admin/users',       icon: '👥', label: 'Users' },
  { href: '/admin/membership',  icon: '💎', label: 'Membership' },
  { href: '/admin/learning',    icon: '📚', label: 'Learning' },
  { href: '/admin/analytics',   icon: '📈', label: 'Analytics' },
  { href: '/admin/tasks',       icon: '🪙', label: 'Tasks' },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#060f1e', color: '#e6f1ff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;800&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #060f1e; }
          ::-webkit-scrollbar-thumb { background: #00b4d8; border-radius: 2px; }
        `}</style>

        {/* Admin top bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 100,
          background: 'rgba(6,15,30,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,80,80,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #ff6b6b, #ff4040)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
            <div>
              <span style={{ fontFamily: '"Orbitron", monospace', color: '#ff6b6b', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>KOINOVATE</span>
              <span style={{ color: '#ff6b6b', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginLeft: 8, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)' }}>ADMIN</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#64ffda' }} />
            <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Super Admin</span>
            <Link href="/" style={{ padding: '6px 14px', borderRadius: 7, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#ff6b6b', textDecoration: 'none', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>← Exit Admin</Link>
          </div>
        </div>

        <div style={{ display: 'flex', paddingTop: 56 }}>
          {/* Admin sidebar */}
          <aside style={{
            width: 200, minHeight: 'calc(100vh - 56px)',
            background: 'rgba(8,18,36,0.95)', borderRight: '1px solid rgba(255,107,107,0.08)',
            padding: '24px 12px', position: 'sticky', top: 56, height: 'calc(100vh - 56px)', overflowY: 'auto', flexShrink: 0,
          }}>
            <p style={{ color: '#8892b0', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '"DM Sans", sans-serif', marginBottom: 12, paddingLeft: 12 }}>CONTROL CENTER</p>
            {adminLinks.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px',
                  borderRadius: 9, marginBottom: 2, textDecoration: 'none',
                  background: active ? 'rgba(255,107,107,0.1)' : 'transparent',
                  color: active ? '#ff6b6b' : '#8892b0',
                  fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                  borderLeft: active ? '2px solid #ff6b6b' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  <span>{l.icon}</span>{l.label}
                </Link>
              )
            })}
          </aside>

          <main style={{ flex: 1, overflowX: 'hidden' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}