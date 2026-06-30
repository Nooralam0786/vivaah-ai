import {
  User, Dna, Briefcase, MapPin, GalleryHorizontalEnd, Heart,
} from 'lucide-react';
import type { ProfileData, PreferenceData } from './types';

export const TABS = [
  { id: 'Basic Info', icon: User },
  { id: 'Personal Details', icon: Dna },
  { id: 'Career', icon: Briefcase },
  { id: 'Location', icon: MapPin },
  { id: 'Photos', icon: GalleryHorizontalEnd },
  { id: 'Preferences', icon: Heart },
];

export const EMPTY_PROFILE: ProfileData = {
  fullName: '', email: '', phone: '', gender: '', dob: '', height: '', religion: '', caste: '',
  motherTongue: '', maritalStatus: '', qualification: '', occupation: '', company: '', annualIncome: '',
  country: '', state: '', city: '', aboutMe: '', interests: [], photo: null, coverPhoto: null, photos: [],
  profileCompleteness: 0,
};

export const EMPTY_PREFERENCE: PreferenceData = {
  ageMin: 18, ageMax: 35, religion: 'Any Religion', location: '', education: 'Any',
};
