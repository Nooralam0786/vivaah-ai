'use client';

import { useEffect, useState } from 'react';
import {
  Users, Heart, MessageSquare, ShieldCheck,
  IndianRupee, UserPlus, ArrowUpRight, CheckCircle2,
  Clock, XCircle, Zap, Star, MapPin, Circle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ─── Types ──────────────────────────────────────────────────── */
interface Stats {
  kpis: {
    totalUsers: number; activeUsers: number; newUsers7d: number;
    totalMatches: number; mutualMatches: number; totalLikes: number;
    pendingVerifications: number; totalSubscriptions: number;
  };
  charts: {
    registrations:         { label: string; count: number }[];
    dailyLikes:            { label: string; count: number }[];
    tierBreakdown:         { tier: string; count: number }[];
    genderBreakdown:       { gender: string; count: number }[];
    verificationBreakdown: { status: string; label: string; count: number }[];
  };
}

/* ─── Static supplemental data ───────────────────────────────── */
const MOCK_PREMIUM = [
  { name: 'Ananya Singh', email: 'ananya.singh@email.com', ago: '2 min ago',  online: true  },
  { name: 'Rohit Verma',  email: 'rohit.verma@email.com',  ago: '8 min ago',  online: false },
  { name: 'Neha Gupta',   email: 'neha.gupta@email.com',   ago: '15 min ago', online: true  },
  { name: 'Arjun Mehta',  email: 'arjun.mehta@email.com',  ago: '22 min ago', online: false },
  { name: 'Pooja Sharma', email: 'pooja.sharma@email.com', ago: '30 min ago', online: false },
];

const MOCK_ACTIVITIES = [
  { Icon: UserPlus,     color: 'bg-blue-100 text-blue-600',    text: 'New user registered',      sub: 'Rahul Verma has joined VivaahAI',     ago: '2 min ago'  },
  { Icon: Star,         color: 'bg-amber-100 text-amber-600',  text: 'New premium subscription', sub: 'Neha Gupta upgraded to Premium Plan',  ago: '10 min ago' },
  { Icon: Heart,        color: 'bg-rose-100 text-rose-600',    text: 'New match created',        sub: 'Ananya & Rohit matched',               ago: '15 min ago' },
  { Icon: IndianRupee,  color: 'bg-green-100 text-green-600',  text: 'Payment received',         sub: '₹1,499 received from Arjun Mehta',    ago: '22 min ago' },
  { Icon: ShieldCheck,  color: 'bg-purple-100 text-purple-600',text: 'Profile verified',         sub: "Pooja Sharma's profile verified",       ago: '28 min ago' },
  { Icon: Zap,          color: 'bg-orange-100 text-orange-600',text: 'Blog post published',      sub: '"How AI is Transforming Matchmaking"',  ago: '35 min ago' },
];

const MOCK_LOCATIONS = [
  { city: 'Delhi',     users: 8745 },
  { city: 'Mumbai',    users: 6242 },
  { city: 'Bangalore', users: 5320 },
  { city: 'Pune',      users: 3982 },
  { city: 'Hyderabad', users: 2845 },
];

const SYSTEM_STATUS = [
  { label: 'Website Status',     desc: 'All systems operational'  },
  { label: 'AI Matching Engine', desc: 'Matching perfectly'       },
  { label: 'Payment Gateway',    desc: 'All transactions normal'  },
  { label: 'Email Service',      desc: 'All emails delivered'     },
  { label: 'Database',           desc: 'All systems normal'       },
];

const MATCH_BREAKDOWN = [
  { name: 'Successful',      pct: 12.0, color: '#10b981' },
  { name: 'In Conversation', pct: 38.1, color: '#6B1B3D' },
  { name: 'Meetings Fixed',  pct: 13.2, color: '#D4AF37' },
  { name: 'Marriages',       pct: 13.1, color: '#f59e0b' },
  { name: 'Not Interested',  pct: 23.5, color: '#e5e7eb' },
];

const GENDER_COLORS = ['#6B1B3D', '#D4AF37', '#9ca3af'];

/* ─── Sparkline ──────────────────────────────────────────────── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1;
  const W = 90, H = 34;
  const pts = values
    .map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${(H - 4 - ((v - min) / range) * (H - 8)).toFixed(1)}`)
    .join(' ');
  const uid = color.replace(/[^a-z0-9]/gi, '');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={`sp${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0}    />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#sp${uid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────── */
interface KPIProps {
  label: string; value: string; change: string;
  Icon: React.ElementType; iconBg: string; iconColor: string;
  sparkValues: number[]; sparkColor: string;
}
function KPICard({ label, value, change, Icon, iconBg, iconColor, sparkValues, sparkColor }: KPIProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1">
          <ArrowUpRight size={13} className="text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-600">{change}</span>
          <span className="text-[11px] text-gray-400 ml-0.5">vs last week</span>
        </div>
        <Sparkline values={sparkValues} color={sparkColor} />
      </div>
    </div>
  );
}

