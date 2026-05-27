// ============================================================
// src/app/api/user/courses/available/route.js
// Get courses available to user based on plan
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

    // Get courses user can access
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('status', 'active')
      .or(`min_tier.eq.free,min_tier.eq.${tier},min_tier.eq.premium`)
      .order('order_num', { ascending: true })

    if (error) throw error

    // Get user's completed courses
    const { data: completed } = await supabaseAdmin
      .from('user_courses')
      .select('course_id')
      .eq('user_id', user.id)
      .eq('completed_at', 'not.is.null')

    const completedIds = new Set(completed?.map(c => c.course_id) || [])

    const enrichedCourses = courses.map(course => ({
      ...course,
      completed: completedIds.has(course.id),
    }))

    return NextResponse.json({ courses: enrichedCourses })
  } catch (err) {
    console.error('[courses available error]', err)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
