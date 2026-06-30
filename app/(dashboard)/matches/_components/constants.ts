import type { Filters } from './types';

export const DEFAULT_FILTERS: Filters = { minAge: '', maxAge: '', religion: '', state: '' };

export const TABS = [
  { id: 'new',        label: 'Suggested',       emoji: '✨' },
  { id: 'compatible', label: 'Compatible',       emoji: '💯' },
  { id: 'mutual',     label: 'Mutual Interest',  emoji: '💕' },
  { id: 'premium',    label: 'Premium',          emoji: '👑', premium: true },
];

export const RELIGIONS = ['Any', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
export const STATES    = [
  'Any', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-500';
}

export function scoreLabel(pct: number) {
  if (pct >= 90) return 'Excellent';
  if (pct >= 80) return 'Great';
  if (pct >= 70) return 'Good';
  return 'Fair';
}