/* ─── Tooltip ────────────────────────────────────────────────── */
function LightTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value.toLocaleString('en-IN')}</span></p>
      ))}
    </div>
  );
}

/* ─── Card wrapper ───────────────────────────────────────────── */
function Card({ title, subtitle, action, children, className = '' }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

/* ─── Window toggle ──────────────────────────────────────────── */
function WindowToggle({ value, onChange }: { value: 7 | 30; onChange: (v: 7 | 30) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {([7, 30] as const).map((w) => (
        <button key={w} onClick={() => onChange(w)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${value === w ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
          {w === 7 ? 'This Week' : 'This Month'}
        </button>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [window7, setWindow7] = useState<7 | 30>(7);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const token = (() => { try { return JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken; } catch { return null; } })();
    if (!token) { setLoading(false); return; }
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((j) => { if (j.success) setStats(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis   = stats?.kpis;
  const charts = stats?.charts;

  const genSpark = (seed: number) =>
    Array.from({ length: 10 }, (_, i) => seed * (0.7 + (i / 10) * 0.5 + Math.sin(i + seed) * 0.05));

  const kpiCards: KPIProps[] = [
    { label: 'Total Users',       value: kpis?.totalUsers       != null ? kpis.totalUsers.toLocaleString('en-IN')       : '—', change: '18.6%', Icon: Users,        iconBg: 'bg-rose-50',    iconColor: 'text-rose-500',    sparkColor: '#f43f5e', sparkValues: genSpark(52)                               },
    { label: 'New Registrations', value: kpis?.newUsers7d       != null ? kpis.newUsers7d.toLocaleString('en-IN')        : '—', change: '12.4%', Icon: UserPlus,     iconBg: 'bg-orange-50',  iconColor: 'text-orange-500',  sparkColor: '#f97316', sparkValues: charts?.registrations.map((r) => r.count) ?? genSpark(3) },
    { label: 'Total Matches',     value: kpis?.totalMatches     != null ? kpis.totalMatches.toLocaleString('en-IN')      : '—', change: '20.3%', Icon: Heart,        iconBg: 'bg-pink-50',    iconColor: 'text-pink-500',    sparkColor: '#6B1B3D', sparkValues: genSpark(8)                               },
    { label: 'Messages Sent',     value: '24,105',                                                       change: '15.7%', Icon: MessageSquare,iconBg: 'bg-blue-50',          iconColor: 'text-blue-500',    sparkColor: '#3b82f6', sparkValues: genSpark(24)                              },
    { label: 'Verified Profiles', value: kpis?.totalSubscriptions != null ? kpis.totalSubscriptions.toLocaleString('en-IN') : '—', change: '16.8%', Icon: ShieldCheck,  iconBg: 'bg-emerald-50',       iconColor: 'text-emerald-500', sparkColor: '#10b981', sparkValues: genSpark(38)                              },
    { label: 'Total Revenue',     value: '₹18,75,320',                                                   change: '22.5%', Icon: IndianRupee,  iconBg: 'bg-[#6B1B3D]/10',    iconColor: 'text-[#6B1B3D]',  sparkColor: '#6B1B3D', sparkValues: genSpark(18)                              },
  ];

  const days     = window7 === 7 ? 7 : 30;
  const regData  = (charts?.registrations ?? []).slice(-days);
  const likeData = (charts?.dailyLikes    ?? []).slice(-days);

  const genderData = (charts?.genderBreakdown ?? []).map((g) => ({
    name:  g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: g.count,
  }));
  const totalUsers   = genderData.reduce((s, g) => s + g.value, 0) || kpis?.totalUsers || 0;
  const totalMatches = kpis?.totalMatches ?? 0;

  const maxLoc = Math.max(...MOCK_LOCATIONS.map((l) => l.users));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#6B1B3D]/30 border-t-[#6B1B3D] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* ── Row 1: User Growth | Demographics | Premium Members ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* User Growth */}
        <div className="lg:col-span-5">
          <Card title="User Growth Overview" action={<WindowToggle value={window7} onChange={setWindow7} />}>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-[#6B1B3D] inline-block rounded-full" /> This Week</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-px border-t border-dashed border-[#D4AF37] inline-block" /> Last Week</span>
            </div>
            {mounted ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={regData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6B1B3D" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6B1B3D" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<LightTooltip />} />
                  <Area type="monotone" dataKey="count" name="Registrations" stroke="#6B1B3D" fill="url(#ugGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-48 animate-pulse bg-gray-100 rounded-xl" />}
          </Card>
        </div>

        {/* User Demographics */}
        <div className="lg:col-span-3">
          <Card title="User Demographics" subtitle="All registered users">
            {mounted && genderData.length > 0 ? (
              <div className="relative">
                <ResponsiveContainer width="100%" height={175}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3}>
                      {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number, n: string) => [v.toLocaleString('en-IN'), n]} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-gray-900">{totalUsers.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400">Total Users</p>
                  </div>
                </div>
              </div>
            ) : <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />}
            <div className="mt-2 space-y-1.5">
              {genderData.map((g, i) => (
                <div key={g.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: GENDER_COLORS[i] }} />
                    <span className="text-xs text-gray-600">{g.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {totalUsers > 0 ? `${((g.value / totalUsers) * 100).toFixed(1)}%` : '—'}
                    <span className="text-gray-400 font-normal ml-1">({g.value.toLocaleString('en-IN')})</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Premium Members */}
        <div className="lg:col-span-4">
          <Card title="Recent Premium Members" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
            <div className="space-y-3">
              {MOCK_PREMIUM.map((m) => (
                <div key={m.email} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">
                      {m.name[0]}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{m.ago}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 border border-[#6B1B3D] text-[#6B1B3D] rounded-xl text-xs font-semibold hover:bg-[#6B1B3D]/5 transition-colors">
              View All Premium Members
            </button>
          </Card>
        </div>
      </div>

      {/* ── Row 2: Matches Overview | Revenue | Verification Requests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Matches Overview */}
        <div className="lg:col-span-4">
          <Card title="Matches Overview" action={<WindowToggle value={window7} onChange={setWindow7} />}>
            {mounted ? (
              <div className="relative">
                <ResponsiveContainer width="100%" height={175}>
                  <PieChart>
                    <Pie
                      data={MATCH_BREAKDOWN.map((m) => ({ ...m, value: Math.round((m.pct / 100) * (totalMatches || 100)) }))}
                      dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={2}
                    >
                      {MATCH_BREAKDOWN.map((m) => <Cell key={m.name} fill={m.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number, n: string) => [v.toLocaleString('en-IN'), n]} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-gray-900">{totalMatches.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400">Total Matches</p>
                  </div>
                </div>
              </div>
            ) : <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />}
            <div className="mt-3 space-y-1.5">
              {MATCH_BREAKDOWN.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                    <span className="text-gray-600">{m.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {Math.round((m.pct / 100) * totalMatches).toLocaleString('en-IN')}
                    <span className="text-gray-400 font-normal ml-1">({m.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue Overview */}
        <div className="lg:col-span-4">
          <Card title="Revenue Overview" subtitle="₹18,75,320  ·  +22.5% vs last week" action={<WindowToggle value={window7} onChange={setWindow7} />}>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={likeData.length ? likeData : Array.from({ length: 7 }, (_, i) => ({ label: `D${i + 1}`, count: Math.round(Math.random() * 50 + 10) }))} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<LightTooltip />} />
                  <Bar dataKey="count" name="Activity" fill="#6B1B3D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-52 animate-pulse bg-gray-100 rounded-xl" />}
          </Card>
        </div>

        {/* Verification Requests */}
        <div className="lg:col-span-4">
          <Card title="Verification Requests" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
            {stats ? (
              <div>
                <div className="space-y-3">
                  {stats.charts.verificationBreakdown.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No verification requests yet</p>
                  ) : stats.charts.verificationBreakdown.map((v, i) => {
                    const meta = [
                      { Icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600' },
                      { Icon: Clock,        bg: 'bg-amber-50',   text: 'text-amber-600',   badge: 'bg-amber-50 text-amber-600'    },
                      { Icon: XCircle,      bg: 'bg-red-50',     text: 'text-red-500',     badge: 'bg-red-50 text-red-600'        },
                    ][i % 3];
                    const { Icon: VIcon } = meta;
                    return (
                      <div key={v.status} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                          <VIcon size={16} className={meta.text} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800">{v.label}</p>
                          <p className="text-[10px] text-gray-400">{v.count.toLocaleString('en-IN')} records</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>{v.count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 rounded-xl py-3">
                    <p className="text-xl font-extrabold text-gray-900">{kpis?.pendingVerifications ?? 0}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Pending</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl py-3">
                    <p className="text-xl font-extrabold text-gray-900">{kpis?.totalSubscriptions ?? 0}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Paid Members</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 animate-pulse bg-gray-100 rounded-xl" />)}</div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Row 3: Activities | Top Locations | System Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Recent Activities */}
        <div className="lg:col-span-6">
          <Card title="Recent Activities" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_ACTIVITIES.map((a, i) => {
                const { Icon: AIcon } = a;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <AIcon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{a.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{a.sub}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{a.ago}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Top Performing Locations */}
        <div className="lg:col-span-3">
          <Card title="Top Performing Locations" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
            <div className="space-y-4">
              {MOCK_LOCATIONS.map((loc) => {
                const pct = Math.round((loc.users / maxLoc) * 100);
                return (
                  <div key={loc.city}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#6B1B3D] flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-700">{loc.city}</span>
                      </div>
                      <span className="text-xs text-gray-500">{loc.users.toLocaleString('en-IN')} Users</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6B1B3D, #9B2D5F)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <div className="lg:col-span-3">
          <Card title="System Status">
            <div className="space-y-3">
              {SYSTEM_STATUS.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Circle size={9} fill="#10b981" stroke="#10b981" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{s.label}</p>
                    <p className="text-[10px] text-gray-400">{s.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full whitespace-nowrap">Operational</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-gray-400">All systems operating normally</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
