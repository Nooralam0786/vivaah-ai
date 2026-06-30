'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface Activity {
  id:     string;
  type:   string;
  emoji:  string;
  iconBg: string;
  title:  string;
  desc:   string;
  photo:  string | null;
  time:   string;
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  if (mins < 1)    return 'Just now';
  if (mins < 60)   return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)    return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function SkeletonActivity() {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-vivaah-border animate-pulse">
      <div className="w-10 h-10 bg-neutral-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5 pt-0.5">
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
        <div className="h-2.5 bg-neutral-100 rounded w-full" />
        <div className="h-2 bg-neutral-100 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setLoading(false); return; }

    fetch('/api/dashboard/activity', {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => { if (json.success) setActivities(json.data.activities); })
      .catch(() => {/* show empty */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-900">Recent Activity</h2>
        <Link
          href="/connections"
          className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/50 rounded"
        >
          View All <ChevronRight size={13} />
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonActivity key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && activities.length === 0 && (
        <div className="text-center py-8 text-neutral-400">
          <div className="text-4xl mb-2">🕊️</div>
          <p className="text-sm font-medium text-neutral-500">No activity yet</p>
          <p className="text-xs mt-1">Likes and messages will appear here</p>
        </div>
      )}

      {/* Activity cards */}
      {!loading && activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-vivaah-border hover:border-primary-700/20 hover:bg-vivaah-bg/60 transition-all cursor-pointer group"
            >
              {/* Avatar or emoji icon */}
              <div className="relative flex-shrink-0">
                {a.photo ? (
                  <img
                    src={a.photo}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className={`w-10 h-10 ${a.iconBg} rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}>
                    {a.emoji}
                  </div>
                )}
                {/* emoji badge over photo */}
                {a.photo && (
                  <span className={`absolute -bottom-1 -right-1 w-5 h-5 ${a.iconBg} rounded-full flex items-center justify-center text-xs`}>
                    {a.emoji}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-800 leading-tight truncate">{a.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-snug line-clamp-2">{a.desc}</p>
                <p className="text-[10px] text-neutral-400 mt-1">{timeAgo(a.time)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
