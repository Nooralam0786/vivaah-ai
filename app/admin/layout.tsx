'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, User, ShieldCheck, UserX,
  Heart, MessageSquare, Zap, Eye,
  FileText, Star, Image, BookOpen, MessageCircle,
  CreditCard, ArrowRightLeft, Wallet, RotateCcw,
  TrendingUp, Settings, Shield, Activity,
  LogOut, Bell, Search, ChevronLeft, ChevronRight,
  HelpCircle, type LucideIcon,
} from 'lucide-react';

/* ─── Nav config ─────────────────────────────────────────────── */
interface NavItem { href: string; label: string; Icon: LucideIcon }
interface NavSection { title: string; items: NavItem[] }

const NAV_TOP: NavItem[] = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
];

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'USER MANAGEMENT',
    items: [
      { href: '/admin/users',         label: 'Users',         Icon: Users      },
      { href: '/admin/profiles',      label: 'Profiles',      Icon: User       },
      { href: '/admin/verifications', label: 'Verifications', Icon: ShieldCheck},
      { href: '/admin/blocked',       label: 'Blocked Users', Icon: UserX      },
    ],
  },
  {
    title: 'MATCHES & ACTIVITY',
    items: [
      { href: '/admin/matches',   label: 'Matches',           Icon: Heart         },
      { href: '/admin/messages',  label: 'Messages',          Icon: MessageSquare },
      { href: '/admin/interests', label: 'Interest Received', Icon: Zap           },
      { href: '/admin/visitors',  label: 'Who Viewed Me',     Icon: Eye           },
    ],
  },
  {
    title: 'CONTENT MANAGEMENT',
    items: [
      { href: '/admin/blog',            label: 'Blog Posts',     Icon: FileText     },
      { href: '/admin/success-stories', label: 'Success Stories',Icon: Star         },
      { href: '/admin/banners',         label: 'Banners',        Icon: Image        },
      { href: '/admin/pages',           label: 'Pages',          Icon: BookOpen     },
      { href: '/admin/testimonials',    label: 'Testimonials',   Icon: MessageCircle},
    ],
  },
  {
    title: 'PAYMENTS & PLANS',
    items: [
      { href: '/admin/subscriptions',label: 'Plans & Pricing', Icon: CreditCard     },
      { href: '/admin/transactions', label: 'Transactions',    Icon: ArrowRightLeft },
      { href: '/admin/payouts',      label: 'Payouts',         Icon: Wallet         },
      { href: '/admin/refunds',      label: 'Refund Requests', Icon: RotateCcw      },
    ],
  },
  {
    title: 'SYSTEM & SETTINGS',
    items: [
      { href: '/admin/analytics', label: 'Reports & Analytics', Icon: TrendingUp },
      { href: '/admin/settings',  label: 'System Settings',     Icon: Settings   },
      { href: '/admin/admins',    label: 'Admin Management',    Icon: Shield     },
      { href: '/admin/logs',      label: 'Activity Logs',       Icon: Activity   },
    ],
  },
];

const PATH_LABELS: Record<string, string> = {
  '/admin':                  'Dashboard',
  '/admin/users':            'Users',
  '/admin/profiles':         'Profiles',
  '/admin/verifications':    'Verifications',
  '/admin/blocked':          'Blocked Users',
  '/admin/matches':          'Matches',
  '/admin/messages':         'Messages',
  '/admin/interests':        'Interest Received',
  '/admin/visitors':         'Who Viewed Me',
  '/admin/blog':             'Blog Posts',
  '/admin/success-stories':  'Success Stories',
  '/admin/banners':          'Banners',
  '/admin/pages':            'Pages',
  '/admin/testimonials':     'Testimonials',
  '/admin/subscriptions':    'Plans & Pricing',
  '/admin/transactions':     'Transactions',
  '/admin/payouts':          'Payouts',
  '/admin/refunds':          'Refund Requests',
  '/admin/analytics':        'Reports & Analytics',
  '/admin/settings':         'System Settings',
  '/admin/admins':           'Admin Management',
  '/admin/logs':             'Activity Logs',
};

/* ─── Auth guard ─────────────────────────────────────────────── */
type GuardState = 'loading' | 'ok' | 'unauthorized' | 'forbidden';

