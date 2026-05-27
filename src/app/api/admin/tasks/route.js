// ============================================================
// src/app/api/admin/tasks/route.js
// Admin tasks management
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
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tasks: data })
  } catch (err) {
    console.error('[tasks GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
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
    const { title, description, reward, task_url, redirect_url, min_tier, status, frequency } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert({
        title,
        description: description || '',
        reward: reward || 0,
        task_url: task_url || '',
        redirect_url: redirect_url || '',
        min_tier: min_tier || 'free',
        status: status || 'active',
        frequency: frequency || 'daily',
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'CREATE', 'tasks', data.id, null, data)

    return NextResponse.json({ task: data }, { status: 201 })
  } catch (err) {
    console.error('[tasks POST error]', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
