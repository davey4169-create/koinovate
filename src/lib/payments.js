// src/lib/payments.js
// Server-side only

// ── PAYSTACK ──────────────────────────────────────────────────
export async function initializePaystack({ email, amount, metadata = {}, callbackUrl }) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY is not set.')

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount:      Math.round(Number(amount) * 100), // kobo
      currency:    'NGN',
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      metadata,
    }),
  })

  const data = await response.json()
  if (!data.status) throw new Error(data.message || 'Paystack initialization failed')
  return data.data
}

export async function verifyPaystack(reference) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY is not set.')

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } }
  )

  const data = await response.json()
  if (!data.status) throw new Error('Paystack verification failed')
  return data.data
}

// ── FLUTTERWAVE ───────────────────────────────────────────────
export async function initializeFlutterwave({
  email, name, phone, amount, description, metadata = {}, redirectUrl,
}) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) throw new Error('FLUTTERWAVE_SECRET_KEY is not set.')

  const txRef = `KNV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref:       txRef,
      amount:       Number(amount),
      currency:     'NGN',
      redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      customer: { email, name, phonenumber: phone || '' },
      payment_options: 'card,banktransfer,ussd',
      customizations: {
        title:       'KOINOVATE',
        description: description || 'KOINOVATE Membership',
        logo:        `${process.env.NEXT_PUBLIC_APP_URL}/koinovate-logo.png`,
      },
      meta: metadata,
    }),
  })

  const data = await response.json()
  if (data.status !== 'success') throw new Error(data.message || 'Flutterwave init failed')
  return { ...data.data, reference: txRef }
}

export async function verifyFlutterwave(transactionId) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) throw new Error('FLUTTERWAVE_SECRET_KEY is not set.')

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${secretKey}` } }
  )

  const data = await response.json()
  if (data.status !== 'success') throw new Error('Flutterwave verification failed')
  return data.data
}