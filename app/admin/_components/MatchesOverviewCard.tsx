'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import WindowToggle from './WindowToggle';
import { MATCH_BREAKDOWN } from './dashboardConstants';

interface MatchesOverviewCardProps {
  mounted: boolean;
  window7: 7 | 30;
  onWindowChange: (v: 7 | 30) => void;
  totalMatches: number;
}

export default function MatchesOverviewCard({ mounted, window7, onWindowChange, totalMatches }: MatchesOverviewCardProps) {
  return (
    <Card title="Matches Overview" action={<WindowToggle value={window7} onChange={onWindowChange} />}>
      {mounted ? (
        <div className="relative">
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie
                data={MATCH_BREAKDOWN.map((m) => ({ ...m, value: Math.round((m.pct / 100) * (totalMatches || 100)) }))}
                dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={2}
              >
                {MATCH_BREAKDOWN.map((m) => <Cell key={m.name} fill={m.color} />)}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [v.toLocaleString('en-IN'), n]} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-extrabold text-gray-900">{totalMatches.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-400">Total Matches</p>
            </div>
          </div>
        </div>
      ) : <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />}
      <div className="mt-3 space-y-1.5">
        {MATCH_BREAKDOWN.map((m) => (
          <div key={m.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
              <span className="text-gray-600">{m.name}</span>
            </div>
            <span className="font-semibold text-gray-800">
              {Math.round((m.pct / 100) * totalMatches).toLocaleString('en-IN')}
              <span className="text-gray-400 font-normal ml-1">({m.pct}%)</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
