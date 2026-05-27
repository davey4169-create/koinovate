// ============================================================
// src/app/api/user/surveys/available/route.js
// Get surveys available to user based on plan
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser, canAccessFeature } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's plan
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('membership_tier')
      .eq('id', user.id)
      .single()

    const tier = userProfile?.membership_tier || 'free'

    // Get surveys user can access
    const { data: surveys, error } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .eq('status', 'active')
      .or(`min_tier.eq.free,min_tier.eq.${tier},min_tier.eq.premium`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get user's completed surveys
    const { data: completed } = await supabaseAdmin
      .from('user_surveys')
      .select('survey_id')
      .eq('user_id', user.id)
      .eq('completed_at', 'not.is.null')

    const completedIds = new Set(completed?.map(c => c.survey_id) || [])

    const enrichedSurveys = surveys.map(survey => ({
      ...survey,
      completed: completedIds.has(survey.id),
    }))

    return NextResponse.json({ surveys: enrichedSurveys })
  } catch (err) {
    console.error('[surveys available error]', err)
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
  }
}
