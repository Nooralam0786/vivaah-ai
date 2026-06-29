'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ShieldCheck, Crown, X, UserX, UserCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminUser {
  id: string; fullName: string; email: string; phone: string;
  gender: string | null; onboardingStep: string; createdAt: string;
  photo: string | null; city: string | null; occupation: string | null;
  isVerified: boolean; subscriptionTier: string;
  verificationStatus: string; likesGiven: number; likesReceived: number;
}

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  free:     { label: 'Free',     cls: 'bg-gray-100 text-gray-500 border border-gray-200'      },
  gold:     { label: 'Gold',     cls: 'bg-amber-50 text-amber-600 border border-amber-200'    },
  platinum: { label: 'Platinum', cls: 'bg-blue-50 text-blue-600 border border-blue-200'       },
  diamond:  { label: 'Diamond',  cls: 'bg-rose-50 text-[#6B1B3D] border border-rose-200'     },
};

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  if (photo && !err) return <img src={photo} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-xs font-bold">
      {name[0]?.toUpperCase()}
    </div>
  );
}

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

  const doAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
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
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
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
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
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
                : users.map((u) => {
                    const tierInfo   = TIER_BADGE[u.subscriptionTier] ?? TIER_BADGE.free;
                    const isSuspended = u.onboardingStep === 'suspended';
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <Avatar name={u.fullName} photo={u.photo} />
                              {u.isVerified && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <ShieldCheck className="w-2 h-2 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 truncate max-w-32">{u.fullName}</p>
                              <p className="text-[10px] text-gray-400 capitalize">{u.gender ?? '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-600 truncate max-w-40">{u.email}</p>
                          <p className="text-[10px] text-gray-400">{u.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tierInfo.cls}`}>
                            {u.subscriptionTier !== 'free' && <Crown className="w-2.5 h-2.5" />}
                            {tierInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isSuspended
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : u.onboardingStep === 'complete'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {isSuspended ? 'Suspended' : u.onboardingStep === 'complete' ? 'Active' : 'Onboarding'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-600">❤️ {u.likesGiven} given</p>
                          <p className="text-[10px] text-gray-400">{u.likesReceived} received</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {isSuspended ? (
                              <button onClick={() => doAction(u.id, 'activate')} disabled={acting === u.id} title="Activate"
                                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-emerald-200">
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button onClick={() => doAction(u.id, 'suspend')} disabled={acting === u.id} title="Suspend"
                                className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-amber-200">
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => { if (confirm(`Delete ${u.fullName}? This cannot be undone.`)) doAction(u.id, 'delete'); }}
                              disabled={acting === u.id} title="Delete"
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-red-200">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-16 text-gray-400">No users found</div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => { const p = page - 1; setPage(p); fetchUsers(p, search, tier, verified); }} disabled={page === 1}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 px-2">{page}/{totalPages}</span>
              <button onClick={() => { const p = page + 1; setPage(p); fetchUsers(p, search, tier, verified); }} disabled={page >= totalPages}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl border ${toast.ok ? 'bg-white text-emerald-700 border-emerald-200' : 'bg-white text-red-600 border-red-200'}`}>
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </div>
  );
}
