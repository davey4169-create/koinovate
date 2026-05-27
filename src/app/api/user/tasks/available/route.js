// ============================================================
// src/app/api/user/tasks/available/route.js
// Get tasks available to user based on plan
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's plan
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('membership_tier')
      .eq('id', user.id)
      .single()

    const tier = userProfile?.membership_tier || 'free'

    // Get tasks user can access
    const { data: tasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .or(`min_tier.eq.free,min_tier.eq.${tier},min_tier.eq.premium`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get user's completed tasks (for today if daily)
    const today = new Date().toISOString().split('T')[0]
    const { data: completed } = await supabaseAdmin
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', user.id)
      .gte('created_at', today)

    const completedIds = new Set(completed?.map(c => c.task_id) || [])

    const enrichedTasks = tasks.map(task => ({
      ...task,
      completed: completedIds.has(task.id),
    }))

    return NextResponse.json({ tasks: enrichedTasks })
  } catch (err) {
    console.error('[tasks available error]', err)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}
