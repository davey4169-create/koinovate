// ============================================================
// src/app/api/admin/surveys/route.js
// Admin surveys management
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser, checkUserRole, isValidExternalUrl, logAdminAction } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkUserRole(user.id, 'admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ surveys: data })
  } catch (err) {
    console.error('[surveys GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkUserRole(user.id, 'admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, reward, min_tier, status, survey_url, redirect_url } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .insert({
        title,
        description: description || '',
        reward: reward || 0,
        min_tier: min_tier || 'free',
        status: status || 'active',
        survey_url: survey_url || '',
        redirect_url: redirect_url || '',
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'CREATE', 'surveys', data.id, null, data)

    return NextResponse.json({ survey: data }, { status: 201 })
  } catch (err) {
    console.error('[surveys POST error]', err)
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 })
  }
}
