'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

const items = [
  { label: 'Profile Photo',        done: true },
  { label: 'Family Information',   done: false },
  { label: 'About You',            done: true },
  { label: 'Horoscope',            done: false },
  { label: 'Interests',            done: true },
  { label: 'Lifestyle Information', done: true },
  { label: 'ID Verification',      done: true },
];

const strength = 85;
const DONE_COUNT = items.filter((i) => i.done).length;

function DonutChart({ value, size = 90 }: { value: number; size?: number }) {
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#EDE7E9" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#22c55e" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-1000" />
    </svg>
  );
}

export default function ProfileStrength() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4">

      {/* Title */}
      <h2 className="text-sm font-bold text-neutral-900 mb-3">Profile Strength</h2>

      {/* Donut + text */}
      <div className="flex items-start gap-3 mb-4">
        {/* Chart */}
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <DonutChart value={strength} size={90} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-neutral-900 leading-none">{strength}%</span>
            <span className="text-[10px] text-green-500 font-semibold mt-0.5">Excellent</span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-neutral-800 flex items-center gap-1 mb-1">
            <span>🌟</span> Excellent!
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Your profile is highly visible to potential matches. Complete the remaining items for even better reach.
          </p>
          <p className="text-[11px] font-bold text-primary-700 mt-1.5">
            {DONE_COUNT}/{items.length} items complete
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-vivaah-border mb-3" />

      {/* Checklist — 2 columns */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.done ? (
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check size={9} className="text-green-600" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0" />
            )}
            <span className={`text-[11px] leading-tight ${item.done ? 'text-neutral-700' : 'text-neutral-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Link */}
      <Link href="/profile"
        className="text-xs font-bold text-primary-700 hover:text-secondary-500 transition-colors">
        Improve Profile →
      </Link>
    </div>
  );
}
