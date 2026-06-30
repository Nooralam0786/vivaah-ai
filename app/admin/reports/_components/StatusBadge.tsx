'use client';

import { CheckCircle2, XCircle, Clock, ShieldOff } from 'lucide-react';

export default function StatusBadge({ status }: { status: string }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  }
  if (status === 'reviewed') {
    return (
      <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
      </span>
    );
  }
  if (status === 'actioned') {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
        <ShieldOff className="w-3.5 h-3.5" /> Actioned
      </span>
    );
  }
  if (status === 'dismissed') {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
        <XCircle className="w-3.5 h-3.5" /> Dismissed
      </span>
    );
  }
  return null;
}
