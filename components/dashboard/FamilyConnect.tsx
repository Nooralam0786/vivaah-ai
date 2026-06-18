'use client';

import Link from 'next/link';

const members = [
  { role: 'Parents', status: 'Connected', icon: '👨‍👩‍👧', color: 'text-green-600', bg: 'bg-green-50' },
  { role: 'Siblings', status: 'Pending Invite', icon: '👫', color: 'text-amber-600', bg: 'bg-amber-50' },
  { role: 'Trusted Members', status: 'Connected', icon: '🤝', color: 'text-blue-600', bg: 'bg-blue-50' },
];

export default function FamilyConnect() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-900">Family Connect</h2>
        <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
      </div>

      <p className="text-xs text-neutral-500 mb-4">Invite your family members to be a part of your journey.</p>

      <div className="space-y-2.5 mb-5">
        {members.map((m) => (
          <div key={m.role} className="flex items-center justify-between p-3 rounded-xl bg-vivaah-bg border border-vivaah-border hover:border-primary-700/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${m.bg} rounded-full flex items-center justify-center text-base`}>{m.icon}</div>
              <span className="text-sm font-medium text-neutral-700">{m.role}</span>
            </div>
            <span className={`text-xs font-semibold ${m.color}`}>{m.status}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-2.5 border border-dashed border-primary-700/40 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors mb-3 flex items-center justify-center gap-2">
        <span>+</span> Invite Family Member
      </button>

      <Link href="/family-connect"
        className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-secondary-500 transition-colors">
        Manage Family Access →
      </Link>
    </div>
  );
}
