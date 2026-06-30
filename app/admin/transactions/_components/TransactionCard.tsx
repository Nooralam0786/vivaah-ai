'use client';

import { memo } from 'react';
import { Crown } from 'lucide-react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { TIER_META } from './constants';
import type { Transaction } from './types';

function TransactionCard({ t }: { t: Transaction }) {
  const tm = TIER_META[t.tier] ?? TIER_META.free;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <Avatar name={t.userName} photo={t.userPhoto} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-gray-900 truncate">{t.userName}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${tm.bg} ${tm.color}`}>
              <Crown className="w-3 h-3" /> {tm.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate">{t.userEmail}</p>

          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-gray-900 text-sm">
              {t.amount > 0 ? `₹${t.amount.toLocaleString('en-IN')}` : <span className="text-gray-400">Free</span>}
            </span>
            <StatusBadge status={t.status} />
          </div>

          {t.razorpayPaymentId && (
            <code className="block text-xs bg-gray-100 px-2 py-0.5 rounded font-mono mt-2 truncate">{t.razorpayPaymentId}</code>
          )}

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>
              {t.expiresAt
                ? `Expires ${new Date(t.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : <span className="text-gray-300">—</span>
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TransactionCard);
