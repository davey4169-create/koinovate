'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home',       href: '/' },
    { label: 'Membership', href: '/membership' },
    { label: 'Learning',   href: '/learning' },
    { label: 'Trading',    href: '/trading' },
    { label: 'Games',      href: '/games' },
    { label: 'Surveys',    href: '/surveys' },
    { label: 'Support',    href: '/support'}
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '12px 24px' : '20px 24px',
      background: scrolled ? 'rgba(10,25,47,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(100,255,218,0.1)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>⚡</span>
        <span style={{
          fontFamily: '"Orbitron", monospace',
          color: '#64ffda',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(100,255,218,0.5)',
        }}>
          KOINOVATE
        </span>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: '#8892b0',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: '"DM Sans", sans-serif',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#64ffda'}
            onMouseLeave={e => e.currentTarget.style.color = '#8892b0'}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/auth" style={{
          color: '#8892b0',
          textDecoration: 'none',
          fontSize: 14,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          Sign In
        </Link>
        <Link href="/auth" style={{
          padding: '9px 20px',
          borderRadius: 8,
          background: '#64ffda',
          color: '#0a192f',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
          fontFamily: '"DM Sans", sans-serif',
        }}>
          Get Started
        </Link>
      </div>
    </header>
  )
}