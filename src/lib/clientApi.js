// ============================================================
// src/lib/clientApi.js
// Lightweight client-side fetch wrapper that attaches Supabase auth token
// ============================================================

import { supabase } from '@/lib/supabase'

export async function authFetch(input, init = {}) {
  // Ensure headers object exists
  const headers = init.headers ? { ...init.headers } : {}

  try {
    const { data } = await supabase.auth.getSession()
    const token = data?.session?.access_token
    if (token) headers['Authorization'] = `Bearer ${token}`
  } catch (e) {
    // ignore — proceed without auth header
  }

  return fetch(input, { ...init, headers })
}

export default authFetch
