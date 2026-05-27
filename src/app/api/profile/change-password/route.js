import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { newPassword } = await request.json()

    if (!newPassword || newPassword.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    // Supabase handles password change for the authenticated user
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}