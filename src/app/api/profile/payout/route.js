import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { userId, bankName, accountNumber, accountName } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    if (!bankName || !accountNumber || !accountName)
      return NextResponse.json({ error: 'All payout fields are required.' }, { status: 400 })
    if (String(accountNumber).length !== 10)
      return NextResponse.json({ error: 'Account number must be exactly 10 digits.' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        bank_name:      bankName.trim(),
        account_number: String(accountNumber).trim(),
        account_name:   accountName.trim(),
        updated_at:     new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, message: 'Payout details saved.' })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}