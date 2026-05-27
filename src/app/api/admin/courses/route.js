// ============================================================
// src/app/api/admin/courses/route.js
// Admin courses management
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
      .from('courses')
      .select('*')
      .order('order_num', { ascending: true })

    if (error) throw error

    return NextResponse.json({ courses: data })
  } catch (err) {
    console.error('[courses GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
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
    const { title, description, content, course_url, redirect_url, thumbnail, min_tier, status, order_num } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        description: description || '',
        content: content || '',
        course_url: course_url || '',
        redirect_url: redirect_url || '',
        thumbnail: thumbnail || '',
        min_tier: min_tier || 'free',
        status: status || 'active',
        order_num: order_num || 0,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'CREATE', 'courses', data.id, null, data)

    return NextResponse.json({ course: data }, { status: 201 })
  } catch (err) {
    console.error('[courses POST error]', err)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
