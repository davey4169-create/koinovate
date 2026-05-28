// ============================================================
// src/app/api/admin/wallet/route.js
// Admin wallet operations (credit / debit)
// ============================================================

import { NextResponse } from 'next/server'
import { creditWallet, debitWallet } from '@/lib/wallet'
import { getUser, checkUserRole, logAdminAction } from '@/lib/auth'

export async function POST(request) {
  try {
    const admin = await getUser(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const isAdmin = await checkUserRole(admin.id, 'admin')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { userId, amount, walletType = 'total', mode = 'credit', description = '' } = body

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 })
    }

    if (mode === 'credit') {
      const result = await creditWallet({ userId, amount: Number(amount), walletType, description, metadata: { admin: admin.id } })
      await logAdminAction(admin.id, 'CREDIT_WALLET', 'wallets', userId, null, { amount: Number(amount), walletType })
      return NextResponse.json({ success: true, result })
    }

    if (mode === 'debit') {
      const result = await debitWallet({ userId, amount: Number(amount), walletType, description, metadata: { admin: admin.id } })
      if (!result.success) return NextResponse.json({ error: result.error || 'Debit failed' }, { status: 400 })
      await logAdminAction(admin.id, 'DEBIT_WALLET', 'wallets', userId, null, { amount: Number(amount), walletType })
      return NextResponse.json({ success: true, result })
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (err) {
    console.error('[admin wallet error]', err)
    return NextResponse.json({ error: 'Failed to perform wallet operation' }, { status: 500 })
  }
}
