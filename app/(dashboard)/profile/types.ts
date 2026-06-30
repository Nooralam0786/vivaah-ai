export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  height: string;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  qualification: string;
  occupation: string;
  company: string;
  annualIncome: string;
  country: string;
  state: string;
  city: string;
  aboutMe: string;
  interests: string[];
  photo: string | null;
  coverPhoto: string | null;
  photos: string[];
  profileCompleteness: number;
}

export interface PreferenceData {
  ageMin: number;
  ageMax: number;
  religion: string;
  location: string;
  education: string;
}

// 'avatar' | 'cover' | gallery slot index (0-3) — whichever slot is currently picking/uploading a file
export type UploadTarget = 'avatar' | 'cover' | number | null;
