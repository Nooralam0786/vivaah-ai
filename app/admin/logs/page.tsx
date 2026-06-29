'use client';

import { useState } from 'react';
import { Activity, UserPlus, LogIn, Crown, ShieldCheck, Heart, FileText, AlertTriangle } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'register' | 'login' | 'upgrade' | 'verify' | 'match' | 'post' | 'warning';
  actor: string;
  action: string;
  detail: string;
  ip: string;
  ts: string;
}

const LOGS: LogEntry[] = [
  { id: '1',  type: 'register', actor: 'Priya Sharma',       action: 'New Registration',      detail: 'User signed up via phone OTP',           ip: '103.21.45.12',  ts: '2026-06-29 14:32:11' },
  { id: '2',  type: 'login',    actor: 'Rohit Verma',        action: 'User Login',             detail: 'Login from Chrome on Windows',           ip: '49.36.78.201',  ts: '2026-06-29 14:28:05' },
  { id: '3',  type: 'upgrade',  actor: 'Neha Gupta',         action: 'Plan Upgrade',           detail: 'Upgraded from Free → Diamond (₹1,499)', ip: '106.51.22.88',  ts: '2026-06-29 14:15:43' },
  { id: '4',  type: 'verify',   actor: 'arun@techotd.com',   action: 'Profile Verified',       detail: 'Admin approved Arjun Mehta\'s ID proof', ip: '192.168.1.5',   ts: '2026-06-29 13:58:30' },
  { id: '5',  type: 'match',    actor: 'System (AI)',        action: 'Match Created',          detail: 'Ananya Singh ↔ Karan Patel matched',     ip: '—',             ts: '2026-06-29 13:45:00' },
  { id: '6',  type: 'login',    actor: 'Pooja Reddy',        action: 'User Login',             detail: 'Login from Safari on iPhone',            ip: '117.99.34.66',  ts: '2026-06-29 13:30:22' },
  { id: '7',  type: 'upgrade',  actor: 'Sameer Joshi',       action: 'Plan Upgrade',           detail: 'Upgraded from Free → Gold (₹499)',      ip: '45.112.89.10',  ts: '2026-06-29 13:12:07' },
  { id: '8',  type: 'post',     actor: 'arun@techotd.com',   action: 'Blog Post Published',    detail: '"AI in Indian Matchmaking – 2026"',      ip: '192.168.1.5',   ts: '2026-06-29 12:55:18' },
  { id: '9',  type: 'register', actor: 'Divya Menon',        action: 'New Registration',       detail: 'User signed up via Google OAuth',        ip: '59.88.102.34',  ts: '2026-06-29 12:40:55' },
  { id: '10', type: 'warning',  actor: 'System',             action: 'Rate Limit Warning',     detail: '5 failed OTP attempts from same IP',     ip: '185.234.99.1',  ts: '2026-06-29 12:22:33' },
  { id: '11', type: 'verify',   actor: 'arun@techotd.com',   action: 'Profile Verified',       detail: 'Admin approved Meera Kapoor\'s Aadhaar', ip: '192.168.1.5',   ts: '2026-06-29 11:58:41' },
  { id: '12', type: 'login',    actor: 'Vikram Singh',       action: 'User Login',             detail: 'Login from Edge on MacOS',               ip: '103.56.78.99',  ts: '2026-06-29 11:42:10' },
  { id: '13', type: 'upgrade',  actor: 'Ritu Agarwal',       action: 'Plan Upgrade',           detail: 'Upgraded from Gold → Platinum (₹999)',  ip: '49.205.44.12',  ts: '2026-06-29 11:25:00' },
  { id: '14', type: 'match',    actor: 'System (AI)',        action: 'Match Created',          detail: 'Siddharth Rao ↔ Kavitha Nair matched',  ip: '—',             ts: '2026-06-29 10:58:22' },
  { id: '15', type: 'register', actor: 'Amit Chauhan',       action: 'New Registration',       detail: 'User signed up via phone OTP',           ip: '117.204.65.88', ts: '2026-06-29 10:33:45' },
  { id: '16', type: 'login',    actor: 'arun@techotd.com',   action: 'Admin Login',            detail: 'Admin login from Admin Panel',           ip: '192.168.1.5',   ts: '2026-06-29 09:00:00' },
  { id: '17', type: 'warning',  actor: 'System',             action: 'Unusual Activity',       detail: 'Multiple logins from different regions', ip: '203.78.12.55',  ts: '2026-06-28 22:14:09' },
  { id: '18', type: 'post',     actor: 'arun@techotd.com',   action: 'Success Story Added',    detail: 'New story: "Our VivaahAI Journey"',      ip: '192.168.1.5',   ts: '2026-06-28 18:30:00' },
  { id: '19', type: 'upgrade',  actor: 'Sunita Pillai',      action: 'Plan Upgrade',           detail: 'Upgraded from Free → Platinum (₹999)',  ip: '59.180.23.77',  ts: '2026-06-28 16:45:12' },
  { id: '20', type: 'register', actor: 'Harish Nair',        action: 'New Registration',       detail: 'User signed up via phone OTP',           ip: '103.22.11.44',  ts: '2026-06-28 14:20:33' },
];

