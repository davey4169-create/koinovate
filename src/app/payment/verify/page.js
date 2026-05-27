'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refreshProfile = useUserStore(state => state.refreshProfile)
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your payment. Please wait...')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const gateway = searchParams.get('gateway')
    const reference =
      searchParams.get('reference') ||
      searchParams.get('trxref') ||
      searchParams.get('reference_code')
    const transactionId =
      searchParams.get('transaction_id') ||
      searchParams.get('transactionId') ||
      searchParams.get('tx_ref')

    if (!gateway) {
      setStatus('error')
      setMessage('Payment gateway is missing from the callback.')
      return
    }

    async function verifyPayment() {
      try {
        const body = { gateway }

        if (gateway === 'paystack') {
          body.reference = reference
        } else {
          body.transactionId = transactionId
        }

        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Payment verification failed.')
        }

        setStatus('success')
        setMessage(data.message || 'Payment verified successfully.')
        setDetails(data)
        await refreshProfile()

        window.setTimeout(() => {
          router.replace('/dashboard')
        }, 2200)
      } catch (err) {
        setStatus('error')
        setMessage(err.message || 'Unable to verify payment.')
      }
    }

    verifyPayment()
  }, [searchParams, router, refreshProfile])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a192f',
        color: '#e6f1ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          padding: 34,
          borderRadius: 24,
          background: 'rgba(10,22,40,0.96)',
          border: '1px solid rgba(100,255,218,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
        }}
      >
        <h1
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 28,
            marginBottom: 12,
          }}
        >
          {status === 'verifying'
            ? 'Verifying payment...'
            : status === 'success'
            ? 'Payment confirmed'
            : 'Payment verification failed'}
        </h1>
        <p
          style={{
            color: '#a8b2d8',
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 24,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {message}
        </p>
        {status === 'success' && (
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 16,
              background: 'rgba(100,255,218,0.08)',
              border: '1px solid rgba(100,255,218,0.18)',
              color: '#64ffda',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Redirecting to your dashboard now...
          </div>
        )}
        {status === 'error' && (
          <button
            onClick={() => router.replace('/membership')}
            style={{
              marginTop: 20,
              padding: '14px 18px',
              borderRadius: 14,
              border: 'none',
              background: '#64ffda',
              color: '#0a192f',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Go back to Membership
          </button>
        )}
      </div>
    </div>
  )
}