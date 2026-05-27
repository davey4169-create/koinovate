// ============================================================
// src/lib/wallet.js
// KOINOVATE Wallet Operations — Server-side only
// Use only inside API routes, never in client components
// ============================================================

/**
 * Get a user's wallet record from the database
 * @param {string} userId - The user's UUID
 */
export async function getWallet(userId) {
  // Dynamic import keeps module exports intact even if supabase has issues at build time
  const { supabaseAdmin } = await import('@/lib/supabase')

  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    throw new Error(`Wallet fetch failed: ${error.message}`)
  }

  return data
}

/**
 * Add money to a user's wallet
 * @param {object} params
 * @param {string} params.userId      - User's UUID
 * @param {number} params.amount      - Amount in NGN
 * @param {string} params.walletType  - 'total' | 'revenue_share' | 'ai_trade'
 * @param {string} params.type        - Transaction type label
 * @param {string} params.description - Human readable description
 * @param {object} params.metadata    - Extra data for the transaction log
 */
export async function creditWallet({
  userId,
  amount,
  walletType  = 'total',
  type        = 'credit',
  description = '',
  metadata    = {},
}) {
  const { supabaseAdmin } = await import('@/lib/supabase')

  // Step 1: Get current balance for audit trail
  let balanceBefore = 0
  try {
    const wallet = await getWallet(userId)
    if (walletType === 'total')         balanceBefore = Number(wallet.total_balance         || 0)
    if (walletType === 'revenue_share') balanceBefore = Number(wallet.revenue_share_balance || 0)
    if (walletType === 'ai_trade')      balanceBefore = Number(wallet.ai_trade_balance      || 0)
  } catch (e) {
    balanceBefore = 0
  }

  // Step 2: Credit using the safe SQL function (prevents race conditions)
  const { error: rpcError } = await supabaseAdmin.rpc('credit_wallet', {
    p_user_id:     userId,
    p_amount:      Number(amount),
    p_wallet_type: walletType,
  })

  if (rpcError) {
    throw new Error(`Credit operation failed: ${rpcError.message}`)
  }

  // Step 3: Log the transaction
  const newBalance = balanceBefore + Number(amount)

  const { error: logError } = await supabaseAdmin.from('transactions').insert({
    user_id:        userId,
    type:           type,
    wallet_type:    walletType,
    amount:         Number(amount),
    balance_before: balanceBefore,
    balance_after:  newBalance,
    status:         'completed',
    description:    description,
    metadata:       metadata,
  })

  if (logError) {
    // Log failure is not critical — the credit already happened
    console.error('Transaction log failed (non-critical):', logError.message)
  }

  return { success: true, newBalance }
}

/**
 * Remove money from a user's wallet (with balance check)
 * @param {object} params
 * @param {string} params.userId      - User's UUID
 * @param {number} params.amount      - Amount in NGN
 * @param {string} params.walletType  - 'total' | 'revenue_share' | 'ai_trade'
 * @param {string} params.type        - Transaction type label
 * @param {string} params.description - Human readable description
 * @param {object} params.metadata    - Extra data for the transaction log
 * @returns {{ success: boolean, newBalance?: number, error?: string }}
 */
export async function debitWallet({
  userId,
  amount,
  walletType  = 'total',
  type        = 'debit',
  description = '',
  metadata    = {},
}) {
  const { supabaseAdmin } = await import('@/lib/supabase')

  // Step 1: Check current balance
  const wallet = await getWallet(userId)

  let balanceBefore = 0
  if (walletType === 'total')         balanceBefore = Number(wallet.total_balance         || 0)
  if (walletType === 'revenue_share') balanceBefore = Number(wallet.revenue_share_balance || 0)
  if (walletType === 'ai_trade')      balanceBefore = Number(wallet.ai_trade_balance      || 0)

  // Step 2: Reject if insufficient funds
  if (balanceBefore < Number(amount)) {
    return {
      success: false,
      error:   `Insufficient balance. Available: ₦${balanceBefore.toLocaleString()}`,
    }
  }

  // Step 3: Debit using the safe SQL function
  const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('debit_wallet', {
    p_user_id:     userId,
    p_amount:      Number(amount),
    p_wallet_type: walletType,
  })

  if (rpcError) {
    throw new Error(`Debit operation failed: ${rpcError.message}`)
  }

  if (!rpcResult) {
    return { success: false, error: 'Debit was rejected by the database.' }
  }

  // Step 4: Log the transaction
  const newBalance = balanceBefore - Number(amount)

  await supabaseAdmin.from('transactions').insert({
    user_id:        userId,
    type:           type,
    wallet_type:    walletType,
    amount:         Number(amount),
    balance_before: balanceBefore,
    balance_after:  newBalance,
    status:         'completed',
    description:    description,
    metadata:       metadata,
  })

  return { success: true, newBalance }
}