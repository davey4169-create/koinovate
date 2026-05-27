// ============================================================
// src/app/api/admin/users/route.js
// Admin users management
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser, checkUserRole, logAdminAction } from '@/lib/auth'

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
      .from('users')
      .select('id, email, full_name, role, membership_tier, membership_active, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ users: data })
  } catch (err) {
    console.error('[users GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
