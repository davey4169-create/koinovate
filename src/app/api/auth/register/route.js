import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email, password, fullName, phone, referralCode } = await request.json()

    // Validate
    if (!email || !password || !fullName)
      return NextResponse.json({ error: 'Email, password and name are required.' }, { status: 400 })
    if (password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    // Get request IP for anti-fraud
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Anti-multi-account: check how many accounts from this IP
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('signup_ip', ip)

    if (count >= 3) {
      return NextResponse.json({
        error: 'Multiple account creation from this location detected. Contact support if this is an error.'
      }, { status: 403 })
    }

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    })

    if (authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })

    // Find referrer
    let referrerId = null
    if (referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.toUpperCase())
        .single()
      if (referrer) referrerId = referrer.id
    }

    // Insert into users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id:          authData.user.id,
        email:       email.toLowerCase().trim(),
        full_name:   fullName,
        phone:       phone || null,
        signup_ip:   ip,
        referred_by: referrerId,
      })

    if (userError)
      return NextResponse.json({ error: userError.message }, { status: 400 })

    // If referred, log the referral
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
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}