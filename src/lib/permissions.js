// ============================================================
// src/lib/permissions.js
// Feature access control based on membership tier
// ============================================================

export const FEATURES = {
  // Basic features (Free)
  VIEW_SURVEYS: 'view_surveys',
  VIEW_TASKS: 'view_tasks',
  VIEW_LEARNING: 'view_learning',

  // Premium features (Pulse)
  AI_TRADING: 'ai_trading',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  ALL_COURSES: 'all_courses',
  CASINO: 'casino',

  // VIP features (Premium)
  PRIORITY_SUPPORT: 'priority_support',
  CUSTOM_SETTINGS: 'custom_settings',
}

export const TIER_FEATURES = {
  free: [
    FEATURES.VIEW_SURVEYS,
    FEATURES.VIEW_TASKS,
    FEATURES.VIEW_LEARNING,
  ],
  pulse: [
    FEATURES.VIEW_SURVEYS,
    FEATURES.VIEW_TASKS,
    FEATURES.VIEW_LEARNING,
    FEATURES.AI_TRADING,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.ALL_COURSES,
    FEATURES.CASINO,
  ],
  premium: [
    FEATURES.VIEW_SURVEYS,
    FEATURES.VIEW_TASKS,
    FEATURES.VIEW_LEARNING,
    FEATURES.AI_TRADING,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.ALL_COURSES,
    FEATURES.CASINO,
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.CUSTOM_SETTINGS,
  ],
}

export function hasFeature(tier, feature) {
  const features = TIER_FEATURES[tier] || TIER_FEATURES.free
  return features.includes(feature)
}

export function getTierLevel(tier) {
  const levels = { free: 0, pulse: 1, premium: 2 }
  return levels[tier] || 0
}

export function canAccess(userTier, requiredTier) {
  return getTierLevel(userTier) >= getTierLevel(requiredTier)
}

export const TIER_NAMES = {
  free: 'Free Plan',
  pulse: 'Pulse Plan',
  premium: 'Premium Plan',
}

export const TIER_DESCRIPTIONS = {
  free: 'Basic access to surveys and tasks',
  pulse: 'Full access to all features including AI Trading',
  premium: 'Complete access with priority support',
}
