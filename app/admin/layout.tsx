'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminGuard } from './_components/useAdminGuard';
import { LoadingScreen, UnauthorizedScreen, ForbiddenScreen } from './_components/GuardScreens';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';
import { PATH_LABELS } from './_components/navConfig';

/* ─── Layout ─────────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const { state: guard, adminName } = useAdminGuard();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const currentLabel = Object.entries(PATH_LABELS).find(([k]) => pathname === k || pathname.startsWith(k + '/'))?.[1] ?? 'Admin';
  const breadcrumb   = `Admin / ${currentLabel}`;

  const handleLogout = useCallback(() => {
    localStorage.removeItem('vivaah_auth');
    router.replace('/login');
  }, [router]);

  const handleGoToLogin     = useCallback(() => router.push('/login'), [router]);
  const handleBackToDashboard = useCallback(() => router.push('/dashboard'), [router]);
  const toggleCollapsed     = useCallback(() => setCollapsed((c) => !c), []);
  const openMobile           = useCallback(() => setMobileOpen(true), []);
  const closeMobile          = useCallback(() => setMobileOpen(false), []);

  /* ── Guard screens ── */
  if (guard === 'loading') return <LoadingScreen />;
  if (guard === 'unauthorized') return <UnauthorizedScreen onLogin={handleGoToLogin} />;
  if (guard === 'forbidden') return <ForbiddenScreen onBack={handleBackToDashboard} />;

  const sidebarW = collapsed ? 'w-[68px]' : 'w-60';
  const mainML   = collapsed ? 'lg:ml-[68px]' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <aside
        id="admin-mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#160C12] border-r border-white/5 flex flex-col shadow-xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <AdminSidebar
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          onCloseMobile={closeMobile}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside className={`${sidebarW} flex-shrink-0 bg-[#160C12] border-r border-white/5 hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 shadow-sm transition-all duration-200 overflow-hidden`}>
        <AdminSidebar
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          onCloseMobile={closeMobile}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Main area ── */}
      <div className={`${mainML} flex-1 flex flex-col min-h-screen transition-all duration-200`}>

        <AdminHeader
          currentLabel={currentLabel}
          breadcrumb={breadcrumb}
          adminName={adminName}
          mobileOpen={mobileOpen}
          onOpenMobile={openMobile}
        />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
