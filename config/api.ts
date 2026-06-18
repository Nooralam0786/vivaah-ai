/**
 * API Configuration and Endpoints
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY_OTP: '/api/auth/verify-otp',
    REFRESH_TOKEN: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },

  // Users
  USERS: {
    PROFILE: '/api/users/profile',
    PROFILE_BY_ID: (id: string) => `/api/users/profile/${id}`,
    UPDATE_PROFILE: '/api/users/profile',
    DELETE_PROFILE: '/api/users/profile',
    PREFERENCES: '/api/users/preferences',
    UPDATE_PREFERENCES: '/api/users/preferences',
  },

  // Verification
  VERIFICATION: {
    PHONE: '/api/verification/phone',
    EMAIL: '/api/verification/email',
    ID_UPLOAD: '/api/verification/id-upload',
    LIVENESS: '/api/verification/liveness',
    STATUS: '/api/verification/status',
  },

  // Matching
  MATCHES: {
    GET: '/api/matches',
    LIKE: '/api/matches/like',
    PASS: '/api/matches/pass',
    MUTUAL: '/api/matches/mutual',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/api/chat/conversations',
    MESSAGES: (conversationId: string) => `/api/chat/conversations/${conversationId}/messages`,
    SEND: '/api/chat/messages',
  },

  // Payments
  PAYMENTS: {
    SUBSCRIBE: '/api/payments/subscribe',
    WEBHOOK: '/api/payments/webhook',
    BILLING_HISTORY: '/api/payments/billing-history',
    CANCEL_SUBSCRIPTION: '/api/payments/cancel',
  },

  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    MODERATION_QUEUE: '/api/admin/moderation',
    ANALYTICS: '/api/admin/analytics',
  },
} as const;

/**
 * API Error Types
 */
export enum APIErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export const ERROR_MESSAGES: Record<APIErrorCode, string> = {
  [APIErrorCode.UNAUTHORIZED]: 'Please log in to continue',
  [APIErrorCode.FORBIDDEN]: 'You do not have permission to perform this action',
  [APIErrorCode.NOT_FOUND]: 'The requested resource was not found',
  [APIErrorCode.VALIDATION_ERROR]: 'Please check your input and try again',
  [APIErrorCode.RATE_LIMITED]: 'Too many requests. Please try again later',
  [APIErrorCode.SERVER_ERROR]: 'Something went wrong. Please try again later',
  [APIErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection',
};
