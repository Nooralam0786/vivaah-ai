'use client';

import { useState } from 'react';
import { Eye, Heart, MessageSquare, Zap, MoreVertical } from 'lucide-react';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 22;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const polyPts = pts.map(p => p).join(' ');
  const fillPts = `0,${h} ${polyPts} ${w},${h}`;

  return (
    <svg width={w} height={h} className="overflow-visible flex-shrink-0">
      <defs>
        <linearGradient id={`sg${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg${color.replace(/[^a-z0-9]/gi, '')})`} />
      <polyline points={polyPts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stats = [
  {
    label: 'Profile Views',
    value: 128,
    changeText: '23% this week',
    Icon: Eye,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    sparkColor: '#8b5cf6',
    sparkData: [45, 52, 48, 62, 58, 72, 80, 92, 100, 110, 128] as number[],
    isStrength: false,
  },
  {
    label: 'New Matches',
    value: 12,
    changeText: '8% this week',
    Icon: Heart,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    sparkColor: '#f43f5e',
    sparkData: [3, 5, 4, 7, 6, 8, 7, 9, 10, 11, 12] as number[],
    isStrength: false,
  },
  {
    label: 'Messages',
    value: 12,
    changeText: '15% this week',
    Icon: MessageSquare,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    sparkColor: '#3b82f6',
    sparkData: [4, 6, 5, 8, 7, 9, 8, 10, 9, 11, 12] as number[],
    isStrength: false,
  },
  {
    label: 'Profile Strength',
    value: '85%',
    changeText: 'Excellent',
    Icon: Zap,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
    sparkColor: '#D4A017',
    sparkData: [] as number[],
    isStrength: true,
  },
];

export default function StatsCards() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const { Icon } = stat;
        return (
          <div key={stat.label}
            className="bg-white rounded-2xl px-3.5 py-3 border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-200 relative">

            {/* Row 1: icon + label + three-dots */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={stat.iconColor} />
              </div>
              <span className="text-[11px] text-neutral-500 font-medium flex-1 leading-tight">{stat.label}</span>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(menuOpen === stat.label ? null : stat.label)}
                  className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-neutral-500 transition-colors">
                  <MoreVertical size={13} />
                </button>
                {menuOpen === stat.label && (
                  <div className="absolute right-0 top-6 w-36 bg-white rounded-xl shadow-lg border border-vivaah-border py-1 z-10">
                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-600 hover:bg-vivaah-bg">View Details</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-600 hover:bg-vivaah-bg">Download Report</button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Big value */}
            <div className="text-xl font-bold text-neutral-900 leading-none mb-2">{stat.value}</div>

            {/* Row 3: change + sparkline OR progress */}
            {stat.isStrength ? (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-green-500">{stat.changeText}</span>
                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: '85%', background: 'linear-gradient(90deg, #D4A017 0%, #F5C347 100%)' }} />
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2">
                <div className="text-[11px] text-green-500 font-medium">
                  <span className="mr-0.5">▲</span>{stat.changeText}
                </div>
                <Sparkline data={stat.sparkData} color={stat.sparkColor} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
