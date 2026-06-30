'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import WindowToggle from './WindowToggle';
import LightTooltip from './LightTooltip';

interface UserGrowthCardProps {
  mounted: boolean;
  window7: 7 | 30;
  onWindowChange: (v: 7 | 30) => void;
  regData: { label: string; count: number }[];
}

export default function UserGrowthCard({ mounted, window7, onWindowChange, regData }: UserGrowthCardProps) {
  return (
    <Card title="User Growth Overview" action={<WindowToggle value={window7} onChange={onWindowChange} />}>
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-[#6B1B3D] inline-block rounded-full" /> This Week</span>
        <span className="flex items-center gap-1.5"><span className="w-6 h-px border-t border-dashed border-[#D4AF37] inline-block" /> Last Week</span>
      </div>
      {mounted ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={regData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6B1B3D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6B1B3D" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<LightTooltip />} />
            <Area type="monotone" dataKey="count" name="Registrations" stroke="#6B1B3D" fill="url(#ugGrad)" strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      ) : <div className="h-48 animate-pulse bg-gray-100 rounded-xl" />}
    </Card>
  );
}
