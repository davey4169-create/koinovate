// ============================================================
// src/app/api/user/surveys/[id]/complete/route.js
// Mark survey as completed
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const surveyId = params.id

    // Check if survey exists
    const { data: survey } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single()

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    const { data: existingSurvey } = await supabaseAdmin
      .from('user_surveys')
      .select('*')
      .eq('user_id', user.id)
      .eq('survey_id', surveyId)
      .single()

    if (existingSurvey?.completed_at) {
      return NextResponse.json({ success: true, completion: existingSurvey })
    }

    const { data, error } = await supabaseAdmin
      .from('user_surveys')
      .upsert({
        user_id: user.id,
        survey_id: surveyId,
        completed_at: new Date().toISOString(),
      }, { onConflict: ['user_id', 'survey_id'] })
      .select()
      .single()

    if (error) throw error

    // Add reward to wallet only once
    if (survey.reward > 0) {
      const { data: wallet } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (wallet) {
        await supabaseAdmin
          .from('wallets')
          .update({
            balance: (wallet.balance || 0) + survey.reward,
            total_earned: (wallet.total_earned || 0) + survey.reward,
          })
          .eq('user_id', user.id)
      }
    }

    return NextResponse.json({ success: true, completion: data })
  } catch (err) {
    console.error('[survey complete error]', err)
    return NextResponse.json({ error: 'Failed to complete survey' }, { status: 500 })
  }
}
