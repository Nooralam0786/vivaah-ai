'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, UserCheck, X, ShieldOff } from 'lucide-react';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string | null;
  onboardingStep: string;
  createdAt: string;
  photo: string | null;
  city: string | null;
  subscriptionTier: string;
}

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  if (photo && !err)
    return <img src={photo} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-xs font-bold">
      {name[0]?.toUpperCase()}
    </div>
  );
}

const token = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

export default function BlockedUsersPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [acting,  setActing]  = useState<string | null>(null);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchBlocked = useCallback(async (s: string) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '100' });
    if (s) params.set('search', s);
    const res  = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
    const json = await res.json();
    if (json.success) {
      const blocked = (json.data.users as AdminUser[]).filter((u) => u.onboardingStep === 'suspended');
      setUsers(blocked);
      setTotal(blocked.length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchBlocked(search), search ? 400 : 0);
    return () => clearTimeout(t);
  }, [search, fetchBlocked]);

  const reactivate = async (userId: string, name: string) => {
    if (!confirm(`Reactivate ${name}? They will be able to log in again.`)) return;
    setActing(userId);
    const res  = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ action: 'activate' }),
    });
    const json = await res.json();
    setActing(null);
    setToast({ msg: json.data?.message ?? json.error?.message ?? 'Done', ok: json.success });
    setTimeout(() => setToast(null), 3000);
    if (json.success) fetchBlocked(search);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blocked Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} suspended accounts</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
          <ShieldOff size={18} className="text-red-500" />
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['User', 'Contact', 'Plan', 'City', 'Suspended On', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                : users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.fullName} photo={u.photo} />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-32">{u.fullName}</p>
                            <p className="text-[10px] text-red-400 capitalize">Suspended</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600 truncate max-w-40">{u.email}</p>
                        <p className="text-[10px] text-gray-400">{u.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 capitalize">
                          {u.subscriptionTier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{u.city ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => reactivate(u.id, u.fullName)}
                          disabled={acting === u.id}
                          title="Reactivate"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 border border-emerald-200"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Reactivate
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && users.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UserCheck size={24} className="text-green-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No suspended users</p>
            <p className="text-xs text-gray-400 mt-1">All accounts are in good standing.</p>
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
