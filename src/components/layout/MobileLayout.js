'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// A light mobile wrapper: when on small screens and on specific pages,
// wrap the page content in a simplified, roomy container to feel "mobile".
export default function MobileLayout({ children }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Pages to apply simplified mobile layout to
  const mobilePages = [
    '/tasks','/support','/work-with-us','/stocks','/surveys','/casino',
    '/trading','/membership','/auth','/learning','/payment'
  ]

  const matches = mobilePages.some(p => pathname.startsWith(p))

  if (!isMobile || !matches) return children

  return (
    <div style={{
      padding: '16px',
      minHeight: '100vh',
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, rgba(10,20,40,0.98), rgba(8,16,32,0.98))',
      color: '#e6f1ff',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: 'transparent' }}>
        {children}
      </div>
    </div>
  )
}
