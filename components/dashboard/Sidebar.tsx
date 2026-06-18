'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/discover', label: 'Discover', icon: '🔍' },
  { href: '/matches', label: 'Matches', icon: '💕' },
  { href: '/messages', label: 'Messages', icon: '💬', badge: 12 },
  { href: '/connections', label: 'Connections', icon: '🤝' },
  { href: '/visitors', label: 'Visitors', icon: '👁️', badge: 5 },
  { href: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
  { href: '/family-connect', label: 'Family Connect', icon: '👨‍👩‍👧' },
  { href: '/profile', label: 'Profile', icon: '👤' },
  { href: '/premium', label: 'Premium Benefits', icon: '👑' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
  { href: '/help', label: 'Help & Support', icon: '❓' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-vivaah-border flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <span className="font-bold text-lg text-neutral-900">VivaahAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-vivaah-muted hover:text-primary-700'}`}>
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? 'bg-white/20 text-white' : 'bg-primary-700 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Premium CTA */}
      <div className="p-4 border-t border-vivaah-border">
        <div className="bg-premium-gradient rounded-xl p-4 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <span>👑</span>
            <span className="text-xs font-semibold text-gold-300">PREMIUM MEMBER</span>
          </div>
          <p className="text-xs text-white/70 mb-3">Unlock all features and get better matches</p>
          <Link href="/premium"
            className="block w-full py-2 px-4 bg-gold-gradient text-neutral-900 text-xs font-bold rounded-lg text-center hover:opacity-90 transition-opacity">
            Upgrade Now
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-vivaah-border rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-neutral-700">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-64 bg-white border-r border-vivaah-border flex-col z-30 shadow-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
