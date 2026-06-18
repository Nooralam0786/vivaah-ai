'use client';

import Link from 'next/link';

const items = [
  { label: 'Profile Photo', done: true },
  { label: 'About You', done: true },
  { label: 'Interests', done: true },
  { label: 'Finally You', done: true },
  { label: 'Lifestyle Information', done: true },
  { label: 'Family Info', done: false },
  { label: 'ID Verification', done: false },
];

const strength = 85;

function CircularProgress({ value, size = 88 }: { value: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#D4A017' : '#ef4444';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EDE7E9" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-1000" />
    </svg>
  );
}

export default function ProfileStrength() {
  const done = items.filter((i) => i.done).length;

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 md:p-6">
      <h2 className="text-base font-bold text-neutral-900 mb-4">Profile Strength</h2>

      {/* Circular gauge */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-22 h-22 flex-shrink-0">
          <CircularProgress value={strength} size={88} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-neutral-900 leading-none">{strength}%</span>
            <span className="text-[10px] text-green-600 font-semibold mt-0.5">Excellent</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-700">
            {strength >= 80 ? '🌟 Excellent!' : strength >= 60 ? '👍 Good' : '💡 Needs Work'}
          </p>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Your profile is highly visible to potential matches. Complete the remaining items for even better reach.
          </p>
          <p className="text-xs font-medium text-primary-700 mt-1">{done}/{items.length} items complete</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {items.map((item) => (
          <div key={item.label} className={`flex items-center gap-2 text-xs py-1 ${item.done ? 'text-neutral-700' : 'text-neutral-400'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${item.done ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
              {item.done ? '✓' : '○'}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <Link href="/profile"
        className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-secondary-500 transition-colors">
        Improve Profile →
      </Link>
    </div>
  );
}
