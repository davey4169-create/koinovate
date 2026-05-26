// ─── PAYSTACK ─────────────────────────────────────────────────
export async function initializePaystack({ email, amount, metadata = {}, callbackUrl }) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,           // Paystack uses kobo
      currency: 'NGN',
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      metadata,
    }),
  })

  const data = await response.json()
  if (!data.status) throw new Error(data.message || 'Paystack initialization failed')
  return data.data  // { authorization_url, access_code, reference }
}

export async function verifyPaystack(reference) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })

  const data = await response.json()
  if (!data.status) throw new Error('Paystack verification failed')
  return data.data  // { status: 'success'|'failed', amount, ... }
}

// ─── FLUTTERWAVE ──────────────────────────────────────────────
export async function initializeFlutterwave({ email, name, phone, amount, description, metadata = {}, redirectUrl }) {
  const txRef = `KNV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref:       txRef,
      amount,
      currency:     'NGN',
      redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      customer: { email, name, phonenumber: phone },
      payment_options: 'card,banktransfer,ussd',
      customizations: {
        title: 'KOINOVATE',
        description,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/koinovate-logo.png`,
      },
      meta: metadata,
    }),
  })

  const data = await response.json()
  if (data.status !== 'success') throw new Error(data.message || 'Flutterwave init failed')
  return { ...data.data, reference: txRef }
}

export async function verifyFlutterwave(transactionId) {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  })

  const data = await response.json()
  if (data.status !== 'success') throw new Error('Flutterwave verification failed')
  return data.data
}