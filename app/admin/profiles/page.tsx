'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, X, MapPin, Briefcase, User } from 'lucide-react';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  gender: string | null;
  onboardingStep: string;
  createdAt: string;
  photo: string | null;
  city: string | null;
  occupation: string | null;
  isVerified: boolean;
  subscriptionTier: string;
}

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  if (photo && !err)
    return <img src={photo} alt={name} onError={() => setErr(true)} className="w-10 h-10 rounded-full object-cover" />;
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">
      {name[0]?.toUpperCase()}
    </div>
  );
}

const token = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

export default function ProfilesPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const LIMIT      = 20;
  const totalPages = Math.ceil(total / LIMIT);

  const fetchUsers = useCallback(async (pg: number, s: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT) });
    if (s) params.set('search', s);
    const res  = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
    const json = await res.json();
    if (json.success) { setUsers(json.data.users); setTotal(json.data.total); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(1, search); }, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profiles</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString('en-IN')} user profiles</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center">
          <User size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text" placeholder="Search by name or email…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#6B1B3D]/50 transition-colors shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Profile cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))
          : users.map((u) => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <Avatar name={u.fullName} photo={u.photo} />
                    {u.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white text-white text-[8px] font-bold">✓</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.fullName}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{u.gender ?? 'Not specified'}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {u.city && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{u.city}</span>
                    </div>
                  )}
                  {u.occupation && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{u.occupation}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    u.onboardingStep === 'complete'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {u.onboardingStep === 'complete' ? 'Complete' : 'Incomplete'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
      </div>

      {!loading && users.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">No profiles found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-500">{((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => { const p = page - 1; setPage(p); fetchUsers(p, search); }} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              ← Prev
            </button>
            <span className="text-xs text-gray-500 px-2">{page}/{totalPages}</span>
            <button onClick={() => { const p = page + 1; setPage(p); fetchUsers(p, search); }} disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
