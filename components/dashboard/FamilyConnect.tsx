'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';

const members = [
  { role: 'Parents',         status: 'Connected',      statusColor: 'text-green-500', emoji: '👨‍👩‍👧', iconBg: 'bg-orange-50' },
  { role: 'Siblings',        status: 'Pending Invite', statusColor: 'text-amber-500', emoji: '👫',     iconBg: 'bg-blue-50'   },
  { role: 'Trusted Members', status: 'Connected',      statusColor: 'text-green-500', emoji: '🤝',     iconBg: 'bg-yellow-50' },
];

export default function FamilyConnect() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card px-3.5 py-2.5">

      {/* Header */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
          <Users size={11} className="text-primary-700" />
        </div>
        <h2 className="text-xs font-bold text-neutral-900">Family Connect</h2>
      </div>
      <p className="text-[10px] text-neutral-400 mb-2 leading-snug">
        Invite your family members to be a part of your journey.
      </p>

      {/* Members */}
      <div className="space-y-1.5 mb-2">
        {members.map((m) => (
          <div key={m.role} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 ${m.iconBg} rounded-full flex items-center justify-center text-xs leading-none flex-shrink-0`}>
                {m.emoji}
              </div>
              <span className="text-[11px] font-medium text-neutral-700">{m.role}</span>
            </div>
            <span className={`text-[10px] font-semibold ${m.statusColor}`}>{m.status}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-vivaah-border mb-2" />

      {/* Link */}
      <Link href="/family-connect"
        className="text-[11px] font-bold text-primary-700 hover:text-secondary-500 transition-colors">
        Manage Family Access →
      </Link>
    </div>
  );
}