function useAdminGuard() {
  const [state,     setState]  = useState<GuardState>('loading');
  const [adminName, setName]   = useState('Admin');

  useEffect(() => {
    const raw = localStorage.getItem('vivaah_auth');
    if (!raw) { setState('unauthorized'); return; }
    const token = (() => { try { return JSON.parse(raw)?.accessToken; } catch { return null; } })();
    if (!token) { setState('unauthorized'); return; }

    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (r.status === 401) setState('unauthorized');
        else if (r.status === 403) setState('forbidden');
        else {
          setState('ok');
          // Try to get display name from profile
          try {
            const pr = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
            const pj = await pr.json();
            if (pj.success && pj.data?.fullName) setName(pj.data.fullName);
          } catch { /* use default */ }
        }
      })
      .catch(() => setState('unauthorized'));
  }, []);

  return { state, adminName };
}

/* ─── Nav link ───────────────────────────────────────────────── */
function NavLink({ href, label, Icon, active, collapsed }: NavItem & { active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
        active
          ? 'bg-[#6B1B3D] text-white shadow-sm'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      } ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon size={16} className={`flex-shrink-0 ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && active && <ChevronRight size={12} className="ml-auto opacity-60" />}
    </Link>
  );
}

/* ─── Layout ─────────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const { state: guard, adminName } = useAdminGuard();
  const [collapsed, setCollapsed]   = useState(false);

  const currentLabel = Object.entries(PATH_LABELS).find(([k]) => pathname === k || pathname.startsWith(k + '/'))?.[1] ?? 'Admin';
  const breadcrumb   = `Admin / ${currentLabel}`;

  const handleLogout = () => {
    localStorage.removeItem('vivaah_auth');
    router.replace('/login');
  };

  /* ── Guard screens ── */
  if (guard === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#6B1B3D]/30 border-t-[#6B1B3D] rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Verifying admin access…</span>
        </div>
      </div>
    );
  }

  if (guard === 'unauthorized') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-sm text-gray-500 mb-5">Please log in to your admin account to access the panel.</p>
          <button onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-[#6B1B3D] text-white rounded-xl text-sm font-semibold hover:bg-[#8B2252] transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (guard === 'forbidden') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">⛔</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-2">Your account doesn&apos;t have admin privileges.</p>
          <p className="text-xs text-gray-400 mb-5">Contact <span className="text-[#6B1B3D] font-medium">arun@techotd.com</span> to request access.</p>
          <button onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sidebarW = collapsed ? 'w-[68px]' : 'w-60';
  const mainML   = collapsed ? 'ml-[68px]' : 'ml-60';

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarW} flex-shrink-0 bg-[#160C12] border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-30 shadow-sm transition-all duration-200 overflow-hidden`}>

        {/* Logo */}
        <div className={`h-16 flex items-center gap-3 border-b border-white/10 flex-shrink-0 ${collapsed ? 'px-3 justify-center' : 'px-5'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-none">VivaahAI</p>
              <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5 tracking-wide">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">

          {/* Top items */}
          {NAV_TOP.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              collapsed={collapsed}
            />
          ))}

          {/* Sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mt-4">
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {section.title}
                </p>
              )}
              {collapsed && <div className="my-2 h-px bg-white/10" />}
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom: Help + Back to app + Collapse */}
        <div className="flex-shrink-0 border-t border-white/10 px-2 py-3 space-y-0.5">
          {!collapsed && (
            <div className="mx-1 mb-2 p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <HelpCircle size={16} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Need Help?</p>
                <p className="text-[11px] text-white/40">Contact Support</p>
              </div>
            </div>
          )}
          <Link href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Back to App' : undefined}>
            <ArrowRightLeft size={15} className="flex-shrink-0" />
            {!collapsed && 'Back to App'}
          </Link>
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-red-400/70 hover:bg-red-900/20 hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Sign Out' : undefined}>
            <LogOut size={15} className="flex-shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <ChevronLeft size={15} className={`flex-shrink-0 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className={`${mainML} flex-1 flex flex-col min-h-screen transition-all duration-200`}>

        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-6 sticky top-0 z-20 shadow-sm">
          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-none">{currentLabel}</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{breadcrumb}</p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm mx-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, matches, reports…"
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-[#6B1B3D]/40 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Date range */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-600 cursor-default select-none">
              <span>📅</span>
              <span>{new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Notification bell */}
            <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">8</span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] rounded-full flex items-center justify-center text-white text-xs font-bold select-none">
                {adminName[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-800 leading-none">{adminName}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
