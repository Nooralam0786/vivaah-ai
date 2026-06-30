export interface MatchData {
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
  tag: string;
  photo: string | null;
  mutualInterests: string[];
}

export interface Filters {
  minAge: string;
  maxAge: string;
  religion: string;
  state: string;
}
