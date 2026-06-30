import { Heart } from 'lucide-react';
import SectionTitle from './SectionTitle';
import type { PreferenceData } from '../types';

interface PreferencesPanelProps {
  preference: PreferenceData;
  editing: boolean;
  onUpdate: (patch: Partial<PreferenceData>) => void;
}

export default function PreferencesPanel({ preference, editing, onUpdate }: PreferencesPanelProps) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={Heart} title="Match Preferences" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Age Range</label>
          <div className="flex items-center gap-2">
            <input type="number" value={preference.ageMin} min={18} max={50} disabled={!editing}
              onChange={(e) => onUpdate({ ageMin: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 disabled:bg-vivaah-bg disabled:text-neutral-500" />
            <span className="text-neutral-400 text-sm">to</span>
            <input type="number" value={preference.ageMax} min={18} max={50} disabled={!editing}
              onChange={(e) => onUpdate({ ageMax: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 disabled:bg-vivaah-bg disabled:text-neutral-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Religion Preference</label>
          <select value={preference.religion} disabled={!editing}
            onChange={(e) => onUpdate({ religion: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500">
            <option>Any Religion</option>
            <option>Hindu</option><option>Muslim</option><option>Christian</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Location</label>
          <input type="text" value={preference.location} disabled={!editing}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Education Preference</label>
          <select value={preference.education} disabled={!editing}
            onChange={(e) => onUpdate({ education: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500">
            <option>Any</option>
            <option>Graduate & Above</option><option>Post Graduate & Above</option>
          </select>
        </div>
      </div>
    </div>
  );
}
