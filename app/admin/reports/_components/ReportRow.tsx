'use client';

import { memo } from 'react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { REASON_LABEL } from './constants';
import type { Report } from './types';

interface ReportRowProps {
  report: Report;
  onReview: (r: Report) => void;
  onDetails: (r: Report) => void;
}

function ReportRow({ report: r, onReview, onDetails }: ReportRowProps) {
  const rm = REASON_LABEL[r.reason] ?? { label: r.reason, color: 'text-gray-600 bg-gray-100 border-gray-200' };
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={r.reported.fullName} photo={r.reported.profile?.photo ?? null} />
          <div>
            <p className="font-medium text-gray-900">{r.reported.fullName}</p>
            <p className="text-xs text-gray-400">{r.reported.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-gray-700">{r.reporter.fullName}</p>
        <p className="text-xs text-gray-400">{r.reporter.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${rm.color}`}>
          {rm.label}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs">
        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={r.status} />
      </td>
      <td className="px-4 py-3">
        {r.status === 'pending' ? (
          <button
            onClick={() => onReview(r)}
            className="px-3 py-1.5 bg-[#6B1B3D] text-white text-xs font-medium rounded-lg hover:bg-[#5a1633] transition-colors"
          >
            Review
          </button>
        ) : (
          <button
            onClick={() => onDetails(r)}
            className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
        )}
      </td>
    </tr>
  );
}

export default memo(ReportRow);
