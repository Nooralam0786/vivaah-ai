'use client';

import { Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { FreeLimit } from './types';

export default function FreeLimitBanner({ freeLimit }: { freeLimit: FreeLimit }) {
  const pct = Math.round((freeLimit.used / freeLimit.total) * 100);
  const isLow = freeLimit.remaining <= 2;
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-sm ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {isLow
            ? <span className="text-lg">⚠️</span>
            : <span className="text-lg">ℹ️</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-xs ${isLow ? 'text-amber-800' : 'text-blue-800'}`}>
            {freeLimit.remaining > 0
              ? `${freeLimit.remaining} of ${freeLimit.total} free profiles remaining today`
              : 'Daily limit reached'}
          </p>
          <div className="mt-1.5 h-1.5 bg-white/70 rounded-full overflow-hidden w-36">
            <div
              className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <Link
        href="/select-plan"
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-gradient text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <Crown className="w-3 h-3" />
        Upgrade
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
