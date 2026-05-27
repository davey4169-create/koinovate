import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { userId, username, phone } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    if (!username || username.trim().length < 2)
      return NextResponse.json({ error: 'Username must be at least 2 characters.' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('users')
      .update({ full_name: username.trim(), phone: phone || null, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, message: 'Profile updated successfully.' })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}