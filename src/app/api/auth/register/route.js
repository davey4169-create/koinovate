import { NextResponse } from 'next/server'

const STARTER_REWARD = 5000
const REFERRAL_BONUS = 2000

function generateReferralCode() {
  return `KOIN${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, referralCode } = body

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    const { supabaseAdmin } = await import('@/lib/supabase')

    const forwarded = request.headers.get('x-forwarded-for') || ''
    const ip = forwarded.split(',')[0]?.trim() || 'unknown'

    if (ip !== 'unknown') {
      const { count, error: duplicateCountError } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('signup_ip', ip)

      if (duplicateCountError) {
        throw duplicateCountError
      }

      if ((count || 0) >= 3) {
        return NextResponse.json(
          {
            error:
              'Too many accounts from this location. Contact support if this is an error.',
          },
          { status: 403 }
        )
      }
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        phone: phone || '',
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 400 }
      )
    }

    let referrerId = null
    if (referralCode?.trim()) {
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()

      if (referrerError) {
        throw referrerError
      }

      if (referrer) referrerId = referrer.id
    }

    const referralCodeValue = generateReferralCode()
    const userPayload = {
      id: authData.user.id,
      email: email.toLowerCase().trim(),
      full_name: fullName.trim(),
      phone: phone?.trim() || null,
      signup_ip: ip,
      referred_by: referrerId,
      referral_code: referralCodeValue,
      membership_tier: 'free',
      membership_active: false,
      wallet_balance: STARTER_REWARD,
      total_earned: STARTER_REWARD,
    }

    const { error: userError } = await supabaseAdmin.from('users').insert(userPayload)
    if (userError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: userError.message || 'Failed to create user profile.' }, { status: 500 })
    }

    const { error: walletError } = await supabaseAdmin.from('wallets').insert({
      user_id: authData.user.id,
      balance: STARTER_REWARD,
      total_earned: STARTER_REWARD,
      total_withdrawn: 0,
    })

    if (walletError) {
      await supabaseAdmin.from('users').delete().eq('id', authData.user.id)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: walletError.message || 'Failed to create wallet.' }, { status: 500 })
    }

    if (referrerId) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referrerId,
        referred_id: authData.user.id,
        reward_claimed: false,
      })

      const { data: referrerWallet, error: referrerWalletError } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .eq('user_id', referrerId)
        .single()

      if (!referrerWalletError && referrerWallet) {
        await supabaseAdmin
          .from('wallets')
          .update({
            balance: (referrerWallet.balance || 0) + REFERRAL_BONUS,
            total_earned: (referrerWallet.total_earned || 0) + REFERRAL_BONUS,
          })
          .eq('user_id', referrerId)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. You can now sign in.',
      userId: authData.user.id,
    })
  } catch (err) {
    console.error('[register error]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
