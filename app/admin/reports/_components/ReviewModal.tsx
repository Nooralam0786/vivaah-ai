'use client';

import { AlertTriangle, UserX } from 'lucide-react';
import Avatar from './Avatar';
import { REASON_LABEL } from './constants';
import type { Report } from './types';

type ReviewStatus = 'reviewed' | 'actioned' | 'dismissed';

interface ReviewModalProps {
  report: Report;
  reviewStatus: ReviewStatus;
  setReviewStatus: (s: ReviewStatus) => void;
  adminNotes: string;
  setAdminNotes: (v: string) => void;
  banUser: boolean;
  setBanUser: (v: boolean) => void;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ReviewModal({
  report: selected,
  reviewStatus,
  setReviewStatus,
  adminNotes,
  setAdminNotes,
  banUser,
  setBanUser,
  submitting,
  onCancel,
  onSubmit,
}: ReviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Review Report
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {/* Reported user */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Avatar name={selected.reported.fullName} photo={selected.reported.profile?.photo ?? null} />
            <div>
              <p className="font-medium text-gray-900">{selected.reported.fullName}</p>
              <p className="text-xs text-gray-500">{selected.reported.email}</p>
              {selected.reported.profile?.city && (
                <p className="text-xs text-gray-400">{selected.reported.profile.city}</p>
              )}
            </div>
          </div>

          {/* Report details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Reported By</p>
              <p className="font-medium text-gray-800">{selected.reporter.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Reason</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${(REASON_LABEL[selected.reason] ?? { color: 'text-gray-600 bg-gray-100 border-gray-200' }).color}`}>
                {(REASON_LABEL[selected.reason] ?? { label: selected.reason }).label}
              </span>
            </div>
          </div>

          {selected.description && (
            <div>
              <p className="text-xs text-gray-400 mb-1">User's Description</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selected.description}</p>
            </div>
          )}

          {/* Resolution */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Resolution</p>
            <div className="flex gap-2">
              {(['reviewed', 'actioned', 'dismissed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setReviewStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    reviewStatus === s
                      ? s === 'actioned' ? 'bg-red-500 text-white border-red-500'
                        : s === 'dismissed' ? 'bg-gray-200 text-gray-700 border-gray-300'
                        : 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Admin Notes (optional)</p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes about this report…"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20"
            />
          </div>

          {/* Ban user option — only for actioned */}
          {reviewStatus === 'actioned' && (
            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-red-100 bg-red-50">
              <input
                type="checkbox"
                checked={banUser}
                onChange={(e) => setBanUser(e.target.checked)}
                className="w-4 h-4 accent-red-500"
              />
              <div>
                <p className="text-sm font-medium text-red-700 flex items-center gap-1.5">
                  <UserX className="w-4 h-4" /> Also suspend reported user
                </p>
                <p className="text-xs text-red-400">Account will be suspended immediately</p>
              </div>
            </label>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-[#6B1B3D] text-white rounded-xl text-sm font-semibold hover:bg-[#5a1633] disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save Decision'}
          </button>
        </div>
      </div>
    </div>
  );
}
