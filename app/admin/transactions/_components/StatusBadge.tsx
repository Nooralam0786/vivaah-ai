'use client';

import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" /> Active
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  }
  if (status === 'cancelled' || status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
        <XCircle className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }
  return null;
}
