'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const activities = [
  {
    id: 1,
    emoji: '💕',
    iconBg: 'bg-rose-100',
    title: 'You have a new match!',
    desc: 'Ananya Singh liked your profile',
    time: '2 hours ago',
  },
  {
    id: 2,
    emoji: '💬',
    iconBg: 'bg-blue-100',
    title: 'New message received',
    desc: 'You have a new message from Neha',
    time: '4 hours ago',
  },
  {
    id: 3,
    emoji: '👁️',
    iconBg: 'bg-green-100',
    title: 'Profile viewed',
    desc: 'Your profile was viewed by 15 people',
    time: '1 day ago',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-900">Recent Activity</h2>
        <Link
          href="/activity"
          className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-0.5"
        >
          View All Activity <ChevronRight size={13} />
        </Link>
      </div>

      {/* Activity cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activities.map((a) => (
          <div
            key={a.id}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-vivaah-border hover:border-primary-700/20 hover:bg-vivaah-bg/60 transition-all cursor-pointer group"
          >
            {/* Icon */}
            <div className={`w-10 h-10 ${a.iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform`}>
              {a.emoji}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-800 leading-tight">{a.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{a.desc}</p>
              <p className="text-[10px] text-neutral-400 mt-1">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
