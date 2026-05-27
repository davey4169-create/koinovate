// ============================================================
// src/app/api/admin/plans/route.js
// Admin membership plans management
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
      .from('membership_plans')
      .select('*')
      .order('price', { ascending: true })

    if (error) throw error

    return NextResponse.json({ plans: data })
  } catch (err) {
    console.error('[plans GET error]', err)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
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
    const { name, tier, price, currency, duration_days, description, features } = body

    if (!name || !tier || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('membership_plans')
      .insert({
        name,
        tier,
        price,
        currency: currency || 'NGN',
        duration_days: duration_days || 30,
        description: description || '',
        features: features || [],
      })
      .select()
      .single()

    if (error) throw error

    await logAdminAction(user.id, 'CREATE', 'membership_plans', data.id, null, data)

    return NextResponse.json({ plan: data }, { status: 201 })
  } catch (err) {
    console.error('[plans POST error]', err)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
