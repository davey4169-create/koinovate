// ============================================================
// src/app/api/admin/users/[id]/route.js
// Admin user detail operations
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser, checkUserRole, logAdminAction } from '@/lib/auth'

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
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('[user GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
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
    const { role, membership_tier, membership_active, membership_end_date } = body

    // Get old values
    const { data: oldData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    const updateData = {}
    if (role !== undefined) updateData.role = role
    if (membership_tier !== undefined) updateData.membership_tier = membership_tier
    if (membership_active !== undefined) updateData.membership_active = membership_active
    if (membership_end_date !== undefined) updateData.membership_end_date = membership_end_date

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'UPDATE', 'users', params.id, oldData, data)

    return NextResponse.json({ user: data })
  } catch (err) {
    console.error('[user PUT error]', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
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
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(params.id)
    if (authError) throw authError

    await logAdminAction(user.id, 'DELETE', 'users', params.id, oldData, null)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[user DELETE error]', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
