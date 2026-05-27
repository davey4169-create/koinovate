// ============================================================
// src/app/api/payments/verify/route.js
// ============================================================

import { NextResponse } from 'next/server'

const TIER_PRICES  = { spark: 8000,  pulse: 15000, momentum: 25000 }
const TIER_REWARDS = { spark: 5000,  pulse: 11000, momentum: 20000  }
const TIER_DAYS    = { spark: 30,    pulse: 30,    momentum: 30     }
const REF_BONUSES  = { spark: 5100,  pulse: 8000,  momentum: 10000  }

export async function POST(request) {
  try {
    const body = await request.json()
    const { reference, gateway, transactionId } = body

    if (!gateway) {
      return NextResponse.json({ error: 'Payment gateway is required.' }, { status: 400 })
    }

    // Dynamic imports to avoid any module-level failures
    const { supabaseAdmin }                        = await import('@/lib/supabase')
    const { verifyPaystack, verifyFlutterwave }    = await import('@/lib/payments')
    const { creditWallet }                         = await import('@/lib/wallet')

    let amountPaid = 0
    let metaData   = {}

    // ── Verify payment with the correct gateway ──────────────
    if (gateway === 'paystack') {
      if (!reference) {
        return NextResponse.json({ error: 'Reference is required for Paystack.' }, { status: 400 })
      }
      const result = await verifyPaystack(reference)
      if (result.status !== 'success') {
        return NextResponse.json({ error: 'Paystack payment was not successful.' }, { status: 400 })
      }
      amountPaid = result.amount / 100 // Convert from kobo to naira
      metaData   = result.metadata || {}

    } else if (gateway === 'flutterwave') {
      if (!transactionId) {
        return NextResponse.json({ error: 'Transaction ID is required for Flutterwave.' }, { status: 400 })
      }
      const result = await verifyFlutterwave(transactionId)
      if (result.status !== 'successful') {
        return NextResponse.json({ error: 'Flutterwave payment was not successful.' }, { status: 400 })
      }
      amountPaid = result.amount
      metaData   = result.meta || {}

    } else {
      return NextResponse.json({ error: 'Invalid payment gateway.' }, { status: 400 })
    }

    const userId = metaData.user_id
    const tier   = metaData.tier

    if (!userId || !tier) {
      return NextResponse.json({ error: 'Invalid payment metadata. Missing user_id or tier.' }, { status: 400 })
    }

    const expectedAmount = TIER_PRICES[tier]
    if (!expectedAmount) {
      return NextResponse.json({ error: 'Invalid membership tier.' }, { status: 400 })
    }

    if (Number(amountPaid) < expectedAmount) {
      return NextResponse.json({
        error: `Paid amount (₦${amountPaid}) is less than required (₦${expectedAmount}).`
      }, { status: 400 })
    }

    // ── Idempotency: prevent double processing ───────────────
    const gatewayRef = reference || String(transactionId)
    const { data: existingTx } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('gateway_ref', gatewayRef)
      .maybeSingle()

    if (existingTx) {
      return NextResponse.json({ success: true, message: 'Payment already processed.' })
    }

    // ── Activate membership ──────────────────────────────────
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + TIER_DAYS[tier])

    await supabaseAdmin
      .from('users')
      .update({
        membership_tier:       tier,
        membership_expires_at: expiresAt.toISOString(),
        updated_at:            new Date().toISOString(),
      })
      .eq('id', userId)

    // ── Record membership ────────────────────────────────────
    await supabaseAdmin.from('memberships').insert({
      user_id:           userId,
      tier,
      amount_paid:       amountPaid,
      payment_reference: gatewayRef,
      payment_gateway:   gateway,
      expires_at:        expiresAt.toISOString(),
    })

    // ── Log payment transaction ──────────────────────────────
    await supabaseAdmin.from('transactions').insert({
      user_id:     userId,
      type:        'membership_payment',
      amount:      amountPaid,
      status:      'completed',
      description: `${tier.toUpperCase()} membership activated`,
      gateway:     gateway,
      gateway_ref: gatewayRef,
    })

    // ── Credit starter reward ────────────────────────────────
    const starterReward = TIER_REWARDS[tier]
    await creditWallet({
      userId,
      amount:      starterReward,
      walletType:  'total',
      type:        'starter_reward',
      description: `${tier.toUpperCase()} starter reward`,
      metadata:    { tier },
    })

    // ── Credit referral bonus if applicable ─────────────────
    const { data: referral } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id')
      .eq('referred_id', userId)
      .eq('bonus_paid', false)
      .maybeSingle()

    if (referral?.referrer_id) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('membership_tier')
        .eq('id', referral.referrer_id)
        .maybeSingle()

      const referrerTier = referrer?.membership_tier || 'spark'
      const bonusAmount  = REF_BONUSES[referrerTier]  || 5100

      await creditWallet({
        userId:      referral.referrer_id,
        amount:      bonusAmount,
        walletType:  'revenue_share',
        type:        'referral_bonus',
        description: `Referral bonus — ${tier} member joined`,
        metadata:    { referred_user: userId },
      })

      await supabaseAdmin
        .from('referrals')
        .update({ bonus_amount: bonusAmount, bonus_paid: true, paid_at: new Date().toISOString() })
        .eq('referrer_id', referral.referrer_id)
        .eq('referred_id', userId)
    }

    return NextResponse.json({
      success:   true,
      message:   `${tier.toUpperCase()} membership activated! ₦${starterReward.toLocaleString()} starter reward added to your wallet.`,
      tier,
      expiresAt: expiresAt.toISOString(),
    })

  } catch (err) {
    console.error('[verify payment error]', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}