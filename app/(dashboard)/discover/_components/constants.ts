import type { Filters } from './types';

export const DEFAULT_FILTERS: Filters = { religion: '', state: '', minAge: '', maxAge: '' };

export const RELIGIONS = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Other'];
export const STATES    = ['Any','Delhi','Maharashtra','Karnataka','Tamil Nadu','Uttar Pradesh','Gujarat','Rajasthan','West Bengal','Telangana','Kerala','Punjab','Haryana','Madhya Pradesh','Bihar'];
export const AGE_PRESETS = [{ label: '18–25', min: '18', max: '25' }, { label: '25–30', min: '25', max: '30' }, { label: '30–35', min: '30', max: '35' }, { label: '35–40', min: '35', max: '40' }, { label: '40+', min: '40', max: '' }];

export function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}
