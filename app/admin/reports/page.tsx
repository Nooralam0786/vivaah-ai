'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Flag, Search, ChevronLeft, ChevronRight,
} from 'lucide-react';
import ReportRow from './_components/ReportRow';
import ReviewModal from './_components/ReviewModal';
import { STATUS_TABS } from './_components/constants';
import type { Report } from './_components/types';

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

  const handleReview = useCallback((r: Report) => {
    setSelected(r); setReviewStatus('reviewed'); setAdminNotes(''); setBanUser(false);
  }, []);

  const handleDetails = useCallback((r: Report) => {
    setSelected(r); setReviewStatus(r.status as 'reviewed' | 'actioned' | 'dismissed'); setAdminNotes(r.adminNotes ?? ''); setBanUser(false);
  }, []);

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B1B3D]" /> User Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and action reports submitted by users</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full self-start sm:self-auto">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
            {STATUS_TABS.map(({ key, label, Icon, cls }) => (
              <button
                key={key}
                onClick={() => { setStatusFilter(key); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40 ${
                  statusFilter === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${statusFilter === key ? cls : ''}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                aria-label="Search reports by name or email"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 w-full sm:w-64"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#6B1B3D] text-white rounded-xl text-sm font-medium hover:bg-[#5a1633] flex-shrink-0">
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
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
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
              {reports.map((r) => (
                <ReportRow key={r.id} report={r} onReview={handleReview} onDetails={handleDetails} />
              ))}
            </tbody>
          </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {reports.length} of {total} reports</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <ReviewModal
          report={selected}
          reviewStatus={reviewStatus}
          setReviewStatus={setReviewStatus}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          banUser={banUser}
          setBanUser={setBanUser}
          submitting={submitting}
          onCancel={() => setSelected(null)}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}
