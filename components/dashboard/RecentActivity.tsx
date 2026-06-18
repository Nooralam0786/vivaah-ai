'use client';

import Link from 'next/link';

const activities = [
  { id: 1, icon: '💕', title: 'You have a new match!', desc: 'Ananya Singh liked your profile', time: '2 hours ago', type: 'match', color: 'bg-primary-50 text-primary-700' },
  { id: 2, icon: '💬', title: 'New message received', desc: 'You have a new message from Neha', time: '4 hours ago', type: 'message', color: 'bg-blue-50 text-blue-600' },
  { id: 3, icon: '👁️', title: 'Profile viewed', desc: 'Your profile was viewed by 15 people', time: '1 day ago', type: 'view', color: 'bg-green-50 text-green-600' },
  { id: 4, icon: '✅', title: 'Interest accepted', desc: 'Priya Sharma accepted your interest', time: '2 days ago', type: 'interest', color: 'bg-amber-50 text-amber-600' },
  { id: 5, icon: '🤝', title: 'Connection request', desc: 'Roopa Iyer sent you a connection request', time: '3 days ago', type: 'connection', color: 'bg-purple-50 text-purple-600' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-900">Recent Activity</h2>
        <Link href="/activity" className="text-sm font-semibold text-primary-700 hover:text-secondary-500 transition-colors">
          View All Activity →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activities.slice(0, 3).map((activity) => (
          <div key={activity.id}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-vivaah-border hover:border-primary-700/20 hover:bg-vivaah-bg/50 transition-all cursor-pointer group">
            <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              {activity.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-800 leading-tight">{activity.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{activity.desc}</p>
              <p className="text-[10px] text-neutral-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
