export interface Stats {
  kpis: {
    totalUsers: number; activeUsers: number; newUsers7d: number;
    totalMatches: number; mutualMatches: number; totalLikes: number;
    pendingVerifications: number; totalSubscriptions: number;
  };
  charts: {
    registrations:         { label: string; count: number }[];
    dailyLikes:            { label: string; count: number }[];
    tierBreakdown:         { tier: string; count: number }[];
    genderBreakdown:       { gender: string; count: number }[];
    verificationBreakdown: { status: string; label: string; count: number }[];
  };
}
