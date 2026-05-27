'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

function Field({ label, type, placeholder, icon, value, onChange }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: 'block',
          color: '#a8b2d8',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 7,
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 13,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 15,
            opacity: 0.5,
          }}
        >
          {icon}
        </span>
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '13px 40px 13px 40px',
            background: 'rgba(10,25,47,0.8)',
            border: '1px solid rgba(100,255,218,0.1)',
            borderRadius: 10,
            color: '#e6f1ff',
            fontSize: 14,
            fontFamily: '"DM Sans", sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border 0.2s',
          }}
          onFocus={e => (e.target.style.border = '1px solid rgba(100,255,218,0.4)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(100,255,218,0.1)')}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: 'absolute',
              right: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: '#8892b0',
            }}
          >
            {show ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  const login = useUserStore(state => state.login)
  const register = useUserStore(state => state.register)
  const isLoggedIn = useUserStore(state => state.isLoggedIn)
  const hasActivePlan = useUserStore(state => state.hasActivePlan)
  const router = useRouter()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (isLoggedIn) {
      router.replace(hasActivePlan ? '/dashboard' : '/membership')
    }
  }, [hydrated, isLoggedIn, hasActivePlan, router])

  const updateField = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (loading) return

    setMsg(null)

    if (!form.email || !form.password) {
      setMsg({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    if (tab === 'register') {
      if (!form.fullName) {
        setMsg({ type: 'error', text: 'Please enter your full name.' })
        return
      }
      if (form.password !== form.confirm) {
        setMsg({ type: 'error', text: 'Passwords do not match.' })
        return
      }
    }

    setLoading(true)

    try {
      if (tab === 'login') {
        const { error } = await login(form.email, form.password)
        if (error) {
          setMsg({ type: 'error', text: error })
          setLoading(false)
          return
        }
        router.push(hasActivePlan ? '/dashboard' : '/membership')
      } else {
        const result = await register({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phone: form.phone,
        })

        if (result.error) {
          setMsg({ type: 'error', text: result.error })
          setLoading(false)
          return
        }

        const loginResult = await login(form.email, form.password)
        if (loginResult.error) {
          setMsg({ type: 'error', text: loginResult.error })
          setLoading(false)
          return
        }

        setMsg({
          type: 'success',
          text: '✅ Account created! Redirecting to membership setup...',
        })
        router.push('/membership')
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Something went wrong.' })
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a192f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(100,255,218,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,255,218,0.05), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.06), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(15,30,55,0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(100,255,218,0.12)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(100,255,218,0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span
              style={{
                fontFamily: '"Orbitron", monospace',
                color: '#64ffda',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.15em',
              }}
            >
              KOINOVATE
            </span>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 20,
              background: 'rgba(100,255,218,0.08)',
              border: '1px solid rgba(100,255,218,0.2)',
              color: '#64ffda',
              fontSize: 11,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
            }}
          >
            ⚡ Zero KYC — Instant Wallet Activation
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            background: 'rgba(10,25,47,0.6)',
            border: '1px solid rgba(100,255,218,0.08)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
          }}
        >
          {[['login', '🔑 Sign In'], ['register', '🚀 Register']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setTab(id)
                setMsg(null)
              }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: 7,
                cursor: 'pointer',
                background: tab === id ? 'rgba(100,255,218,0.1)' : 'transparent',
                color: tab === id ? '#64ffda' : '#8892b0',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <h2
          style={{
            fontFamily: '"Syne", sans-serif',
            color: '#e6f1ff',
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          {tab === 'login' ? 'Welcome back' : 'Join KOINOVATE'}
        </h2>
        <p
          style={{
            color: '#8892b0',
            fontSize: 13,
            fontFamily: '"DM Sans", sans-serif',
            marginBottom: 24,
          }}
        >
          {tab === 'login'
            ? 'Sign in and access your dashboard instantly'
            : 'Create your account — start earning in seconds'}
        </p>

        {msg && (
          <div
            style={{
              padding: '11px 16px',
              borderRadius: 10,
              marginBottom: 18,
              background: msg.type === 'error' ? 'rgba(255,80,80,0.1)' : 'rgba(100,255,218,0.1)',
              border: `1px solid ${msg.type === 'error' ? 'rgba(255,80,80,0.3)' : 'rgba(100,255,218,0.3)'}`,
              color: msg.type === 'error' ? '#ff8080' : '#64ffda',
              fontSize: 13,
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={submit}>
          {tab === 'register' && (
            <>
              <Field
                label="Full Name"
                type="text"
                placeholder="David Johnson"
                icon="👤"
                value={form.fullName}
                onChange={updateField('fullName')}
              />
              <Field
                label="Phone Number"
                type="tel"
                placeholder="+234 800 000 0000"
                icon="📱"
                value={form.phone}
                onChange={updateField('phone')}
              />
            </>
          )}

          <Field
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon="📧"
            value={form.email}
            onChange={updateField('email')}
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            icon="🔒"
            value={form.password}
            onChange={updateField('password')}
          />

          {tab === 'register' && (
            <Field
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon="🔒"
              value={form.confirm}
              onChange={updateField('confirm')}
            />
          )}

          {tab === 'login' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 22,
                alignItems: 'center',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  gap: 7,
                  alignItems: 'center',
                  color: '#8892b0',
                  fontSize: 13,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" style={{ accentColor: '#64ffda' }} /> Remember me
              </label>
              <Link
                href="#"
                style={{
                  color: '#64ffda',
                  fontSize: 13,
                  textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                Forgot password?
              </Link>
            </div>
          )}

          {tab === 'register' && (
            <label
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginBottom: 22,
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" style={{ accentColor: '#64ffda', marginTop: 3 }} />
              <span
                style={{
                  color: '#8892b0',
                  fontSize: 12,
                  fontFamily: '"DM Sans", sans-serif',
                  lineHeight: 1.6,
                }}
              >
                I agree to the{' '}
                <Link href="#" style={{ color: '#64ffda', textDecoration: 'none' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" style={{ color: '#64ffda', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 11,
              border: 'none',
              background: loading
                ? 'rgba(100,255,218,0.4)'
                : 'linear-gradient(135deg, #64ffda, #00b4d8)',
              color: '#0a192f',
              fontWeight: 800,
              fontSize: 15,
              fontFamily: '"DM Sans", sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : '0 0 30px rgba(100,255,218,0.25)',
            }}
          >
            {loading
              ? '⏳ Please wait...'
              : tab === 'login'
              ? '🔑 Sign In to Dashboard'
              : '🚀 Create Account — Free'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '20px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(100,255,218,0.07)' }} />
          <span
            style={{
              color: '#8892b0',
              fontSize: 12,
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(100,255,218,0.07)' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          {[
            ['🌐', 'Google'],
            ['🍎', 'Apple'],
          ].map(([ico, label]) => (
            <button
              key={label}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: 10,
                background: 'rgba(10,25,47,0.6)',
                border: '1px solid rgba(100,255,218,0.1)',
                color: '#a8b2d8',
                fontSize: 13,
                fontFamily: '"DM Sans", sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {ico} {label}
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            color: '#8892b0',
            fontSize: 13,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setTab(tab === 'login' ? 'register' : 'login')
              setMsg(null)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#64ffda',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {tab === 'login' ? 'Register →' : '← Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}