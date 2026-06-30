'use client';

import { memo } from 'react';
import { Crown } from 'lucide-react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { TIER_META } from './constants';
import type { Transaction } from './types';

function TransactionRow({ t }: { t: Transaction }) {
  const tm = TIER_META[t.tier] ?? TIER_META.free;
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={t.userName} photo={t.userPhoto} />
          <div>
            <p className="font-medium text-gray-900">{t.userName}</p>
            <p className="text-xs text-gray-400">{t.userEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tm.bg} ${tm.color}`}>
          <Crown className="w-3 h-3" /> {tm.label}
        </span>
      </td>
      <td className="px-4 py-3 font-semibold text-gray-900">
        {t.amount > 0 ? `₹${t.amount.toLocaleString('en-IN')}` : <span className="text-gray-400">Free</span>}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={t.status} />
      </td>
      <td className="px-4 py-3">
        {t.razorpayPaymentId
          ? <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{t.razorpayPaymentId}</code>
          : <span className="text-gray-300 text-xs">—</span>
        }
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {t.expiresAt
          ? new Date(t.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : <span className="text-gray-300">—</span>
        }
      </td>
    </tr>
  );
}

export default memo(TransactionRow);
