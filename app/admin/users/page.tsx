'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import UserCard from './_components/UserCard';
import UserRow from './_components/UserRow';
import type { AdminUser } from './_components/types';

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<AdminUser[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [tier,     setTier]     = useState('');
  const [verified, setVerified] = useState('');
  const [acting,   setActing]   = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; ok: boolean } | null>(null);

  const LIMIT      = 20;
  const totalPages = Math.ceil(total / LIMIT);
  const token      = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

  const fetchUsers = useCallback(async (pg: number, s: string, t: string, v: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT) });
    if (s) params.set('search', s);
    if (t) params.set('tier', t);
    if (v) params.set('verified', v);
    const res  = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
    const json = await res.json();
    if (json.success) { setUsers(json.data.users); setTotal(json.data.total); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(1, search, tier, verified); }, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [search, tier, verified, fetchUsers]);

  const doAction = useCallback(async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    setActing(userId);
    const res  = await fetch(`/api/admin/users/${userId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body:    JSON.stringify({ action }),
    });
    const json = await res.json();
    setActing(null);
    setToast({ msg: json.data?.message ?? json.error?.message ?? 'Done', ok: json.success });
    setTimeout(() => setToast(null), 3000);
    if (json.success) fetchUsers(page, search, tier, verified);
  }, [page, search, tier, verified, fetchUsers]);

  const handleSuspend  = useCallback((id: string) => doAction(id, 'suspend'), [doAction]);
  const handleActivate = useCallback((id: string) => doAction(id, 'activate'), [doAction]);
  const handleDelete   = useCallback((id: string, name: string) => {
    if (confirm(`Delete ${name}? This cannot be undone.`)) doAction(id, 'delete');
  }, [doAction]);

  const goPrevPage = useCallback(() => { const p = page - 1; setPage(p); fetchUsers(p, search, tier, verified); }, [page, search, tier, verified, fetchUsers]);
  const goNextPage = useCallback(() => { const p = page + 1; setPage(p); fetchUsers(p, search, tier, verified); }, [page, search, tier, verified, fetchUsers]);

  const rangeStart = useMemo(() => ((page - 1) * LIMIT) + 1, [page]);
  const rangeEnd   = useMemo(() => Math.min(page * LIMIT, total), [page, total]);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString('en-IN')} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search name, email, phone…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#6B1B3D]/50 transition-colors shadow-sm"
          />
          {search && <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40 rounded"><X className="w-3.5 h-3.5" /></button>}
        </div>

        <select value={tier} onChange={(e) => setTier(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 outline-none focus:border-[#6B1B3D]/50 transition-colors shadow-sm">
          <option value="">All Tiers</option>
          <option value="free">Free</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
          <option value="diamond">Diamond</option>
        </select>

        <select value={verified} onChange={(e) => setVerified(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 outline-none focus:border-[#6B1B3D]/50 transition-colors shadow-sm">
          <option value="">All Users</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        {(tier || verified) && (
          <button onClick={() => { setTier(''); setVerified(''); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200">
            <Filter className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 animate-pulse space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          : users.map((u) => (
              <UserCard key={u.id} user={u} acting={acting} onSuspend={handleSuspend} onActivate={handleActivate} onDelete={handleDelete} />
            ))}
        {!loading && users.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">No users found</div>
        )}
      </div>

      {/* Table (desktop/tablet) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                {['User', 'Contact', 'Plan', 'Status', 'Activity', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                : users.map((u) => (
                    <UserRow key={u.id} user={u} acting={acting} onSuspend={handleSuspend} onActivate={handleActivate} onDelete={handleDelete} />
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-16 text-gray-400">No users found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">
            {rangeStart}–{rangeEnd} of {total.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={goPrevPage} disabled={page === 1} aria-label="Previous page"
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 px-2">{page}/{totalPages}</span>
            <button onClick={goNextPage} disabled={page >= totalPages} aria-label="Next page"
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl border ${toast.ok ? 'bg-white text-emerald-700 border-emerald-200' : 'bg-white text-red-600 border-red-200'}`}>
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </div>
  );
}
