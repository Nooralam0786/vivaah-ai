'use client';

import { Bell, Search } from 'lucide-react';

interface AdminHeaderProps {
  currentLabel: string;
  breadcrumb: string;
  adminName: string;
  mobileOpen: boolean;
  onOpenMobile: () => void;
}

export default function AdminHeader({ currentLabel, breadcrumb, adminName, mobileOpen, onOpenMobile }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-2 sm:gap-4 px-4 sm:px-6 sticky top-0 z-20 shadow-sm">

      {/* Mobile hamburger */}
      <button
        onClick={onOpenMobile}
        aria-label="Open admin navigation"
        aria-controls="admin-mobile-sidebar"
        aria-expanded={mobileOpen}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-base font-bold text-gray-900 leading-none truncate">{currentLabel}</h1>
        <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">{breadcrumb}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-4 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search…"
          aria-label="Search admin panel"
          className="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-[#6B1B3D]/40 focus:bg-white transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Date range — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-600 cursor-default select-none whitespace-nowrap">
          <span aria-hidden="true">📅</span>
          <span>{new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Notification bell */}
        <button
          aria-label="Notifications, 8 unread"
          className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Bell size={16} aria-hidden="true" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">8</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 sm:gap-2.5 sm:pl-3 sm:border-l sm:border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] rounded-full flex items-center justify-center text-white text-xs font-bold select-none flex-shrink-0">
            {adminName[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-gray-800 leading-none">{adminName}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
