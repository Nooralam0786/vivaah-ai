'use client';

import Link from 'next/link';
import { Heart, HelpCircle, ArrowRightLeft, LogOut, ChevronLeft } from 'lucide-react';
import NavLink from './NavLink';
import { NAV_TOP, NAV_SECTIONS } from './navConfig';

interface AdminSidebarProps {
  pathname: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

/** Sidebar content shared by the mobile drawer and the fixed desktop sidebar. */
export default function AdminSidebar({ pathname, collapsed, onToggleCollapsed, onCloseMobile, onLogout }: AdminSidebarProps) {
  return (
    <>
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
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_TOP.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} collapsed={collapsed} />
        ))}
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
        <button onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-red-400/70 hover:bg-red-900/20 hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}>
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <ChevronLeft size={15} className={`flex-shrink-0 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </>
  );
}
