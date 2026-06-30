'use client';

import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import Card from './Card';
import type { Stats } from './dashboardTypes';

interface VerificationRequestsCardProps {
  stats: Stats | null;
  pendingVerifications: number;
  totalSubscriptions: number;
}

const ICON_META = [
  { Icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600' },
  { Icon: Clock,        bg: 'bg-amber-50',   text: 'text-amber-600',   badge: 'bg-amber-50 text-amber-600'    },
  { Icon: XCircle,      bg: 'bg-red-50',     text: 'text-red-500',     badge: 'bg-red-50 text-red-600'        },
];

export default function VerificationRequestsCard({ stats, pendingVerifications, totalSubscriptions }: VerificationRequestsCardProps) {
  return (
    <Card title="Verification Requests" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
      {stats ? (
        <div>
          <div className="space-y-3">
            {stats.charts.verificationBreakdown.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No verification requests yet</p>
            ) : stats.charts.verificationBreakdown.map((v, i) => {
              const meta = ICON_META[i % 3];
              const { Icon: VIcon } = meta;
              return (
                <div key={v.status} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                    <VIcon size={16} className={meta.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{v.label}</p>
                    <p className="text-[10px] text-gray-400">{v.count.toLocaleString('en-IN')} records</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>{v.count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl py-3">
              <p className="text-xl font-extrabold text-gray-900">{pendingVerifications}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Pending</p>
            </div>
            <div className="bg-gray-50 rounded-xl py-3">
              <p className="text-xl font-extrabold text-gray-900">{totalSubscriptions}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Paid Members</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-100 rounded-xl" />)}</div>
      )}
    </Card>
  );
}
