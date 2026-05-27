// ============================================================
// src/app/api/admin/surveys/[id]/route.js
// Admin survey detail operations
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser, checkUserRole, isValidExternalUrl, logAdminAction } from '@/lib/auth'

export async function GET(request, { params }) {
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
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    return NextResponse.json({ survey: data })
  } catch (err) {
    console.error('[survey GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
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

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    // Get old values
    const { data: oldData } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .eq('id', params.id)
      .single()

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (reward !== undefined) updateData.reward = reward
    if (min_tier !== undefined) updateData.min_tier = min_tier
    if (status !== undefined) updateData.status = status
    if (survey_url !== undefined) updateData.survey_url = survey_url
    if (redirect_url !== undefined) updateData.redirect_url = redirect_url

    const { data, error } = await supabaseAdmin
      .from('surveys')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'UPDATE', 'surveys', params.id, oldData, data)

    return NextResponse.json({ survey: data })
  } catch (err) {
    console.error('[survey PUT error]', err)
    return NextResponse.json({ error: 'Failed to update survey' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkUserRole(user.id, 'admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: oldData } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .eq('id', params.id)
      .single()

    const { error } = await supabaseAdmin
      .from('surveys')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(user.id, 'DELETE', 'surveys', params.id, oldData, null)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[survey DELETE error]', err)
    return NextResponse.json({ error: 'Failed to delete survey' }, { status: 500 })
  }
}
