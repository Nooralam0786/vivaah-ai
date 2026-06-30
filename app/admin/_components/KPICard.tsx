'use client';

import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Sparkline from './Sparkline';

export interface KPIProps {
  label: string; value: string; change: string;
  Icon: React.ElementType; iconBg: string; iconColor: string;
  sparkValues: number[]; sparkColor: string;
}

function KPICard({ label, value, change, Icon, iconBg, iconColor, sparkValues, sparkColor }: KPIProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1">
          <ArrowUpRight size={13} className="text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-600">{change}</span>
          <span className="text-[11px] text-gray-400 ml-0.5">vs last week</span>
        </div>
        <Sparkline values={sparkValues} color={sparkColor} />
      </div>
    </div>
  );
}

export default memo(KPICard);