const TYPE_META: Record<string, { Icon: React.ElementType; bg: string; text: string; badge: string }> = {
  register: { Icon: UserPlus,      bg: 'bg-blue-50',    text: 'text-blue-600',   badge: 'bg-blue-50 text-blue-600 border-blue-100'   },
  login:    { Icon: LogIn,         bg: 'bg-gray-100',   text: 'text-gray-600',   badge: 'bg-gray-100 text-gray-600 border-gray-200'  },
  upgrade:  { Icon: Crown,         bg: 'bg-amber-50',   text: 'text-amber-600',  badge: 'bg-amber-50 text-amber-600 border-amber-100'},
  verify:   { Icon: ShieldCheck,   bg: 'bg-green-50',   text: 'text-green-600',  badge: 'bg-green-50 text-green-600 border-green-100'},
  match:    { Icon: Heart,         bg: 'bg-rose-50',    text: 'text-rose-500',   badge: 'bg-rose-50 text-rose-500 border-rose-100'   },
  post:     { Icon: FileText,      bg: 'bg-purple-50',  text: 'text-purple-600', badge: 'bg-purple-50 text-purple-600 border-purple-100'},
  warning:  { Icon: AlertTriangle, bg: 'bg-orange-50',  text: 'text-orange-500', badge: 'bg-orange-50 text-orange-500 border-orange-100'},
};

const TYPE_LABELS: Record<string, string> = {
  register: 'Registration', login: 'Login', upgrade: 'Upgrade',
  verify: 'Verification', match: 'Match', post: 'Content', warning: 'Warning',
};

type FilterType = 'all' | LogEntry['type'];

export default function ActivityLogsPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? LOGS : LOGS.filter((l) => l.type === filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Audit trail of all platform events</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center">
          <Activity size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'register', 'login', 'upgrade', 'verify', 'match', 'post', 'warning'] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              filter === t
                ? 'bg-[#6B1B3D] text-white border-[#6B1B3D]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#6B1B3D]/40'
            }`}
          >
            {t === 'all' ? 'All Events' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Type', 'Actor', 'Action', 'Detail', 'IP Address', 'Timestamp'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((log) => {
                const meta = TYPE_META[log.type];
                const { Icon } = meta;
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-xl ${meta.bg} flex items-center justify-center`}>
                        <Icon size={14} className={meta.text} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-gray-800 max-w-32 truncate">{log.actor}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badge}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500 max-w-56 truncate">{log.detail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-400 font-mono">{log.ip}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500 whitespace-nowrap">{log.ts}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No log entries for this filter.</div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {LOGS.length} log entries (last 48 hours)</p>
          <button className="text-xs text-[#6B1B3D] font-semibold hover:underline">Export CSV</button>
        </div>
      </div>
    </div>
  );
}
