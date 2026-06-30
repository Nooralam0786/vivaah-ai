'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CreditCard, Crown, Search, ChevronLeft, ChevronRight, IndianRupee,
} from 'lucide-react';
import TransactionCard from './_components/TransactionCard';
import TransactionRow from './_components/TransactionRow';
import { TIER_META, STATUS_TABS } from './_components/constants';
import type { Transaction } from './_components/types';

const token = () => {
  try { return JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? ''; }
  catch { return ''; }
};

export default function AdminTransactionsPage() {
  const [txns, setTxns]             = useState<Transaction[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus]         = useState('');
  const [tier, setTier]             = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set('status', status);
      if (tier)   params.set('tier', tier);
      if (search) params.set('search', search);
      const res  = await fetch(`/api/admin/transactions?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
      const json = await res.json();
      if (json.success) {
        setTxns(json.data.transactions);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
        setTotalRevenue(json.data.totalRevenue);
      }
    } finally {
      setLoading(false);
    }
  }, [page, status, tier, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(); };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B1B3D]" /> Transactions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total subscriptions</p>
        </div>

        {/* Revenue card */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm w-full sm:w-auto">
          <div className="w-10 h-10 bg-[#6B1B3D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-5 h-5 text-[#6B1B3D]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Total Active Revenue</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        {/* Status tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setStatus(key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                status === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Tier filter */}
          <div className="flex gap-1.5 flex-wrap">
            {['', 'gold', 'platinum', 'diamond'].map((t) => {
              const m = TIER_META[t] ?? { label: 'All Plans', color: 'text-gray-700', bg: 'bg-white' };
              return (
                <button
                  key={t}
                  onClick={() => { setTier(t); setPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                    tier === t
                      ? `${m.bg} ${m.color} border-current ring-1 ring-current/20`
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t ? <Crown className="w-3.5 h-3.5" /> : null}
                  {t ? m.label : 'All Plans'}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or payment ID…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 w-full sm:w-72"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#6B1B3D] text-white rounded-xl text-sm font-medium hover:bg-[#5a1633] flex-shrink-0">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Loading / empty states */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center py-20 text-gray-400">Loading transactions…</div>
      ) : txns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <CreditCard className="w-10 h-10 opacity-30" />
          <p>No transactions found</p>
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {txns.map((t) => <TransactionCard key={t.id} t={t} />)}
          </div>

          {/* Table (desktop/tablet) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {txns.map((t) => <TransactionRow key={t.id} t={t} />)}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && txns.length > 0 && totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between flex-wrap gap-2 px-4 py-3">
          <p className="text-sm text-gray-500">Showing {txns.length} of {total} transactions</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
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
  );
}
