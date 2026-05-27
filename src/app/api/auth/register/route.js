import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, referralCode } = body

    // ── Validation ────────────────────────────────────────────
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // ── Anti-fraud: check IP for multiple accounts ─────────────
    const forwardedFor = request.headers.get('x-forwarded-for') || ''
    const ip = forwardedFor.split(',')[0]?.trim() || 'unknown'

    if (ip !== 'unknown') {
      const { count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('signup_ip', ip)

      if ((count || 0) >= 3) {
        return NextResponse.json({
          error: 'Multiple account creation from this location has been detected. Please contact support if this is an error.',
        }, { status: 403 })
      }
    }

    // ── Create Supabase auth user ─────────────────────────────
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:    email.toLowerCase().trim(),
      password,
      options: { data: { full_name: fullName, phone: phone || '' } },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
    if (!authData?.user) {
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 400 })
    }

    // ── Find referrer ─────────────────────────────────────────
    let referrerId = null
    if (referralCode && referralCode.trim()) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()

      if (referrer) referrerId = referrer.id
    }

    // ── Insert user profile ───────────────────────────────────
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id:          authData.user.id,
        email:       email.toLowerCase().trim(),
        full_name:   fullName.trim(),
        phone:       phone?.trim() || null,
        signup_ip:   ip,
        referred_by: referrerId,
      })

    if (insertError) {
      console.error('Profile insert error:', insertError.message)
      // Don't fail — auth user was created, profile will sync
    }

    // ── Log referral ──────────────────────────────────────────
    if (referrerId) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referrerId,
        referred_id: authData.user.id,
      }).maybeSingle()
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      userId:  authData.user.id,
    })

  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}