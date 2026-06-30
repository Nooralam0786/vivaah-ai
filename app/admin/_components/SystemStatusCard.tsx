'use client';

import { Circle } from 'lucide-react';
import Card from './Card';
import { SYSTEM_STATUS } from './dashboardConstants';

export default function SystemStatusCard() {
  return (
    <Card title="System Status">
      <div className="space-y-3">
        {SYSTEM_STATUS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Circle size={9} fill="#10b981" stroke="#10b981" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800">{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.desc}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full whitespace-nowrap">Operational</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[11px] text-gray-400">All systems operating normally</span>
      </div>
    </Card>
  );
}
