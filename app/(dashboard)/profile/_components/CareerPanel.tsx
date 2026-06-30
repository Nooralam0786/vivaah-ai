import { Briefcase } from 'lucide-react';
import Field from './Field';
import SectionTitle from './SectionTitle';
import type { ProfileData } from '../types';

interface CareerPanelProps {
  profile: ProfileData;
  editing: boolean;
  onUpdate: (patch: Partial<ProfileData>) => void;
}

export default function CareerPanel({ profile, editing, onUpdate }: CareerPanelProps) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={Briefcase} title="Career & Education" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field editing={editing} label="Qualification" value={profile.qualification} onChange={(v) => onUpdate({ qualification: v })} />
        <Field editing={editing} label="Occupation" value={profile.occupation} onChange={(v) => onUpdate({ occupation: v })} />
        <Field editing={editing} label="Company / Organization" value={profile.company} onChange={(v) => onUpdate({ company: v })} />
        <Field editing={editing} label="Annual Income" value={profile.annualIncome} onChange={(v) => onUpdate({ annualIncome: v })} />
      </div>
    </div>
  );
}
