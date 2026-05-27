'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminLinks = [
  { href: '/admin',            icon: '📊', label: 'Overview'   },
  { href: '/admin/users',      icon: '👥', label: 'Users'      },
  { href: '/admin/membership', icon: '💎', label: 'Membership' },
  { href: '/admin/learning',   icon: '📚', label: 'Learning'   },
  { href: '/admin/analytics',  icon: '📈', label: 'Analytics'  },
  { href: '/admin/tasks',      icon: '📋', label: 'Tasks'      },
  { href: '/admin/settings',   icon: '⚙️', label: 'Settings'   },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060f1e',
      color: '#e6f1ff',
      fontFamily: '"DM Sans", sans-serif',
    }}>

      {/* Admin top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 54, zIndex: 100,
        background: 'rgba(4,8,18,0.98)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,80,80,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#ff6b6b,#ff4040)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: '"Orbitron", monospace', color: '#ff6b6b', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>KOINOVATE</span>
          <span style={{ color: '#ff6b6b', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.25)', marginLeft: 4 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#64ffda' }} />
            <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Super Admin</span>
          </div>
          <Link href="/" style={{ padding: '6px 14px', borderRadius: 7, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.18)', color: '#ff6b6b', textDecoration: 'none', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
            ← Exit Admin
          </Link>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', paddingTop: 54 }}>

        {/* Sidebar */}
        <aside style={{
          width: 200, minHeight: 'calc(100vh - 54px)',
          background: 'rgba(6,10,22,0.97)',
          borderRight: '1px solid rgba(255,107,107,0.07)',
          padding: '20px 10px',
          position: 'sticky', top: 54,
          height: 'calc(100vh - 54px)',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <p style={{ color: '#2d3748', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 10px 10px', fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}>CONTROL CENTER</p>

          {adminLinks.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 12px', borderRadius: 10, marginBottom: 2,
                textDecoration: 'none',
                background: active ? 'rgba(255,107,107,0.08)' : 'transparent',
                color: active ? '#ff6b6b' : '#8892b0',
                fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                borderLeft: active ? '2px solid #ff6b6b' : '2px solid transparent',
                transition: 'all 0.18s',
              }}>
                <span>{l.icon}</span>{l.label}
              </Link>
            )
          })}
        </aside>

        {/* Page content */}
        <main style={{ flex: 1, overflowX: 'hidden', minHeight: 'calc(100vh - 54px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}