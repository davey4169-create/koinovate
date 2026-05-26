import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPaystack, verifyFlutterwave } from '@/lib/payments'
import { creditWallet } from '@/lib/wallet'

const TIER_PRICES   = { spark: 8000, pulse: 15000, momentum: 25000 }
const TIER_REWARDS  = { spark: 5000, pulse: 11000,  momentum: 20000  }
const TIER_DURATION = { spark: 30,   pulse: 30,     momentum: 30     } // days

export async function POST(request) {
  try {
    const { reference, gateway, transactionId } = await request.json()

    let paymentResult, amount, metadata

    if (gateway === 'paystack') {
      paymentResult = await verifyPaystack(reference)
      if (paymentResult.status !== 'success')
        return NextResponse.json({ error: 'Payment not successful.' }, { status: 400 })
      amount   = paymentResult.amount / 100  // convert from kobo
      metadata = paymentResult.metadata
    } else if (gateway === 'flutterwave') {
      paymentResult = await verifyFlutterwave(transactionId)
      if (paymentResult.status !== 'successful')
        return NextResponse.json({ error: 'Payment not successful.' }, { status: 400 })
      amount   = paymentResult.amount
      metadata = paymentResult.meta
    } else {
      return NextResponse.json({ error: 'Invalid gateway.' }, { status: 400 })
    }

    const { user_id: userId, tier } = metadata
    const expectedAmount = TIER_PRICES[tier]

    if (amount < expectedAmount)
      return NextResponse.json({ error: 'Payment amount mismatch.' }, { status: 400 })

    // Check if already processed (idempotency)
    const { data: existing } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('gateway_ref', reference || String(transactionId))
      .single()

    if (existing)
      return NextResponse.json({ success: true, message: 'Already processed.' })

    // Calculate expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + TIER_DURATION[tier])

    // Update user membership
    await supabaseAdmin.from('users').update({
      membership_tier:       tier,
      membership_expires_at: expiresAt.toISOString(),
    }).eq('id', userId)

    // Insert membership record
    await supabaseAdmin.from('memberships').insert({
      user_id:           userId,
      tier,
      amount_paid:       amount,
      payment_reference: reference || String(transactionId),
      payment_gateway:   gateway,
      expires_at:        expiresAt.toISOString(),
    })

    // Log membership payment transaction
    await supabaseAdmin.from('transactions').insert({
      user_id:     userId,
      type:        'membership_payment',
      amount,
      status:      'completed',
      description: `${tier.toUpperCase()} membership activated`,
      gateway,
      gateway_ref: reference || String(transactionId),
    })

    // Credit starter reward to total wallet
    const starterReward = TIER_REWARDS[tier]
    await creditWallet({
      userId,
      amount:      starterReward,
      walletType:  'total',
      type:        'starter_reward',
      description: `${tier.toUpperCase()} starter reward`,
      metadata:    { tier },
    })

    // If they were referred — pay referral bonus
    const { data: referral } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id')
      .eq('referred_id', userId)
      .eq('bonus_paid', false)
      .single()

    if (referral) {
      const { data: referrer } = await supabaseAdmin.from('users').select('membership_tier').eq('id', referral.referrer_id).single()
      const referralBonuses = { spark: 5100, pulse: 8000, momentum: 10000 }
      const bonusTier = referrer?.membership_tier || 'spark'
      const bonus = referralBonuses[bonusTier] || 5100

      await creditWallet({
        userId:      referral.referrer_id,
        amount:      bonus,
        walletType:  'revenue_share',
        type:        'referral_bonus',
        description: `Referral bonus for new ${tier} member`,
        metadata:    { referred_user: userId },
      })

      await supabaseAdmin.from('referrals')
        .update({ bonus_amount: bonus, bonus_paid: true, paid_at: new Date().toISOString() })
        .eq('referrer_id', referral.referrer_id)
        .eq('referred_id', userId)
    }

    return NextResponse.json({
      success: true,
      message: `${tier.toUpperCase()} membership activated! ₦${starterReward.toLocaleString()} starter reward added.`,
      tier,
      expiresAt: expiresAt.toISOString(),
    })

  } catch (err) {
    console.error('Payment verify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}