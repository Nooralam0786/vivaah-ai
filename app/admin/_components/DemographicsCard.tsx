'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import { GENDER_COLORS } from './dashboardConstants';

interface DemographicsCardProps {
  mounted: boolean;
  genderData: { name: string; value: number }[];
  totalUsers: number;
}

export default function DemographicsCard({ mounted, genderData, totalUsers }: DemographicsCardProps) {
  return (
    <Card title="User Demographics" subtitle="All registered users">
      {mounted && genderData.length > 0 ? (
        <div className="relative">
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3}>
                {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [v.toLocaleString('en-IN'), n]} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-extrabold text-gray-900">{totalUsers.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-400">Total Users</p>
            </div>
          </div>
        </div>
      ) : <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />}
      <div className="mt-2 space-y-1.5">
        {genderData.map((g, i) => (
          <div key={g.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GENDER_COLORS[i] }} />
              <span className="text-xs text-gray-600">{g.name}</span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {totalUsers > 0 ? `${((g.value / totalUsers) * 100).toFixed(1)}%` : '—'}
              <span className="text-gray-400 font-normal ml-1">({g.value.toLocaleString('en-IN')})</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
