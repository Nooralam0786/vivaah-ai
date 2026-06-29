'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Flag, ShieldOff, Search, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, AlertTriangle, UserX,
} from 'lucide-react';

interface Report {
  id:          string;
  reporterId:  string;
  reportedId:  string;
  reason:      string;
  description: string | null;
  status:      string;
  adminNotes:  string | null;
  createdAt:   string;
  updatedAt:   string;
  reporter: { id: string; fullName: string; email: string; phone: string };
  reported: {
    id: string; fullName: string; email: string; phone: string;
    profile: { photo: string | null; city: string | null; isVerified: boolean } | null;
  };
}

const REASON_LABEL: Record<string, { label: string; color: string }> = {
  harassment:            { label: 'Harassment',           color: 'text-red-600 bg-red-50 border-red-200'    },
  fake_profile:          { label: 'Fake Profile',         color: 'text-orange-600 bg-orange-50 border-orange-200' },
  spam:                  { label: 'Spam',                 color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  inappropriate_photos:  { label: 'Inappropriate Photos', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  scam:                  { label: 'Scam',                 color: 'text-rose-700 bg-rose-50 border-rose-200'  },
  other:                 { label: 'Other',                color: 'text-gray-600 bg-gray-100 border-gray-200' },
};

const STATUS_TABS = [
  { key: '',          label: 'All',        Icon: Flag,         cls: 'text-gray-500'    },
  { key: 'pending',   label: 'Pending',    Icon: Clock,        cls: 'text-amber-500'   },
  { key: 'reviewed',  label: 'Reviewed',   Icon: CheckCircle2, cls: 'text-blue-500'    },
  { key: 'actioned',  label: 'Actioned',   Icon: ShieldOff,    cls: 'text-red-500'     },
  { key: 'dismissed', label: 'Dismissed',  Icon: XCircle,      cls: 'text-gray-400'    },
];

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return photo && !err
    ? <img src={photo} alt={name} onError={() => setErr(true)} className="w-9 h-9 rounded-full object-cover" />
    : (
      <div className="w-9 h-9 rounded-full bg-[#6B1B3D]/10 flex items-center justify-center text-[#6B1B3D] text-xs font-semibold">
        {initials}
      </div>
    );
}

const token = () => {
  try { return JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? ''; }
  catch { return ''; }
};

export default function AdminReportsPage() {
  const [reports, setReports]         = useState<Report[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);

  const [selected, setSelected]       = useState<Report | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'actioned' | 'dismissed'>('reviewed');
  const [adminNotes, setAdminNotes]   = useState('');
  const [banUser, setBanUser]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set('status', statusFilter);
      if (search)       params.set('search', search);
      const res  = await fetch(`/api/admin/reports?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
      const json = await res.json();
      if (json.success) {
        setReports(json.data.reports);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(); };

  const submitReview = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/reports/${selected.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body:    JSON.stringify({ status: reviewStatus, adminNotes, banUser }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected(null);
        setAdminNotes('');
        setBanUser(false);
        load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="w-6 h-6 text-[#6B1B3D]" /> User Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and action reports submitted by users</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {STATUS_TABS.map(({ key, label, Icon, cls }) => (
              <button
                key={key}
                onClick={() => { setStatusFilter(key); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${statusFilter === key ? cls : ''}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 w-64"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#6B1B3D] text-white rounded-xl text-sm font-medium hover:bg-[#5a1633]">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Flag className="w-10 h-10 opacity-30" />
            <p>No reports found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reported User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reporter</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((r) => {
                const rm = REASON_LABEL[r.reason] ?? { label: r.reason, color: 'text-gray-600 bg-gray-100 border-gray-200' };
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
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
                      {r.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {r.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                        </span>
                      )}
                      {r.status === 'actioned' && (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                          <ShieldOff className="w-3.5 h-3.5" /> Actioned
                        </span>
                      )}
                      {r.status === 'dismissed' && (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Dismissed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending' ? (
                        <button
                          onClick={() => { setSelected(r); setReviewStatus('reviewed'); setAdminNotes(''); setBanUser(false); }}
                          className="px-3 py-1.5 bg-[#6B1B3D] text-white text-xs font-medium rounded-lg hover:bg-[#5a1633] transition-colors"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => { setSelected(r); setReviewStatus(r.status as typeof reviewStatus); setAdminNotes(r.adminNotes ?? ''); setBanUser(false); }}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {reports.length} of {total} reports</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
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
              <div className="grid grid-cols-2 gap-3 text-sm">
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
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#6B1B3D] text-white rounded-xl text-sm font-semibold hover:bg-[#5a1633] disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Save Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
