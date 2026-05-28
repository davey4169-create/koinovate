// ============================================================
// src/app/api/user/dashboard/route.js
// Get dashboard data for current user
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

    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get wallet or create a safe fallback if missing
    let wallet = null
    const { data: walletData, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError && walletError.code !== 'PGRST116') {
      throw walletError
    }

    if (walletData) {
      wallet = walletData
    } else {
      const { data: createdWallet, error: createWalletError } = await supabaseAdmin
        .from('wallets')
        .insert({
          user_id: user.id,
          balance: 0,
          total_earned: 0,
          total_withdrawn: 0,
        })
        .select()
        .single()

      if (createWalletError) {
        throw createWalletError
      }

      wallet = createdWallet
    }

    // Get completed surveys count
    const { count: completedSurveys } = await supabaseAdmin
      .from('user_surveys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed_at', 'not.is.null')

    // Get completed courses count
    const { count: completedCourses } = await supabaseAdmin
      .from('user_courses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed_at', 'not.is.null')

    // Get completed tasks count
    const { count: completedTasks } = await supabaseAdmin
      .from('user_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed_at', 'not.is.null')

    return NextResponse.json({
      profile: userProfile,
      wallet,
      stats: {
        completedSurveys: completedSurveys || 0,
        completedCourses: completedCourses || 0,
        completedTasks: completedTasks || 0,
      },
    })
  } catch (err) {
    console.error('[dashboard GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
