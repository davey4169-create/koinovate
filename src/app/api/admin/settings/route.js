// ============================================================
// src/app/api/admin/settings/route.js
// ============================================================

import { NextResponse } from 'next/server'

const DEFAULT_SETTINGS = {
  telegram_handle:   '@koinovate_official',
  support_email:     'koinovate0@gmail.com',
  whatsapp_number:   '',
  site_announcement: '',
  maintenance_mode:  'false',
}

export async function GET() {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value, label, description, updated_at')
      .order('key')

    if (error) {
      // Table may not be created yet — return defaults silently
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS, raw: [] })
    }

    const settings = { ...DEFAULT_SETTINGS }
    if (data) {
      data.forEach(s => { settings[s.key] = s.value })
    }

    return NextResponse.json({ success: true, settings, raw: data || [] })

  } catch (err) {
    // Never crash — always return usable defaults
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS, raw: [] })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { adminId, key, value } = body

    if (!adminId || !key) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { supabaseAdmin } = await import('@/lib/supabase')

    const { data: admin } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', adminId)
      .maybeSingle()

    if (!admin?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('site_settings')
      .update({
        value:      String(value ?? '').trim(),
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: `Setting "${key}" updated.` })

  } catch (err) {
    console.error('[admin settings error]', err)
    return NextResponse.json({ error: 'Failed to update setting.' }, { status: 500 })
  }
}