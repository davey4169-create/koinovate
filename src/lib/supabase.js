// ============================================================
// src/lib/supabase.js
// Supabase clients — safe for both build time and runtime
// ============================================================

import { createClient } from '@supabase/supabase-js'

// Safe fallbacks for build time.
// During `npm run build`, env vars may not be available.
// Placeholder strings prevent module initialization from throwing.
// At RUNTIME on Vercel, the real environment variables are used.
const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || 'placeholder-anon-key'
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY       || 'placeholder-service-key'

// Client-side Supabase (uses anon key + Row Level Security)
// Safe to use in components and client-side code
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
  },
})

// Server-side Supabase (bypasses RLS — use only in API routes)
// NEVER import this in client components
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
})