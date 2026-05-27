import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value, label, description, updated_at')
      .order('key')

    if (error) {
      // If table doesn't exist yet, return defaults
      return NextResponse.json({
        success: true,
        settings: {
          telegram_handle:   '@koinovate_official',
          support_email:     'koinovate0@gmail.com',
          whatsapp_number:   '',
          site_announcement: '',
          maintenance_mode:  'false',
        },
        raw: [],
      })
    }

    const settings = {}
    data.forEach(s => { settings[s.key] = s.value })

    return NextResponse.json({ success: true, settings, raw: data })

  } catch (err) {
    // Return defaults if anything goes wrong (e.g. table not set up yet)
    return NextResponse.json({
      success: true,
      settings: {
        telegram_handle:   '@koinovate_official',
        support_email:     'koinovate0@gmail.com',
        site_announcement: '',
        maintenance_mode:  'false',
      },
      raw: [],
    })
  }
}

export async function POST(request) {
  try {
    const { adminId, key, value } = await request.json()

    if (!adminId || !key) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { data: admin } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', adminId)
      .maybeSingle()

    if (!admin?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('site_settings')
      .update({
        value:      String(value ?? '').trim(),
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, message: `Setting "${key}" updated successfully.` })

  } catch (err) {
    return NextResponse.json({ error: 'Failed to update setting.' }, { status: 500 })
  }
}