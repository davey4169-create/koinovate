import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getWallet, debitWallet } from '@/lib/wallet'

const MIN_PAYOUT = 5000

export async function POST(request) {
  try {
    const { userId, amount, bankName, accountNumber, accountName } = await request.json()

    if (!userId || !amount || !bankName || !accountNumber || !accountName)
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })

    if (amount < MIN_PAYOUT)
      return NextResponse.json({ error: `Minimum withdrawal is ₦${MIN_PAYOUT.toLocaleString()}.` }, { status: 400 })

    if (accountNumber.length !== 10)
      return NextResponse.json({ error: 'Account number must be exactly 10 digits.' }, { status: 400 })

    // Check user membership for withdrawal frequency
    const { data: user } = await supabaseAdmin.from('users').select('membership_tier, membership_expires_at').eq('id', userId).single()

    if (!user || user.membership_tier === 'none')
      return NextResponse.json({ error: 'You need an active membership to withdraw.' }, { status: 403 })

    // Check if membership is still active
    if (user.membership_expires_at && new Date(user.membership_expires_at) < new Date())
      return NextResponse.json({ error: 'Your membership has expired. Please renew to withdraw.' }, { status: 403 })

    // Check recent payout requests
    const { data: recentPayout } = await supabaseAdmin
      .from('payout_requests')
      .select('created_at')
      .eq('user_id', userId)
      .in('status', ['pending','under_review','processing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentPayout)
      return NextResponse.json({ error: 'You already have a pending withdrawal request. Please wait for it to be processed.' }, { status: 400 })

    // Verify sufficient balance
    const wallet = await getWallet(userId)
    if (wallet.total_balance < amount)
      return NextResponse.json({ error: 'Insufficient wallet balance.' }, { status: 400 })

    // Debit the wallet (hold the funds)
    const result = await debitWallet({
      userId,
      amount,
      walletType:  'total',
      type:        'withdrawal',
      description: `Withdrawal to ${bankName} - ${accountNumber}`,
    })

    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 400 })

    // Create payout request
    await supabaseAdmin.from('payout_requests').insert({
      user_id:        userId,
      amount,
      bank_name:      bankName,
      account_number: accountNumber,
      account_name:   accountName,
    })

    return NextResponse.json({
      success: true,
      message: `Withdrawal of ₦${amount.toLocaleString()} submitted. Processing time: ${
        user.membership_tier === 'momentum' ? '7 days' :
        user.membership_tier === 'pulse'    ? '14 days' : '30 days'
      }.`,
    })

  } catch (err) {
    console.error('Payout error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}