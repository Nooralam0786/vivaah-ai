'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import WindowToggle from './WindowToggle';
import LightTooltip from './LightTooltip';
import { FALLBACK_REVENUE_DATA } from './dashboardConstants';

interface RevenueOverviewCardProps {
  mounted: boolean;
  window7: 7 | 30;
  onWindowChange: (v: 7 | 30) => void;
  likeData: { label: string; count: number }[];
}

export default function RevenueOverviewCard({ mounted, window7, onWindowChange, likeData }: RevenueOverviewCardProps) {
  return (
    <Card title="Revenue Overview" subtitle="₹18,75,320  ·  +22.5% vs last week" action={<WindowToggle value={window7} onChange={onWindowChange} />}>
      {mounted ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={likeData.length ? likeData : FALLBACK_REVENUE_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<LightTooltip />} />
            <Bar dataKey="count" name="Activity" fill="#6B1B3D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : <div className="h-52 animate-pulse bg-gray-100 rounded-xl" />}
    </Card>
  );
}
