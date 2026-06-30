export interface DiscoverProfile {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  religion: string | null;
  caste: string | null;
  height: string | null;
  income: string | null;
  matchPercent: number;
  isOnline: boolean;
  isVerified: boolean;
  photo: string | null;
}

export interface FreeLimit { total: number; used: number; remaining: number; isLimited: boolean; }

export interface Filters { religion: string; state: string; minAge: string; maxAge: string; }
