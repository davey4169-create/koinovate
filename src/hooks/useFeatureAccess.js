// ============================================================
// src/hooks/useFeatureAccess.js
// Hook to check if user can access a feature
// ============================================================

'use client'
import { useUserStore } from '@/store/userStore'
import { hasFeature, canAccess } from '@/lib/permissions'

export function useFeatureAccess(feature) {
  const user = useUserStore(state => state.user)
  const tier = user?.membership_tier || 'free'
  
  return hasFeature(tier, feature)
}

export function useTierAccess(requiredTier) {
  const user = useUserStore(state => state.user)
  const tier = user?.membership_tier || 'free'
  
  return canAccess(tier, requiredTier)
}

export function useCanAccess(requiredTier = 'free') {
  const user = useUserStore(state => state.user)
  const hasActivePlan = useUserStore(state => state.hasActivePlan)
  
  if (requiredTier === 'free') {
    return true
  }
  
  return hasActivePlan
}
