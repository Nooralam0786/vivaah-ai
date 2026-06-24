'use client';

import { useEffect, useState } from 'react';
import { Eye, Heart, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface Stats {
  matches: number;
  likesReceived: number;
  messages: number;
  profileStrength: number;
}

// Generates a simple upward-trending sparkline ending at `current`
function trendData(current: number, points = 10): number[] {
  if (current === 0) return Array(points).fill(0);
  return Array.from({ length: points }, (_, i) => {
    const base = Math.round((current * (i + 1)) / points);
    const jitter = Math.round((Math.random() - 0.3) * (current * 0.15));
    return Math.max(0, base + jitter);
  });
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 64;
  const h = 22;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const safe = (id: string) => id.replace(/[^a-z0-9]/gi, '');
  return (
    <svg width={w} height={h} className="overflow-visible flex-shrink-0">
      <defs>
        <linearGradient id={`sg-${safe(color)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts.join(' ')} ${w},${h}`}
        fill={`url(#sg-${safe(color)})`}
      />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl px-3.5 py-3 border border-vivaah-border shadow-card animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-neutral-200 rounded-lg" />
        <div className="h-3 bg-neutral-200 rounded w-24 flex-1" />
      </div>
      <div className="h-6 bg-neutral-200 rounded w-12 mb-2" />
      <div className="h-3 bg-neutral-100 rounded w-20" />
    </div>
  );
}

export default function StatsCards() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setLoading(false); return; }

    fetch('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => { if (json.success) setStats(json.data); })
      .catch(() => {/* show zeros */})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const s = stats ?? { matches: 0, likesReceived: 0, messages: 0, profileStrength: 0 };

  const cards = [
    {
      label:       'Profile Views',
      value:       s.likesReceived,
      change:      s.likesReceived > 0 ? `${s.likesReceived} people liked you` : 'No likes yet',
      Icon:        Eye,
      iconBg:      'bg-purple-100',
      iconColor:   'text-purple-500',
      sparkColor:  '#8b5cf6',
      sparkData:   trendData(s.likesReceived),
      isStrength:  false,
    },
    {
      label:       'New Matches',
      value:       s.matches,
      change:      s.matches > 0 ? `${s.matches} compatible profiles` : 'Explore to get matches',
      Icon:        Heart,
      iconBg:      'bg-rose-100',
      iconColor:   'text-rose-500',
      sparkColor:  '#f43f5e',
      sparkData:   trendData(s.matches),
      isStrength:  false,
    },
    {
      label:       'Messages',
      value:       s.messages,
      change:      s.messages > 0 ? `${s.messages} unread` : 'No messages yet',
      Icon:        MessageSquare,
      iconBg:      'bg-blue-100',
      iconColor:   'text-blue-500',
      sparkColor:  '#3b82f6',
      sparkData:   trendData(s.messages),
      isStrength:  false,
    },
    {
      label:       'Profile Strength',
      value:       `${s.profileStrength}%`,
      change:      s.profileStrength >= 80 ? 'Excellent' : s.profileStrength >= 50 ? 'Good' : 'Needs work',
      Icon:        Zap,
      iconBg:      'bg-amber-100',
      iconColor:   'text-amber-500',
      sparkColor:  '#D4A017',
      sparkData:   [],
      isStrength:  true,
      strengthVal: s.profileStrength,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const { Icon } = card;
        const changeColor =
          card.isStrength
            ? card.strengthVal! >= 80 ? 'text-green-500' : card.strengthVal! >= 50 ? 'text-amber-500' : 'text-red-400'
            : 'text-green-500';

        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl px-3.5 py-3 border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            {/* Row 1: icon + label */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={card.iconColor} />
              </div>
              <span className="text-[11px] text-neutral-500 font-medium leading-tight">{card.label}</span>
            </div>

            {/* Row 2: value */}
            <div className="text-xl font-bold text-neutral-900 leading-none mb-2">{card.value}</div>

            {/* Row 3: change text + sparkline OR progress bar */}
            {card.isStrength ? (
              <div className="space-y-1">
                <span className={`text-[11px] font-semibold ${changeColor}`}>{card.change}</span>
                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:      `${card.strengthVal}%`,
                      background: 'linear-gradient(90deg, #D4A017 0%, #F5C347 100%)',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2">
                <span className={`text-[11px] font-medium ${changeColor} leading-tight`}>
                  <TrendingUp size={10} className="inline mr-0.5" />
                  {card.change}
                </span>
                <Sparkline data={card.sparkData} color={card.sparkColor} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
