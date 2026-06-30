import { User, GraduationCap, MapPin, Heart, Smile } from 'lucide-react';

/* ─── Step configuration ─────────────────────────────────────── */

export const WIZARD_STEPS = [
  { label: 'Basic Info', icon: User },
  { label: 'Education', icon: GraduationCap },
  { label: 'Location', icon: MapPin },
  { label: 'Partner Prefs', icon: Heart },
  { label: 'About Me', icon: Smile },
];

export const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'No Religion', 'Other'];
export const MARITAL = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
export const QUALIFICATIONS = ['High School', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate', 'Other'];
export const OCCUPATIONS = ['Private Sector', 'Government / PSU', 'Business / Self Employed', 'Defence / Civil Services', 'Not Working', 'Other'];
export const INCOME_OPTIONS = ['Below ₹3 LPA', '₹3-5 LPA', '₹5-10 LPA', '₹10-20 LPA', '₹20-30 LPA', '₹30-50 LPA', 'Above ₹50 LPA'];
export const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Other'];
export const HEIGHTS = ['Below 4\'6"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', 'Above 6\'3"'];
export const INTERESTS_LIST = ['Reading', 'Travelling', 'Cooking', 'Music', 'Sports', 'Movies', 'Yoga', 'Gardening', 'Photography', 'Gaming', 'Dancing', 'Painting', 'Fitness', 'Social Work', 'Writing', 'Technology'];
export const MOTHER_TONGUES = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu', 'Sanskrit', 'Maithili', 'Other'];

/* ─── Draft helpers ──────────────────────────────────────────── */
export const DRAFT_KEY = 'vivaah_wizard_draft';

export interface WizardData {
  dob: string; maritalStatus: string; religion: string; caste: string; motherTongue: string; height: string;
  qualification: string; occupation: string; company: string; annualIncome: string;
  country: string; state: string; city: string;
  partnerAgeMin: string; partnerAgeMax: string; partnerReligion: string; partnerState: string;
  aboutMe: string; interests: string[];
}

export function loadDraft(): Partial<WizardData> {
  try { const r = sessionStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
export function saveDraft(d: Partial<WizardData>) {
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}

export const EMPTY: WizardData = {
  dob: '', maritalStatus: '', religion: '', caste: '', motherTongue: '', height: '',
  qualification: '', occupation: '', company: '', annualIncome: '',
  country: 'India', state: '', city: '',
  partnerAgeMin: '21', partnerAgeMax: '35', partnerReligion: '', partnerState: '',
  aboutMe: '', interests: [],
};

/* ─── Generic field helpers ──────────────────────────────────── */
export type WizardKey = keyof WizardData;
