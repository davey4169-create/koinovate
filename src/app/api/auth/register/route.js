// ============================================================
// src/app/api/auth/register/route.js
// ============================================================

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, referralCode } = body

    // ── Validation ───────────────────────────────────────────
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

    // Dynamic imports
    const { supabase, supabaseAdmin } = await import('@/lib/supabase')

    // ── Anti-fraud: check IP ─────────────────────────────────
    const forwarded = request.headers.get('x-forwarded-for') || ''
    const ip = forwarded.split(',')[0]?.trim() || 'unknown'

    if (ip !== 'unknown') {
      const { count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('signup_ip', ip)

      if ((count || 0) >= 3) {
        return NextResponse.json({
          error: 'Too many accounts from this location. Contact support if this is an error.'
        }, { status: 403 })
      }
    }

    // ── Create auth user ─────────────────────────────────────
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:    email.toLowerCase().trim(),
      password,
      options: { data: { full_name: fullName.trim(), phone: phone || '' } },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
    if (!authData?.user) {
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 400 })
    }

    // ── Find referrer ─────────────────────────────────────────
    let referrerId = null
    if (referralCode?.trim()) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()

      if (referrer) referrerId = referrer.id
    }

    // ── Insert user profile ───────────────────────────────────
    await supabaseAdmin.from('users').insert({
      id:          authData.user.id,
      email:       email.toLowerCase().trim(),
      full_name:   fullName.trim(),
      phone:       phone?.trim() || null,
      signup_ip:   ip,
      referred_by: referrerId,
    })

    // ── Log referral ──────────────────────────────────────────
    if (referrerId) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referrerId,
        referred_id: authData.user.id,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Account created! Check your email to verify.',
      userId:  authData.user.id,
    })

  } catch (err) {
    console.error('[register error]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}