import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user:        null,
      wallet:      null,
      isLoading:   false,
      isLoggedIn:  false,
      hasActivePlan: false,

      setUser:   user   => set({ user,   isLoggedIn: !!user }),
      setWallet: wallet => set({ wallet }),

      login: async (email, password) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { set({ isLoading: false }); return { error: error.message } }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        // Fetch wallet
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', data.user.id)
          .single()

        const hasActivePlan = profile?.membership_tier !== 'none' &&
          profile?.membership_expires_at &&
          new Date(profile.membership_expires_at) > new Date()

        set({
          user:          { ...data.user, ...profile },
          wallet:        wallet || null,
          isLoggedIn:    true,
          hasActivePlan,
          isLoading:     false,
        })
        return { success: true }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, wallet: null, isLoggedIn: false, hasActivePlan: false })
      },

      refreshWallet: async () => {
        const userId = get().user?.id
        if (!userId) return
        const { data } = await supabase.from('wallets').select('*').eq('user_id', userId).single()
        if (data) set({ wallet: data })
      },
    }),
    {
      name:    'koinovate-user',
      partialize: state => ({
        user:          state.user,
        isLoggedIn:    state.isLoggedIn,
        hasActivePlan: state.hasActivePlan,
      }),
    }
  )
)