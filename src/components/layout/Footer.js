import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#112240',
      borderTop: '1px solid rgba(100,255,218,0.1)',
      padding: '60px 24px 32px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Top section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <span style={{
                fontFamily: '"Orbitron", monospace',
                color: '#64ffda',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}>KOINOVATE</span>
            </div>
            <p style={{
              color: '#8892b0',
              fontSize: 13,
              lineHeight: 1.75,
              fontFamily: '"DM Sans", sans-serif',
            }}>
              The next-generation wealth-building platform for 500,000+ users worldwide.
            </p>
          </div>

          {/* Link columns */}
          {[
            { title: 'Platform', items: ['Membership', 'Learning', 'Trading', 'Games'] },
            { title: 'Company',  items: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Support',  items: ['Help Centre', 'Contact', 'Privacy', 'Terms'] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{
                color: '#e6f1ff',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 18,
                fontFamily: '"Syne", sans-serif',
              }}>
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map((item) => (
                  <Link key={item} href="#" style={{
                    color: '#8892b0',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                  }}>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(100,255,218,0.08)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
            © 2026 KOINOVATE. All rights reserved.
          </p>
          <p style={{ color: 'rgba(136,146,176,0.4)', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
            Secured · Scalable · Futuristic
          </p>
        </div>
      </div>
    </footer>
  )
}