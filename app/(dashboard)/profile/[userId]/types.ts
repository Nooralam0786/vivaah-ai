export interface ProfileFull {
  userId: string;
  name: string;
  age: number | null;
  gender: string | null;
  photo: string | null;
  photos: string[];
  coverPhoto: string | null;
  isVerified: boolean;
  isOnline: boolean;
  matchPercent: number;
  breakdown: Record<string, number>;
  mutualInterests: string[];
  iLiked: boolean;
  isMutual: boolean;
  dob: string | null;
  height: string | null;
  religion: string | null;
  caste: string | null;
  motherTongue: string | null;
  maritalStatus: string | null;
  qualification: string | null;
  occupation: string | null;
  company: string | null;
  annualIncome: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  aboutMe: string | null;
  interests: string[];
  smokingHabit: string | null;
  drinkingHabit: string | null;
  dietPreference: string | null;
}

export type ProfileViewTab = 'about' | 'photos' | 'insights';
