import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { initializePaystack, initializeFlutterwave } from '@/lib/payments'

const TIER_PRICES = {
  spark: 8000,
  pulse: 15000,
  momentum: 25000,
}

export async function POST(request) {
  try {
    const { userId, tier, gateway, email, name, phone } = await request.json()

    if (!userId || !tier || !gateway)
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )

    const amount = TIER_PRICES[tier]
    if (!amount)
      return NextResponse.json(
        { error: 'Invalid membership tier.' },
        { status: 400 }
      )

    const metadata = {
      user_id: userId,
      tier,
      type: 'membership_payment',
    }

    let paymentData

    if (gateway === 'paystack') {
      paymentData = await initializePaystack({
        email,
        amount,
        metadata,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify?gateway=paystack`,
      })
    } else if (gateway === 'flutterwave') {
      paymentData = await initializeFlutterwave({
        email,
        name,
        phone,
        amount,
        description: `KOINOVATE ${tier.toUpperCase()} Membership`,
        metadata,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify?gateway=flutterwave`,
      })
    } else {
      return NextResponse.json({ error: 'Invalid payment gateway.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, ...paymentData })
  } catch (err) {
    console.error('Payment init error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}