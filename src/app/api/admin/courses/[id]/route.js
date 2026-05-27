// ============================================================
// src/app/api/admin/courses/[id]/route.js
// Admin course detail operations
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
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course: data })
  } catch (err) {
    console.error('[course GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
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
    const { title, description, content, course_url, redirect_url, thumbnail, min_tier, status, order_num } = body

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    // Get old values
    const { data: oldData } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single()

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (course_url !== undefined) updateData.course_url = course_url
    if (redirect_url !== undefined) updateData.redirect_url = redirect_url
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (min_tier !== undefined) updateData.min_tier = min_tier
    if (status !== undefined) updateData.status = status
    if (order_num !== undefined) updateData.order_num = order_num

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'UPDATE', 'courses', params.id, oldData, data)

    return NextResponse.json({ course: data })
  } catch (err) {
    console.error('[course PUT error]', err)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
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
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single()

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(user.id, 'DELETE', 'courses', params.id, oldData, null)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[course DELETE error]', err)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
