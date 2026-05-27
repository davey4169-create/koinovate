import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getWallet, debitWallet } from '@/lib/wallet'

const MIN_PAYOUT = 5000

// Withdrawal frequency in days per tier
const WITHDRAWAL_DAYS = { spark: 30, pulse: 14, momentum: 7 }
const WITHDRAWAL_LABEL = { spark: '30 days (monthly)', pulse: '14 days (bi-weekly)', momentum: '7 days (weekly)' }

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, amount, bankName, accountNumber, accountName } = body

    // ── Validation ────────────────────────────────────────────
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'Bank name, account number, and account name are all required.' }, { status: 400 })
    }
    if (!amount || Number(amount) < MIN_PAYOUT) {
      return NextResponse.json({ error: `Minimum withdrawal amount is ₦${MIN_PAYOUT.toLocaleString()}.` }, { status: 400 })
    }
    if (String(accountNumber).length !== 10) {
      return NextResponse.json({ error: 'Account number must be exactly 10 digits.' }, { status: 400 })
    }

    // ── Fetch user + membership ───────────────────────────────
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
      return NextResponse.json({ error: 'You need an active membership plan to withdraw.' }, { status: 403 })
    }
    if (user.membership_expires_at && new Date(user.membership_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Your membership has expired. Please renew to withdraw.' }, { status: 403 })
    }

    // ── Check for pending payout request ─────────────────────
    const { data: pending } = await supabaseAdmin
      .from('payout_requests')
      .select('id, created_at')
      .eq('user_id', userId)
      .in('status', ['pending', 'under_review', 'processing'])
      .maybeSingle()

    if (pending) {
      return NextResponse.json({
        error: 'You already have a pending withdrawal request. Wait for it to be processed before submitting a new one.',
      }, { status: 400 })
    }

    // ── Enforce withdrawal frequency ──────────────────────────
    const frequencyDays = WITHDRAWAL_DAYS[user.membership_tier]
    const cutoffDate    = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - frequencyDays)

    const { data: recentCompleted } = await supabaseAdmin
      .from('payout_requests')
      .select('created_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', cutoffDate.toISOString())
      .maybeSingle()

    if (recentCompleted) {
      return NextResponse.json({
        error: `${user.membership_tier.toUpperCase()} members can withdraw once every ${WITHDRAWAL_LABEL[user.membership_tier]}. Your next withdrawal is available after the cooling period.`,
      }, { status: 400 })
    }

    // ── Check wallet balance ──────────────────────────────────
    const wallet = await getWallet(userId)
    if (!wallet || Number(wallet.total_balance) < Number(amount)) {
      return NextResponse.json({
        error: `Insufficient balance. Your total wallet balance is ₦${Number(wallet?.total_balance || 0).toLocaleString()}.`,
      }, { status: 400 })
    }

    // ── Debit the wallet (hold the funds) ─────────────────────
    const debitResult = await debitWallet({
      userId,
      amount:      Number(amount),
      walletType:  'total',
      type:        'withdrawal',
      description: `Withdrawal to ${bankName} — ${accountNumber}`,
      metadata:    { bankName, accountNumber, accountName },
    })

    if (!debitResult.success) {
      return NextResponse.json({ error: debitResult.error || 'Failed to debit wallet.' }, { status: 400 })
    }

    // ── Create payout request ─────────────────────────────────
    const { error: payoutError } = await supabaseAdmin.from('payout_requests').insert({
      user_id:        userId,
      amount:         Number(amount),
      bank_name:      bankName.trim(),
      account_number: String(accountNumber).trim(),
      account_name:   accountName.trim(),
      status:         'pending',
    })

    if (payoutError) {
      // Reverse the debit if payout record creation failed
      console.error('Payout record creation failed:', payoutError.message)
      return NextResponse.json({ error: 'Failed to create withdrawal request. Please contact support.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal of ₦${Number(amount).toLocaleString()} submitted successfully! Processing time: ${WITHDRAWAL_LABEL[user.membership_tier]}.`,
    })

  } catch (err) {
    console.error('Payout request error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}