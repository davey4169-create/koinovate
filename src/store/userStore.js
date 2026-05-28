// ============================================================
// src/store/userStore.js
// Global user state management with Zustand
// ============================================================

'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      wallet: null,
      isLoading: false,
      isLoggedIn: false,
      hasActivePlan: false,
      token: null,

      setUser: user => set({ user, isLoggedIn: !!user }),
      setWallet: wallet => set({ wallet }),
      setToken: token => set({ token }),

      getToken: async () => {
        const { data, error } = await supabase.auth.getSession()
        if (error) return null
        return data.session?.access_token || null
      },

      login: async (email, password) => {
        set({ isLoading: true })

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        })

        if (error || !data?.user) {
          set({ isLoading: false })
          return { error: error?.message || 'Unable to sign in. Please try again.' }
        }

        const userId = data.user.id

        const [profileResult, walletResult] = await Promise.all([
          supabase.from('users').select('*').eq('id', userId).single(),
          supabase.from('wallets').select('*').eq('user_id', userId).single(),
        ])

        if (profileResult.error) {
          set({ isLoading: false })
          return { error: profileResult.error.message || 'Unable to load profile.' }
        }

        const profile = profileResult.data
        const wallet = walletResult.data || null

        const hasActivePlan =
          profile?.membership_tier &&
          profile.membership_active &&
          (profile.membership_tier === 'pulse' || profile.membership_tier === 'premium')

        set({
          user: profile,
          wallet,
          isLoggedIn: true,
          hasActivePlan,
          isLoading: false,
          token: data.session?.access_token,
        })

        return { success: true, user: profile }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({
          user: null,
          wallet: null,
          isLoggedIn: false,
          hasActivePlan: false,
          token: null,
        })
      },

      register: async ({ email, password, fullName, phone = '', referralCode = '' }) => {
        set({ isLoading: true })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              password,
              fullName: fullName.trim(),
              phone: phone.trim(),
              referralCode: referralCode.trim(),
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ isLoading: false })
            return { error: data.error || 'Registration failed.' }
          }

          set({ isLoading: false })
          return { success: true, userId: data.userId }
        } catch (err) {
          set({ isLoading: false })
          return { error: 'Something went wrong. Please try again.' }
        }
      },

      refreshSession: async () => {
        set({ isLoading: true })

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !sessionData?.session?.user) {
          set({ isLoading: false })
          return null
        }

        const currentUserId = sessionData.session.user.id

        const [profileResult, walletResult] = await Promise.all([
          supabase.from('users').select('*').eq('id', currentUserId).single(),
          supabase.from('wallets').select('*').eq('user_id', currentUserId).single(),
        ])

        if (profileResult.error) {
          set({ isLoading: false })
          return null
        }

        const profile = profileResult.data
        const wallet = walletResult.data || null

        const hasActivePlan =
          profile?.membership_tier &&
          profile.membership_active &&
          (profile.membership_tier === 'pulse' || profile.membership_tier === 'premium')

        set({
          user: profile,
          wallet,
          isLoggedIn: true,
          hasActivePlan,
          isLoading: false,
          token: sessionData.session.access_token,
        })

        return { success: true, user: profile }
      },

      updateProfile: async (updates) => {
        const user = get().user
        if (!user) return { error: 'Not logged in' }

        try {
          const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) throw error

          set({ user: data })
          return { success: true, user: data }
        } catch (err) {
          return { error: err.message }
        }
      },

      refreshWallet: async () => {
        const userId = get().user?.id
        if (!userId) return

        const { data } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (data) set({ wallet: data })
      },

      refreshProfile: async () => {
        set({ isLoading: true })

        const { data: sessionData } = await supabase.auth.getSession()
        const currentUserId =
          sessionData?.session?.user?.id || get().user?.id

        if (!currentUserId) {
          set({ isLoading: false })
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUserId)
          .single()

        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', currentUserId)
          .single()

        const hasActivePlan =
          profile?.membership_tier &&
          profile.membership_tier !== 'none' &&
          profile.membership_expires_at &&
          new Date(profile.membership_expires_at) > new Date()

        set({
          user: { ...get().user, ...profile },
          wallet: wallet || null,
          hasActivePlan,
          isLoggedIn: true,
          isLoading: false,
        })
      },

    }),
    {
      name: 'koinovate-user',
      partialize: state => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        hasActivePlan: state.hasActivePlan,
      }),
    }
  )
)