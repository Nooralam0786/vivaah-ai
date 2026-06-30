import { MapPin } from 'lucide-react';
import Field from './Field';
import SectionTitle from './SectionTitle';
import type { ProfileData } from '../types';

interface LocationPanelProps {
  profile: ProfileData;
  editing: boolean;
  onUpdate: (patch: Partial<ProfileData>) => void;
}

export default function LocationPanel({ profile, editing, onUpdate }: LocationPanelProps) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={MapPin} title="Location" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field editing={editing} label="Country" value={profile.country} onChange={(v) => onUpdate({ country: v })} />
        <Field editing={editing} label="State" value={profile.state} onChange={(v) => onUpdate({ state: v })} />
        <Field editing={editing} label="City" value={profile.city} onChange={(v) => onUpdate({ city: v })} />
      </div>
    </div>
  );
}
