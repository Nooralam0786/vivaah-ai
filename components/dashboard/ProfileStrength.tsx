'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface ProfileData {
  photo: string | null;
  aboutMe: string | null;
  religion: string | null;
  qualification: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  interests: string;
  smokingHabit: string | null;
  drinkingHabit: string | null;
  dietPreference: string | null;
  dob: string | null;
  maritalStatus: string | null;
}

function parseInterests(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function buildChecklist(p: ProfileData | null) {
  if (!p) return [];
  return [
    { label: 'Profile Photo',      done: !!p.photo },
    { label: 'Date of Birth',      done: !!p.dob },
    { label: 'Religion',           done: !!p.religion },
    { label: 'Education',          done: !!p.qualification },
    { label: 'Occupation',         done: !!p.occupation },
    { label: 'Location',           done: !!(p.city && p.state) },
    { label: 'About You',          done: !!p.aboutMe },
    { label: 'Interests',          done: parseInterests(p.interests).length > 0 },
    { label: 'Marital Status',     done: !!p.maritalStatus },
    { label: 'Lifestyle Info',     done: !!(p.smokingHabit || p.drinkingHabit || p.dietPreference) },
  ];
}

function DonutChart({ value, size = 90 }: { value: number; size?: number }) {
  const sw  = 9;
  const r   = (size - sw) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const strokeColor = value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EDE7E9" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={strokeColor}
        strokeWidth={sw}
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

function SkeletonStrength() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-32 mb-3" />
      <div className="flex items-start gap-3 mb-4">
        <div className="w-[90px] h-[90px] bg-neutral-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-3 bg-neutral-200 rounded w-20" />
          <div className="h-2.5 bg-neutral-100 rounded w-full" />
          <div className="h-2.5 bg-neutral-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function ProfileStrength() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setLoading(false); return; }

    fetch('/api/users/profile', {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) return;
        const p = json.data.profile ?? json.data;
        setProfile({
          photo:         p.photo         ?? null,
          aboutMe:       p.aboutMe       ?? null,
          religion:      p.religion      ?? null,
          qualification: p.qualification ?? null,
          occupation:    p.occupation    ?? null,
          city:          p.city          ?? null,
          state:         p.state         ?? null,
          interests:     p.interests     ?? '[]',
          smokingHabit:  p.smokingHabit  ?? null,
          drinkingHabit: p.drinkingHabit ?? null,
          dietPreference:p.dietPreference?? null,
          dob:           p.dob           ?? null,
          maritalStatus: p.maritalStatus ?? null,
        });
        setStrength(json.data.profileCompleteness ?? json.data.strength ?? 0);
      })
      .catch(() => {/* show zeros */})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonStrength />;

  const items     = buildChecklist(profile);
  const doneCount = items.filter((i) => i.done).length;
  const label     = strength >= 80 ? 'Excellent' : strength >= 50 ? 'Good' : 'Needs work';
  const labelColor= strength >= 80 ? 'text-green-500' : strength >= 50 ? 'text-amber-500' : 'text-red-400';

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4">
      <h2 className="text-sm font-bold text-neutral-900 mb-3">Profile Strength</h2>

      {/* Donut + text */}
      <div className="flex items-start gap-3 mb-4 min-w-0">
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <DonutChart value={strength} size={90} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-neutral-900 leading-none">{strength}%</span>
            <span className={`text-[10px] font-semibold mt-0.5 ${labelColor}`}>{label}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-neutral-800 flex items-center gap-1 mb-1">
            {strength >= 80 ? '🌟' : strength >= 50 ? '👍' : '⚠️'} {label}!
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {strength >= 80
              ? 'Your profile is highly visible to potential matches.'
              : strength >= 50
              ? 'Complete the remaining items to increase your visibility.'
              : 'Complete your profile to start getting matches.'}
          </p>
          <p className="text-[11px] font-bold text-primary-700 mt-1.5">
            {doneCount}/{items.length} items complete
          </p>
        </div>
      </div>

      <div className="h-px bg-vivaah-border mb-3" />

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 min-w-0">
            {item.done ? (
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check size={9} className="text-green-600" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0" />
            )}
            <span className={`text-[11px] leading-tight truncate min-w-0 ${item.done ? 'text-neutral-700' : 'text-neutral-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <Link href="/profile" className="text-xs font-bold text-primary-700 hover:text-secondary-500 transition-colors">
        {strength < 100 ? 'Improve Profile →' : 'View Profile →'}
      </Link>
    </div>
  );
}
