import { Dna } from 'lucide-react';
import Field from './Field';
import SectionTitle from './SectionTitle';
import type { ProfileData } from '../types';

interface PersonalDetailsPanelProps {
  profile: ProfileData;
  editing: boolean;
  onUpdate: (patch: Partial<ProfileData>) => void;
}

export default function PersonalDetailsPanel({ profile, editing, onUpdate }: PersonalDetailsPanelProps) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={Dna} title="Personal Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field editing={editing} label="Date of Birth" value={profile.dob} onChange={(v) => onUpdate({ dob: v })} type="date" />
        <Field editing={editing} label="Height" value={profile.height} onChange={(v) => onUpdate({ height: v })} />
        <Field editing={editing} label="Religion" value={profile.religion} onChange={(v) => onUpdate({ religion: v })} />
        <Field editing={editing} label="Caste" value={profile.caste} onChange={(v) => onUpdate({ caste: v })} />
        <Field editing={editing} label="Mother Tongue" value={profile.motherTongue} onChange={(v) => onUpdate({ motherTongue: v })} />
        <Field editing={editing} label="Marital Status" value={profile.maritalStatus} onChange={(v) => onUpdate({ maritalStatus: v })} />
      </div>
    </div>
  );
}
