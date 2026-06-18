/**
 * Core Type Definitions for VivaahAI
 */

// ============================================
// Authentication Types
// ============================================

export interface User {
  id: string;
  phone: string;
  email: string;
  subscriptionTier: 'free' | 'gold' | 'platinum' | 'diamond';
  verificationStatus: VerificationStatus;
  profileCompleteness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
}

// ============================================
// Profile Types
// ============================================

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  religion: string;
  caste: string;
  education: string;
  profession: string;
  incomeRange: string;
  locationCity: string;
  bio?: string;
  photos: string[];
  photosCount: number;
  profileCompleteness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  ageMin: number;
  ageMax: number;
  religions: string[];
  castes: string[];
  educationMin: string;
  distanceKm: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Verification Types
// ============================================

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface VerificationRecord {
  id: string;
  userId: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  idType?: string;
  idNumber?: string;
  idVerified: boolean;
  livenessStatus: 'not_started' | 'pending' | 'success' | 'failed';
  faceMatchScore?: number;
  fraudScore: number;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDUploadPayload {
  idType: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
  idNumber: string;
  photo: File;
}

export interface LivenessPayload {
  video: Blob;
  challenges: string[];
}

// ============================================
// Matching Types
// ============================================

export interface MatchCard {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: string;
  education: string;
  profession: string;
  photos: string[];
  bio: string;
  compatibilityScore?: number;
  isVerified: boolean;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  isMutual: boolean;
  compatibilityScore?: number;
  createdAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  likedUserId: string;
  createdAt: Date;
}

// ============================================
// Chat Types
// ============================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  deliveryStatus: 'sent' | 'delivered' | 'read';
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

// ============================================
// Payment Types
// ============================================

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'gold' | 'platinum' | 'diamond';
  amount: number;
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  autoRenewal: boolean;
  razorpayOrderId?: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  tier: string;
}

export interface PaymentWebhook {
  event: string;
  payload: {
    payment?: {
      entity: string;
      id: string;
      amount: number;
      status: string;
    };
    order?: {
      entity: string;
      id: string;
      amount: number;
      status: string;
    };
  };
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Admin Types
// ============================================

export interface AdminUser extends User {
  role: 'admin' | 'moderator' | 'support';
  permissions: string[];
}

export interface FlaggedProfile {
  id: string;
  userId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
}

// ============================================
// Analytics Types
// ============================================

export interface UserMetrics {
  dau: number;
  mau: number;
  newSignups: number;
  activeUsers: number;
  conversionRate: number;
  churnRate: number;
}

export interface FinancialMetrics {
  mrr: number;
  arpu: number;
  ltv: number;
  cac: number;
  grossprofitMargin: number;
}
