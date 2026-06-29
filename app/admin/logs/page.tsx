'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity, UserPlus, LogIn, Crown, ShieldCheck, Heart,
  ShieldOff, Trash2, Flag, XCircle, ChevronLeft, ChevronRight, Search,
} from 'lucide-react';

interface AuditLog {
  id:         string;
  actorId:    string | null;
  actorName:  string | null;
  action:     string;
  targetId:   string | null;
  targetName: string | null;
  meta:       string | null;
  ip:         string | null;
  createdAt:  string;
}

const ACTION_META: Record<string, { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  signup:           { label: 'New Registration',   Icon: UserPlus,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
  login:            { label: 'User Login',          Icon: LogIn,       color: 'text-blue-600',    bg: 'bg-blue-50'    },
  upgrade:          { label: 'Plan Upgrade',        Icon: Crown,       color: 'text-amber-600',   bg: 'bg-amber-50'   },
  verify:           { label: 'Profile Verified',    Icon: ShieldCheck, color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
  ban:              { label: 'User Suspended',      Icon: ShieldOff,   color: 'text-red-600',     bg: 'bg-red-50'     },
  unban:            { label: 'User Activated',      Icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  delete_user:      { label: 'User Deleted',        Icon: Trash2,      color: 'text-red-700',     bg: 'bg-red-50'     },
  report:           { label: 'Profile Reported',    Icon: Flag,        color: 'text-orange-600',  bg: 'bg-orange-50'  },
  report_actioned:  { label: 'Report Actioned',     Icon: ShieldOff,   color: 'text-red-600',     bg: 'bg-red-50'     },
  report_dismissed: { label: 'Report Dismissed',    Icon: XCircle,     color: 'text-gray-500',    bg: 'bg-gray-50'    },
  approve_story:    { label: 'Story Approved',      Icon: Heart,       color: 'text-pink-600',    bg: 'bg-pink-50'    },
  reject_story:     { label: 'Story Rejected',      Icon: XCircle,     color: 'text-gray-500',    bg: 'bg-gray-50'    },
};

const ACTION_FILTERS = [
  { key: '',              label: 'All Events'    },
  { key: 'signup',        label: 'Registrations' },
  { key: 'ban',           label: 'Suspensions'   },
  { key: 'verify',        label: 'Verifications' },
  { key: 'report',        label: 'Reports'       },
  { key: 'upgrade',       label: 'Upgrades'      },
  { key: 'delete_user',   label: 'Deletions'     },
];

const token = () => {
  try { return JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? ''; }
  catch { return ''; }
};

export default function AdminLogsPage() {
  const [logs, setLogs]             = useState<AuditLog[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction]         = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (action) params.set('action', action);
      if (search) params.set('search', search);
      const res  = await fetch(`/api/admin/logs?${params}`, { headers: { Authorization: `Bearer ${token()}` } });
      const json = await res.json();
      if (json.success) {
        setLogs(json.data.logs);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, action, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(); };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#6B1B3D]" /> Activity Logs
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Audit trail — {total.toLocaleString()} events recorded
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
            {ACTION_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setAction(key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  action === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or action…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 w-60"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#6B1B3D] text-white rounded-xl text-sm font-medium hover:bg-[#5a1633]">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Log entries */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Activity className="w-10 h-10 opacity-30" />
            <p>No activity logs yet</p>
            <p className="text-xs">Logs appear as users sign up, get suspended, verified, etc.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => {
              const meta = ACTION_META[log.action] ?? {
                label: log.action.replace(/_/g, ' '),
                Icon:  Activity,
                color: 'text-gray-500',
                bg:    'bg-gray-50',
              };
              const Icon = meta.Icon;

              let detail = '';
              if (log.action === 'signup' && log.actorName) detail = `${log.actorName} registered`;
              else if (log.targetName && log.actorName) detail = `${log.actorName} → ${log.targetName}`;
              else if (log.actorName) detail = log.actorName;
              else if (log.targetName) detail = log.targetName;

              let metaObj: Record<string, unknown> = {};
              try { if (log.meta) metaObj = JSON.parse(log.meta); } catch {}

              return (
                <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                      {detail && <span className="text-sm text-gray-600 truncate">{detail}</span>}
                      {metaObj.reason != null && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {String(metaObj.reason)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span>{new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      {log.ip && <span>IP: {log.ip}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages} ({total.toLocaleString()} total)</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
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
