'use client';

import { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, ShieldX, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface VerificationRecord {
  id: string; userId: string; phoneVerified: boolean;
  idType: string | null; idNumber: string | null; idVerified: boolean;
  livenessStatus: string; fraudScore: number; overallStatus: string; createdAt: string;
  user: { id: string; fullName: string; email: string; phone: string; createdAt: string; profile?: { photo: string | null } | null };
}

const STATUS_TABS = [
  { key: 'unverified', label: 'Pending',  Icon: Clock,        cls: 'text-amber-500'   },
  { key: 'verified',   label: 'Approved', Icon: CheckCircle2, cls: 'text-emerald-500' },
  { key: 'rejected',   label: 'Rejected', Icon: XCircle,      cls: 'text-red-500'     },
];

function FraudBadge({ score }: { score: number }) {
  if (score >= 70) return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100">HIGH {score}</span>;
  if (score >= 40) return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-100">MED {score}</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">LOW {score}</span>;
}

function Avatar({ name, photo }: { name: string; photo?: string | null }) {
  const [err, setErr] = useState(false);
  if (photo && !err) return <img src={photo} alt={name} onError={() => setErr(true)} className="w-9 h-9 rounded-xl object-cover" />;
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">
      {name[0]?.toUpperCase()}
    </div>
  );
}

export default function AdminVerificationsPage() {
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('unverified');
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);

  const LIMIT      = 20;
  const totalPages = Math.ceil(total / LIMIT);
  const token      = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

  const fetchRecords = useCallback(async (pg: number, s: string) => {
    setLoading(true);
    const params = new URLSearchParams({ status: s, page: String(pg) });
    const res  = await fetch(`/api/admin/verifications?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
    const json = await res.json();
    if (json.success) { setRecords(json.data.verifications); setTotal(json.data.total); }
    setLoading(false);
  }, []);

  useEffect(() => { setPage(1); fetchRecords(1, status); }, [status, fetchRecords]);

  const doAction = async (userId: string, action: 'approve' | 'reject') => {
    setActing(userId);
    const res  = await fetch('/api/admin/verifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body:   JSON.stringify({ userId, action }),
    });
    const json = await res.json();
    setActing(null);
    setToast({ msg: json.data?.message ?? json.error?.message ?? 'Done', ok: json.success });
    setTimeout(() => setToast(null), 3000);
    if (json.success) fetchRecords(page, status);
  };

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-xl font-bold text-gray-900">Verifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review and approve identity verifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 items-center">
        {STATUS_TABS.map(({ key, label, Icon, cls }) => (
          <button key={key} onClick={() => setStatus(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              status === key
                ? 'bg-white text-gray-800 border-gray-200 shadow-sm'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/70'
            }`}>
            <Icon className={`w-4 h-4 ${status === key ? cls : 'text-gray-400'}`} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center text-xs text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
          {total.toLocaleString('en-IN')} records
        </div>
      </div>

      {/* Records */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-60" />
                  </div>
                </div>
              </div>
            ))
          : records.length === 0
          ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 font-medium">No {status} verifications</p>
              </div>
            )
          : records.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={rec.user.fullName} photo={rec.user.profile?.photo} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{rec.user.fullName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{rec.user.email} · {rec.user.phone}</p>
                      </div>
                      <FraudBadge score={rec.fraudScore} />
                    </div>

                    {/* Steps */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        { ok: rec.phoneVerified,               label: 'Phone',    sub: rec.phoneVerified ? 'Verified' : 'Pending'                      },
                        { ok: rec.idVerified,                  label: rec.idType ? rec.idType.replace('_', ' ').toUpperCase() : 'ID', sub: rec.idNumber ? `•••${rec.idNumber.slice(-4)}` : 'Not submitted' },
                        { ok: rec.livenessStatus === 'approved',label: 'Liveness', sub: rec.livenessStatus.replace('_', ' ')                           },
                      ].map(({ ok, label, sub }) => (
                        <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${ok ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                          {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> : <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                          <div>
                            <p className="text-[10px] font-semibold text-gray-600">{label}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400">
                        Submitted {new Date(rec.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>

                      {status === 'unverified' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => doAction(rec.userId, 'reject')} disabled={acting === rec.userId}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 border border-red-100">
                            <ShieldX className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button onClick={() => doAction(rec.userId, 'approve')} disabled={acting === rec.userId}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                        </div>
                      )}

                      {status !== 'unverified' && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {status === 'verified' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { const p = page - 1; setPage(p); fetchRecords(p, status); }} disabled={page === 1}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button onClick={() => { const p = page + 1; setPage(p); fetchRecords(p, status); }} disabled={page >= totalPages}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
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
