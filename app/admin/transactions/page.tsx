'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CreditCard, Crown, Search, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, IndianRupee,
} from 'lucide-react';

interface Transaction {
  id:                string;
  userId:            string;
  userName:          string;
  userEmail:         string;
  userPhone:         string;
  userPhoto:         string | null;
  userCity:          string | null;
  tier:              string;
  status:            string;
  amount:            number;
  razorpayOrderId:   string | null;
  razorpayPaymentId: string | null;
  startedAt:         string | null;
  expiresAt:         string | null;
  createdAt:         string;
}

const TIER_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  free:     { label: 'Free',     color: 'text-gray-500',   bg: 'bg-gray-100',   icon: '⚪' },
  gold:     { label: 'Gold',     color: 'text-amber-600',  bg: 'bg-amber-50',   icon: '🥇' },
  platinum: { label: 'Platinum', color: 'text-blue-600',   bg: 'bg-blue-50',    icon: '💎' },
  diamond:  { label: 'Diamond',  color: 'text-[#6B1B3D]',  bg: 'bg-rose-50',    icon: '🔮' },
};

const STATUS_TABS = [
  { key: '',            label: 'All'       },
  { key: 'active',      label: 'Active'    },
  { key: 'pending',     label: 'Pending'   },
  { key: 'cancelled',   label: 'Cancelled' },
  { key: 'failed',      label: 'Failed'    },
];

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return photo && !err
    ? <img src={photo} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover" />
    : (
      <div className="w-8 h-8 rounded-full bg-[#6B1B3D]/10 flex items-center justify-center text-[#6B1B3D] text-xs font-semibold">
        {initials}
      </div>
    );
}

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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#6B1B3D]" /> Transactions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total subscriptions</p>
        </div>

        {/* Revenue card */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
          <div className="w-10 h-10 bg-[#6B1B3D]/10 rounded-xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-[#6B1B3D]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Active Revenue</p>
            <p className="text-xl font-bold text-gray-900">
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
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or payment ID…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 w-72"
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
          <div className="flex items-center justify-center py-20 text-gray-400">Loading transactions…</div>
        ) : txns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <CreditCard className="w-10 h-10 opacity-30" />
            <p>No transactions found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
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
              {txns.map((t) => {
                const tm = TIER_META[t.tier] ?? TIER_META.free;
                return (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
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
                      {t.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                      {t.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {(t.status === 'cancelled' || t.status === 'failed') && (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      )}
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
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {txns.length} of {total} transactions</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
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
    </div>
  );
}
