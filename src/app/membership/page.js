'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PaymentModal from '@/components/ui/PaymentModal'
import { useUserStore } from '@/store/userStore'

const plans = [
  {
    id: 'spark',
    name: 'SPARK',
    price: 8000,
    period: 'per year',
    color: '#a8b2d8',
    highlight: false,
    badge: 'ESSENTIAL',
    tagline: 'Start your wealth journey',
    starterReward: '₦5,000',
  },
  {
    id: 'pulse',
    name: 'PULSE',
    price: 15000,
    period: 'per year',
    color: '#64ffda',
    highlight: true,
    badge: 'MOST POPULAR',
    tagline: 'Accelerate your earnings',
    starterReward: '₦11,000',
  },
  {
    id: 'momentum',
    name: 'MOMENTUM',
    price: 25000,
    period: 'per year',
    color: '#00b4d8',
    highlight: false,
    badge: 'PREMIUM',
    tagline: 'Unlock your full potential',
    starterReward: '₦20,000',
  },
]

const featureRows = [
  'Starter Reward',
  'Starter Freebie',
  'Referral Bonus',
  'Survey Earnings',
  'AI Investment Trade',
  'Daily AI Profit',
  'Max Earning Per Task',
  'Daily Tasks',
  'Stocks Access',
  'Casino Potential',
  'Withdrawal Frequency',
]

const planFeatures = {
  spark: {
    'Starter Reward': '₦5,000',
    'Starter Freebie': '2GB Data',
    'Referral Bonus': '₦5,100',
    'Survey Earnings': 'Up to $5/survey',
    'AI Investment Trade': 'Not Available',
    'Daily AI Profit': 'N/A',
    'Max Earning Per Task': 'Up to ₦2,000',
    'Daily Tasks': '5 Tasks',
    'Stocks Access': 'Limited Access',
    'Casino Potential': 'Up to ₦100k',
    'Withdrawal Frequency': 'Monthly',
  },
  pulse: {
    'Starter Reward': '₦11,000',
    'Starter Freebie': '5GB Data',
    'Referral Bonus': '₦8,000',
    'Survey Earnings': 'Up to $10/survey',
    'AI Investment Trade': 'Available',
    'Daily AI Profit': 'Up to ₦100/day',
    'Max Earning Per Task': 'Up to ₦8,000',
    'Daily Tasks': '12 Tasks',
    'Stocks Access': 'Access',
    'Casino Potential': 'Up to ₦500k',
    'Withdrawal Frequency': 'Bi-Weekly',
  },
  momentum: {
    'Starter Reward': '₦20,000',
    'Starter Freebie': '13+ Premium Courses + 5GB',
    'Referral Bonus': '₦15,000',
    'Survey Earnings': 'Up to $50/survey',
    'AI Investment Trade': 'Available',
    'Daily AI Profit': 'Up to ₦100/day',
    'Max Earning Per Task': 'Up to ₦16,000',
    'Daily Tasks': 'Unlimited',
    'Stocks Access': 'Access + Priority Dividends',
    'Casino Potential': 'Up to ₦1M',
    'Withdrawal Frequency': 'Weekly',
  },
}

export default function MembershipPage() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const isLoggedIn = useUserStore(state => state.isLoggedIn)
  const hasActivePlan = useUserStore(state => state.hasActivePlan)
  const [hydrated, setHydrated] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) {
      router.replace('/auth')
      return
    }
    if (hasActivePlan) {
      router.replace('/dashboard')
    }
  }, [hydrated, isLoggedIn, hasActivePlan, router])

  const openPayment = tier => setSelectedTier(tier)
  const closeModal = () => setSelectedTier(null)

  if (!hydrated || !isLoggedIn) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a192f', paddingTop: 80 }}>
      <section
        style={{
          textAlign: 'center',
          padding: '72px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 100,
            background: 'rgba(100,255,218,0.08)',
            border: '1px solid rgba(100,255,218,0.2)',
            marginBottom: 22,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#64ffda',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              color: '#64ffda',
              fontSize: 12,
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            Select your package and pay with Paystack or Flutterwave
          </span>
        </div>

        <h1
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 'clamp(34px, 5vw, 58px)',
            fontWeight: 800,
            color: '#e6f1ff',
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          Choose your KOINOVATE membership
        </h1>
        <p
          style={{
            color: '#8892b0',
            fontSize: 16,
            maxWidth: 680,
            margin: '0 auto',
            fontFamily: '"DM Sans", sans-serif',
            lineHeight: 1.75,
          }}
        >
          New users without an active membership are automatically guided through
          the package selection, payment gateway choice, and membership activation
          flow.
        </p>
      </section>

      <section style={{ padding: '24px', maxWidth: 1120, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{
                borderRadius: 24,
                padding: 28,
                background: plan.highlight
                  ? 'rgba(100,255,218,0.08)'
                  : 'rgba(17,34,64,0.8)',
                border: `1px solid ${plan.highlight ? 'rgba(100,255,218,0.25)' : 'rgba(100,255,218,0.08)'}`,
                boxShadow: plan.highlight ? `0 20px 60px rgba(100,255,218,0.12)` : 'none',
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: plan.color,
                    color: '#0a192f',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    marginBottom: 18,
                    width: 'fit-content',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Syne", sans-serif',
                      color: '#e6f1ff',
                      fontSize: 48,
                      fontWeight: 800,
                    }}
                  >
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
                      .format(plan.price)
                      .replace('NGN', '₦')}
                  </span>
                  <span
                    style={{
                      color: '#8892b0',
                      fontSize: 14,
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  style={{
                    color: '#8892b0',
                    fontSize: 14,
                    fontFamily: '"DM Sans", sans-serif',
                    lineHeight: 1.8,
                  }}
                >
                  {plan.tagline}
                </p>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: 'grid',
                    gap: 14,
                  }}
                >
                  <div style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>
                    Starter Reward
                  </div>
                  <div style={{ color: '#64ffda', fontSize: 22, fontWeight: 800 }}>
                    {plan.starterReward}
                  </div>
                </div>
              </div>

              <button
                onClick={() => openPayment(plan.id)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 14,
                  border: 'none',
                  background: plan.highlight
                    ? 'linear-gradient(135deg, #64ffda, #00b4d8)'
                    : 'rgba(100,255,218,0.12)',
                  color: plan.highlight ? '#0a192f' : plan.color,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {plan.highlight ? 'Activate Pulse' : `Activate ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '24px', maxWidth: 1120, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gap: 22,
          }}
        >
          {featureRows.map(feature => (
            <div
              key={feature}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr repeat(3, minmax(140px, 1fr))',
                gap: 14,
                padding: '18px 20px',
                borderRadius: 20,
                background: 'rgba(17,34,64,0.7)',
                border: '1px solid rgba(100,255,218,0.08)',
              }}
            >
              <div style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}>
                {feature}
              </div>
              {plans.map(plan => (
                <div
                  key={plan.id}
                  style={{
                    color: '#e6f1ff',
                    fontSize: 13,
                    fontFamily: '"DM Sans", sans-serif',
                    textAlign: 'center',
                  }}
                >
                  {planFeatures[plan.id][feature]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {selectedTier && user && (
        <PaymentModal
          tier={selectedTier}
          userId={user.id}
          userEmail={user.email}
          userName={user.full_name || user.user_metadata?.full_name || ''}
          userPhone={user.phone || ''}
          onClose={closeModal}
        />
      )}
    </div>
  )
}