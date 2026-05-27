// ============================================================
// src/app/api/payout/request/route.js
// ============================================================

import { NextResponse } from 'next/server'

const MIN_PAYOUT       = 5000
const WITHDRAWAL_DAYS  = { spark: 30,            pulse: 14,         momentum: 7          }
const WITHDRAWAL_LABEL = { spark: '30 days',      pulse: '14 days',  momentum: '7 days'   }

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, amount, bankName, accountNumber, accountName } = body

    // ── Validation ───────────────────────────────────────────
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json({
        error: 'Bank name, account number, and account name are all required.'
      }, { status: 400 })
    }
    if (!amount || Number(amount) < MIN_PAYOUT) {
      return NextResponse.json({
        error: `Minimum withdrawal is ₦${MIN_PAYOUT.toLocaleString()}.`
      }, { status: 400 })
    }
    if (String(accountNumber).replace(/\s/g, '').length !== 10) {
      return NextResponse.json({
        error: 'Account number must be exactly 10 digits.'
      }, { status: 400 })
    }

    // Dynamic imports
    const { supabaseAdmin } = await import('@/lib/supabase')
    const { getWallet, debitWallet } = await import('@/lib/wallet')

    // ── Fetch user ───────────────────────────────────────────
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('membership_tier, membership_expires_at, is_suspended')
      .eq('id', userId)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }
    if (user.is_suspended) {
      return NextResponse.json({ error: 'Your account is suspended. Contact support.' }, { status: 403 })
    }
    if (!user.membership_tier || user.membership_tier === 'none') {
      return NextResponse.json({ error: 'You need an active membership to withdraw.' }, { status: 403 })
    }
    if (user.membership_expires_at && new Date(user.membership_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Your membership has expired. Renew to withdraw.' }, { status: 403 })
    }

    // ── Check for existing pending request ───────────────────
    const { data: pending } = await supabaseAdmin
      .from('payout_requests')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['pending', 'under_review', 'processing'])
      .maybeSingle()

    if (pending) {
      return NextResponse.json({
        error: 'You already have a pending withdrawal. Wait for it to complete before submitting a new one.'
      }, { status: 400 })
    }

    // ── Withdrawal frequency check ───────────────────────────
    const tier          = user.membership_tier
    const freqDays      = WITHDRAWAL_DAYS[tier] || 30
    const cutoff        = new Date()
    cutoff.setDate(cutoff.getDate() - freqDays)

    const { data: recent } = await supabaseAdmin
      .from('payout_requests')
      .select('created_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', cutoff.toISOString())
      .maybeSingle()

    if (recent) {
      return NextResponse.json({
        error: `${tier.toUpperCase()} members can withdraw once every ${WITHDRAWAL_LABEL[tier]}. Please wait until your cooling period ends.`
      }, { status: 400 })
    }

    // ── Check wallet balance ─────────────────────────────────
    const wallet = await getWallet(userId)
    const available = Number(wallet?.total_balance || 0)

    if (available < Number(amount)) {
      return NextResponse.json({
        error: `Insufficient balance. Your total wallet is ₦${available.toLocaleString()}.`
      }, { status: 400 })
    }

    // ── Debit the wallet (hold the funds) ────────────────────
    const debitResult = await debitWallet({
      userId,
      amount:      Number(amount),
      walletType:  'total',
      type:        'withdrawal',
      description: `Withdrawal to ${bankName} — ${accountNumber}`,
      metadata:    { bankName, accountNumber, accountName },
    })

    if (!debitResult.success) {
      return NextResponse.json({ error: debitResult.error || 'Wallet debit failed.' }, { status: 400 })
    }

    // ── Create payout request record ─────────────────────────
    const { error: insertError } = await supabaseAdmin.from('payout_requests').insert({
      user_id:        userId,
      amount:         Number(amount),
      bank_name:      bankName.trim(),
      account_number: String(accountNumber).trim(),
      account_name:   accountName.trim(),
      status:         'pending',
    })

    if (insertError) {
      console.error('Payout insert error:', insertError.message)
      return NextResponse.json({ error: 'Failed to create withdrawal record. Contact support.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal of ₦${Number(amount).toLocaleString()} submitted! Processing time: ${WITHDRAWAL_LABEL[tier]}.`,
    })

  } catch (err) {
    console.error('[payout request error]', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}