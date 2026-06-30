import { User } from 'lucide-react';
import Field from './Field';
import SectionTitle from './SectionTitle';
import type { ProfileData } from '../types';

interface BasicInfoPanelProps {
  profile: ProfileData;
  editing: boolean;
  onUpdate: (patch: Partial<ProfileData>) => void;
}

export default function BasicInfoPanel({ profile, editing, onUpdate }: BasicInfoPanelProps) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={User} title="Basic Information" />
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">About Me</label>
        {editing ? (
          <textarea value={profile.aboutMe} onChange={(e) => onUpdate({ aboutMe: e.target.value })} rows={4}
            className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
        ) : (
          <p className="text-sm text-neutral-700 leading-relaxed">{profile.aboutMe || <span className="text-neutral-300">Not specified</span>}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field editing={editing} label="Full Name" value={profile.fullName} onChange={(v) => onUpdate({ fullName: v })} />
        <Field editing={editing} label="Email" value={profile.email} type="email" locked />
        <Field editing={editing} label="Mobile" value={profile.phone} locked />
        <Field editing={editing} label="Gender" value={profile.gender} onChange={(v) => onUpdate({ gender: v })} />
      </div>
    </div>
  );
}
