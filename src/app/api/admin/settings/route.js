import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all settings
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .order('key')

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Convert to key-value map
    const settings = {}
    data.forEach(s => { settings[s.key] = s.value })

    return NextResponse.json({ success: true, settings, raw: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 })
  }
}

// POST — update a setting (admin only)
export async function POST(request) {
  try {
    const { adminId, key, value } = await request.json()

    // Verify admin
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', adminId)
      .single()

    if (adminError || !admin?.is_admin)
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })

    const { error } = await supabaseAdmin
      .from('site_settings')
      .update({ value: String(value).trim(), updated_by: adminId, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, message: `Setting "${key}" updated.` })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update setting.' }, { status: 500 })
  }
}