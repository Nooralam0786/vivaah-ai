export interface AdminUser {
  id: string; fullName: string; email: string; phone: string;
  gender: string | null; onboardingStep: string; createdAt: string;
  photo: string | null; city: string | null; occupation: string | null;
  isVerified: boolean; subscriptionTier: string;
  verificationStatus: string; likesGiven: number; likesReceived: number;
}
