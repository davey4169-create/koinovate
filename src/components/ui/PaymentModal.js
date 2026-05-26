'use client'
import { useState } from 'react'

const TIERS = {
  spark:    { name: 'SPARK',    price: 8000,  color: '#a8b2d8' },
  pulse:    { name: 'PULSE',    price: 15000, color: '#64ffda' },
  momentum: { name: 'MOMENTUM', price: 25000, color: '#00b4d8' },
}

export default function PaymentModal({ tier, userEmail, userName, userPhone, onClose, onSuccess }) {
  const [gateway,  setGateway]  = useState('paystack')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const plan = TIERS[tier]

  const handlePay = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:  'USER_ID_FROM_AUTH',  // Replace with real user ID from store
          tier,
          gateway,
          email:   userEmail,
          name:    userName,
          phone:   userPhone,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Redirect to payment page
      if (gateway === 'paystack') window.location.href = data.authorization_url
      if (gateway === 'flutterwave') window.location.href = data.link

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'rgba(10,22,40,0.99)', border: `1px solid ${plan.color}30`, borderRadius: 24, padding: '36px 32px', maxWidth: 420, width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/koinovate-logo.png" alt="KOINOVATE" style={{ height: 40, objectFit: 'contain' }} />
        </div>

        <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          Activate {plan.name} Plan
        </h2>
        <p style={{ fontFamily: '"Orbitron", monospace', color: plan.color, fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
          ₦{plan.price.toLocaleString()}<span style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>/month</span>
        </p>

        {error && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8080', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>⚠️ {error}</div>}

        <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>Choose your payment method:</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {['paystack', 'flutterwave'].map(g => (
            <button key={g} onClick={() => setGateway(g)} style={{
              flex: 1, padding: '14px', borderRadius: 12,
              border: `1px solid ${gateway === g ? plan.color + '40' : 'rgba(100,100,100,0.2)'}`,
              background: gateway === g ? `${plan.color}10` : 'rgba(10,22,40,0.8)',
              color: gateway === g ? plan.color : '#8892b0',
              fontSize: 14, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{g === 'paystack' ? '💳 Paystack' : '🦋 Flutterwave'}</button>
          ))}
        </div>

        <button onClick={handlePay} disabled={loading} style={{
          width: '100%', padding: '15px', borderRadius: 12, border: 'none',
          background: loading ? `${plan.color}50` : `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)`,
          color: '#0a192f', fontWeight: 800, fontSize: 15,
          fontFamily: '"DM Sans", sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : `0 0 30px ${plan.color}25`,
        }}>
          {loading ? '⏳ Redirecting to payment...' : `Pay ₦${plan.price.toLocaleString()} →`}
        </button>

        <p style={{ textAlign: 'center', color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginTop: 14 }}>
          🔒 Secured by {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'} · SSL Encrypted
        </p>
      </div>
    </div>
  )
}