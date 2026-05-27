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

      setUser: user => set({ user, isLoggedIn: !!user }),
      setWallet: wallet => set({ wallet }),

      login: async (email, password) => {
        set({ isLoading: true })

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        })

        if (error) {
          set({ isLoading: false })
          return { error: error.message }
        }

        if (!data?.user) {
          set({ isLoading: false })
          return { error: 'Unable to sign in. Please try again.' }
        }

        const userId = data.user.id

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single()

        const hasActivePlan =
          profile?.membership_tier &&
          profile.membership_tier !== 'none' &&
          profile.membership_expires_at &&
          new Date(profile.membership_expires_at) > new Date()

        set({
          user: { ...data.user, ...profile },
          wallet: wallet || null,
          isLoggedIn: true,
          hasActivePlan,
          isLoading: false,
        })

        return { success: true }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({
          user: null,
          wallet: null,
          isLoggedIn: false,
          hasActivePlan: false,
        })
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

      register: async ({ email, password, fullName, phone }) => {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            fullName,
            phone,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { error: data.error || 'Failed to create your account.' }
        }

        return { success: true }
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