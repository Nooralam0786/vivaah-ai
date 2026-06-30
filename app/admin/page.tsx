'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Users, Heart, MessageSquare, ShieldCheck, IndianRupee, UserPlus,
} from 'lucide-react';
import KPICard, { type KPIProps } from './_components/KPICard';
import PremiumMembersCard from './_components/PremiumMembersCard';
import VerificationRequestsCard from './_components/VerificationRequestsCard';
import ActivitiesCard from './_components/ActivitiesCard';
import TopLocationsCard from './_components/TopLocationsCard';
import SystemStatusCard from './_components/SystemStatusCard';
import type { Stats } from './_components/dashboardTypes';

/* Recharts-backed cards are code-split out of the initial admin bundle (recharts is large and only needed once charts paint). */
const chartCardSkeleton = <div className="h-72 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse" />;
const UserGrowthCard = dynamic(() => import('./_components/UserGrowthCard'), { loading: () => chartCardSkeleton, ssr: false });
const DemographicsCard = dynamic(() => import('./_components/DemographicsCard'), { loading: () => chartCardSkeleton, ssr: false });
const MatchesOverviewCard = dynamic(() => import('./_components/MatchesOverviewCard'), { loading: () => chartCardSkeleton, ssr: false });
const RevenueOverviewCard = dynamic(() => import('./_components/RevenueOverviewCard'), { loading: () => chartCardSkeleton, ssr: false });

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

  const kpiCards: KPIProps[] = useMemo(() => [
    { label: 'Total Users',       value: kpis?.totalUsers       != null ? kpis.totalUsers.toLocaleString('en-IN')       : '—', change: '18.6%', Icon: Users,        iconBg: 'bg-rose-50',    iconColor: 'text-rose-500',    sparkColor: '#f43f5e', sparkValues: genSpark(52)                               },
    { label: 'New Registrations', value: kpis?.newUsers7d       != null ? kpis.newUsers7d.toLocaleString('en-IN')        : '—', change: '12.4%', Icon: UserPlus,     iconBg: 'bg-orange-50',  iconColor: 'text-orange-500',  sparkColor: '#f97316', sparkValues: charts?.registrations.map((r) => r.count) ?? genSpark(3) },
    { label: 'Total Matches',     value: kpis?.totalMatches     != null ? kpis.totalMatches.toLocaleString('en-IN')      : '—', change: '20.3%', Icon: Heart,        iconBg: 'bg-pink-50',    iconColor: 'text-pink-500',    sparkColor: '#6B1B3D', sparkValues: genSpark(8)                               },
    { label: 'Messages Sent',     value: '24,105',                                                       change: '15.7%', Icon: MessageSquare,iconBg: 'bg-blue-50',          iconColor: 'text-blue-500',    sparkColor: '#3b82f6', sparkValues: genSpark(24)                              },
    { label: 'Verified Profiles', value: kpis?.totalSubscriptions != null ? kpis.totalSubscriptions.toLocaleString('en-IN') : '—', change: '16.8%', Icon: ShieldCheck,  iconBg: 'bg-emerald-50',       iconColor: 'text-emerald-500', sparkColor: '#10b981', sparkValues: genSpark(38)                              },
    { label: 'Total Revenue',     value: '₹18,75,320',                                                   change: '22.5%', Icon: IndianRupee,  iconBg: 'bg-[#6B1B3D]/10',    iconColor: 'text-[#6B1B3D]',  sparkColor: '#6B1B3D', sparkValues: genSpark(18)                              },
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- genSpark is a pure deterministic helper recreated each render; only kpis/charts affect output */
  ], [kpis, charts]);

  const days     = window7 === 7 ? 7 : 30;
  const regData  = useMemo(() => (charts?.registrations ?? []).slice(-days), [charts, days]);
  const likeData = useMemo(() => (charts?.dailyLikes    ?? []).slice(-days), [charts, days]);

  const genderData = useMemo(() => (charts?.genderBreakdown ?? []).map((g) => ({
    name:  g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: g.count,
  })), [charts]);
  const totalUsers   = genderData.reduce((s, g) => s + g.value, 0) || kpis?.totalUsers || 0;
  const totalMatches = kpis?.totalMatches ?? 0;

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
        <div className="lg:col-span-5">
          <UserGrowthCard mounted={mounted} window7={window7} onWindowChange={setWindow7} regData={regData} />
        </div>

        <div className="lg:col-span-3">
          <DemographicsCard mounted={mounted} genderData={genderData} totalUsers={totalUsers} />
        </div>

        <div className="lg:col-span-4">
          <PremiumMembersCard />
        </div>
      </div>

      {/* ── Row 2: Matches Overview | Revenue | Verification Requests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <MatchesOverviewCard mounted={mounted} window7={window7} onWindowChange={setWindow7} totalMatches={totalMatches} />
        </div>

        <div className="lg:col-span-4">
          <RevenueOverviewCard mounted={mounted} window7={window7} onWindowChange={setWindow7} likeData={likeData} />
        </div>

        <div className="lg:col-span-4">
          <VerificationRequestsCard
            stats={stats}
            pendingVerifications={kpis?.pendingVerifications ?? 0}
            totalSubscriptions={kpis?.totalSubscriptions ?? 0}
          />
        </div>
      </div>

      {/* ── Row 3: Activities | Top Locations | System Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <ActivitiesCard />
        </div>

        <div className="lg:col-span-3">
          <TopLocationsCard />
        </div>

        <div className="lg:col-span-3">
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
}
