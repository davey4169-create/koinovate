'use client'

import { useState } from 'react'

const TIERS = {
  spark: { name: 'SPARK', price: 8000, color: '#a8b2d8' },
  pulse: { name: 'PULSE', price: 15000, color: '#64ffda' },
  momentum: { name: 'MOMENTUM', price: 25000, color: '#00b4d8' },
}

export default function PaymentModal({
  tier,
  userId,
  userEmail,
  userName,
  userPhone,
  onClose,
}) {
  const [gateway, setGateway] = useState('paystack')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const plan = TIERS[tier]

  if (!plan) {
    return null
  }

  const handlePay = async () => {
    if (!userId) {
      setError('You must be signed in to pay.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tier,
          gateway,
          email: userEmail,
          name: userName,
          phone: userPhone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed.')
      }

      if (gateway === 'paystack') {
        window.location.href = data.authorization_url
        return
      }

      if (gateway === 'flutterwave') {
        window.location.href = data.link
        return
      }

      throw new Error('Unsupported payment gateway.')
    } catch (err) {
      setError(err.message || 'Unable to begin payment.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 24,
          background: 'rgba(10,22,40,0.98)',
          border: `1px solid ${plan.color}30`,
          padding: '34px 30px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 22,
            color: '#e6f1ff',
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          Activate {plan.name}
        </h2>
        <p
          style={{
            fontFamily: '"Orbitron", monospace',
            color: plan.color,
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          ₦{plan.price.toLocaleString()}
          <span
            style={{
              color: '#8892b0',
              fontSize: 13,
              fontFamily: '"DM Sans", sans-serif',
              marginLeft: 6,
            }}
          >
            / year
          </span>
        </p>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              background: 'rgba(255,80,80,0.1)',
              border: '1px solid rgba(255,80,80,0.3)',
              color: '#ff8080',
              fontSize: 13,
              marginBottom: 18,
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <p
          style={{
            color: '#a8b2d8',
            fontSize: 13,
            fontFamily: '"DM Sans", sans-serif',
            marginBottom: 18,
          }}
        >
          Choose your payment gateway:
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          {['paystack', 'flutterwave'].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setGateway(g)}
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: 14,
                border: `1px solid ${gateway === g ? plan.color + '55' : 'rgba(100,100,100,0.2)'}`,
                background: gateway === g ? `${plan.color}15` : 'rgba(10,22,40,0.8)',
                color: gateway === g ? plan.color : '#8892b0',
                fontSize: 14,
                fontFamily: '"DM Sans", sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {g === 'paystack' ? '💳 Paystack' : '🦋 Flutterwave'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px 18px',
            borderRadius: 14,
            border: 'none',
            background: loading
              ? `${plan.color}55`
              : `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)`,
            color: '#0a192f',
            fontSize: 15,
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : `0 14px 40px ${plan.color}22`,
          }}
        >
          {loading ? '⏳ Redirecting to payment...' : `Pay ₦${plan.price.toLocaleString()} →`}
        </button>

        <p
          style={{
            marginTop: 16,
            textAlign: 'center',
            color: '#8892b0',
            fontSize: 12,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          🔒 Secured by {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}
        </p>
      </div>
    </div>
  )
}