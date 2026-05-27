// ============================================================
// src/app/api/admin/tasks/[id]/route.js
// Admin task detail operations
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
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task: data })
  } catch (err) {
    console.error('[task GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
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
    const { title, description, reward, task_url, redirect_url, min_tier, status, frequency } = body

    if (redirect_url && !isValidExternalUrl(redirect_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    // Get old values
    const { data: oldData } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (reward !== undefined) updateData.reward = reward
    if (task_url !== undefined) updateData.task_url = task_url
    if (redirect_url !== undefined) updateData.redirect_url = redirect_url
    if (min_tier !== undefined) updateData.min_tier = min_tier
    if (status !== undefined) updateData.status = status
    if (frequency !== undefined) updateData.frequency = frequency

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'UPDATE', 'tasks', params.id, oldData, data)

    return NextResponse.json({ task: data })
  } catch (err) {
    console.error('[task PUT error]', err)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
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
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(user.id, 'DELETE', 'tasks', params.id, oldData, null)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[task DELETE error]', err)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
