// ============================================================
// src/lib/auth.js
// Authentication utilities and helpers
// ============================================================

import { supabaseAdmin } from './supabase'

export async function getUser(req) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  
  if (error || !data?.user) {
    return null
  }

  return data.user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function checkUserRole(userId, requiredRole) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) return false
  return data?.role === requiredRole || data?.role === 'admin'
}

export async function checkUserPlan(userId) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('membership_tier, membership_active, membership_end_date')
    .eq('id', userId)
    .single()

  if (error) return null

  // Check if membership is still active
  if (data.membership_active && data.membership_end_date) {
    const isExpired = new Date(data.membership_end_date) < new Date()
    if (isExpired) {
      // Deactivate membership
      await supabaseAdmin
        .from('users')
        .update({ membership_active: false })
        .eq('id', userId)
      
      return { tier: 'free', active: false }
    }
  }

  return {
    tier: data.membership_tier || 'free',
    active: data.membership_active || false,
  }
}

export async function canAccessFeature(userId, requiredTier = 'free') {
  const plan = await checkUserPlan(userId)
  if (!plan) return false

  const tierHierarchy = { free: 0, pulse: 1, premium: 2 }
  const userLevel = tierHierarchy[plan.tier] || 0
  const requiredLevel = tierHierarchy[requiredTier] || 0

  return userLevel >= requiredLevel
}

export function isValidExternalUrl(url) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    // Only allow http and https
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function logAdminAction(adminId, action, tableName, recordId, oldValues, newValues) {
  await supabaseAdmin.from('admin_logs').insert({
    admin_id: adminId,
    action,
    table_name: tableName,
    record_id: recordId,
    old_values: oldValues || null,
    new_values: newValues || null,
  })
}
