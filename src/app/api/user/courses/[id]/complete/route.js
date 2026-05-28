// ============================================================
// src/app/api/user/courses/[id]/complete/route.js
// Mark course as completed
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Check if course exists
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { data: existingCourse } = await supabaseAdmin
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existingCourse?.completed_at) {
      return NextResponse.json({ success: true, completion: existingCourse })
    }

    const { data, error } = existingCourse
      ? await supabaseAdmin
          .from('user_courses')
          .update({ progress: 100, completed_at: new Date().toISOString() })
          .eq('id', existingCourse.id)
          .select()
          .single()
      : await supabaseAdmin
          .from('user_courses')
          .insert({
            user_id: user.id,
            course_id: courseId,
            progress: 100,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single()

    if (error) throw error

    return NextResponse.json({ success: true, completion: data })
  } catch (err) {
    console.error('[course complete error]', err)
    return NextResponse.json({ error: 'Failed to complete course' }, { status: 500 })
  }
}
