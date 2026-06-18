/**
 * Application Constants
 */

// ============================================
// Subscription Tiers
// ============================================

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
} as const;

export const TIER_PRICES = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.GOLD]: 49900, // ₹499 in paise
  [SUBSCRIPTION_TIERS.PLATINUM]: 99900, // ₹999
  [SUBSCRIPTION_TIERS.DIAMOND]: 249900, // ₹2499
} as const;

export const TIER_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    matchesPerDay: 5,
    messagesPerDay: 3,
    likeLimit: 5,
  },
  [SUBSCRIPTION_TIERS.GOLD]: {
    matchesPerDay: 20,
    messagesPerDay: 50,
    likeLimit: 50,
  },
  [SUBSCRIPTION_TIERS.PLATINUM]: {
    matchesPerDay: 50,
    messagesPerDay: -1, // Unlimited
    likeLimit: -1,
  },
  [SUBSCRIPTION_TIERS.DIAMOND]: {
    matchesPerDay: -1, // Unlimited
    messagesPerDay: -1,
    likeLimit: -1,
  },
} as const;

// ============================================
// Verification
// ============================================

export const ID_TYPES = {
  AADHAAR: 'aadhaar',
  PAN: 'pan',
  PASSPORT: 'passport',
  DRIVING_LICENSE: 'driving_license',
} as const;

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// ============================================
// Matching
// ============================================

export const MATCH_ACTIONS = {
  LIKE: 'like',
  PASS: 'pass',
  REPORT: 'report',
} as const;

export const COMPATIBILITY_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0,
} as const;

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================
// Timeouts & Delays
// ============================================

export const OTP_VALIDITY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const TOKEN_REFRESH_THRESHOLD_MINUTES = 5;

// ============================================
// Feature Flags
// ============================================

export function getFeatureFlag(flag: string): boolean {
  const flagMap = {
    AI_MATCHING: process.env.FEATURE_AI_MATCHING === 'true',
    VIDEO_CALLS: process.env.FEATURE_VIDEO_CALLS === 'true',
    FAMILY_ACCOUNTS: process.env.FEATURE_FAMILY_ACCOUNTS === 'true',
    BACKGROUND_CHECK: process.env.FEATURE_BACKGROUND_CHECK === 'true',
  };

  return flagMap[flag as keyof typeof flagMap] || false;
}

// ============================================
// Routes
// ============================================

export const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/', '/privacy', '/terms'];

export const PROTECTED_ROUTES = ['/home', '/matches', '/chat', '/profile', '/settings', '/subscriptions'];

export const ADMIN_ROUTES = ['/admin', '/admin/users', '/admin/moderation', '/admin/analytics'];
