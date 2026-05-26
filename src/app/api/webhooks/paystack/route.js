import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  const body      = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex')

  if (hash !== signature)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data
    // Trigger same verification logic
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, gateway: 'paystack' }),
    })
  }

  return NextResponse.json({ received: true })
}