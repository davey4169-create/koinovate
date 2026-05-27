// ============================================================
// src/app/api/user/profile/route.js
// Get current user profile
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    // Get wallet
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({ user: data, wallet })
  } catch (err) {
    console.error('[profile GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
