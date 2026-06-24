'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Compass, Heart, MessageSquare, Link2,
  Eye, Bookmark, Users, User, Crown, Settings, HelpCircle,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/discover', label: 'Discover', Icon: Compass },
  { href: '/matches', label: 'Matches', Icon: Heart },
  { href: '/messages', label: 'Messages', Icon: MessageSquare, badge: 12 },
  { href: '/connections', label: 'Connections', Icon: Link2 },
  { href: '/visitors', label: 'Visitors', Icon: Eye, badge: 5 },
  { href: '/bookmarks', label: 'Bookmarks', Icon: Bookmark },
  { href: '/family-connect', label: 'Family Connect', Icon: Users },
  { href: '/profile', label: 'Profile', Icon: User },
  { href: '/premium-benefits', label: 'Premium Benefits', Icon: Crown },
  { href: '/settings', label: 'Settings', Icon: Settings },
  { href: '/help', label: 'Help & Support', Icon: HelpCircle },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link href="/" className="px-5 py-4 border-b border-vivaah-border flex items-center gap-2.5 hover:bg-vivaah-bg transition-colors">
        <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="font-bold text-lg text-neutral-900">VivaahAI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-3 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const { Icon } = item;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-vivaah-muted hover:text-primary-700'
                }`}>
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-primary-700'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary-700 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Go Premium CTA */}
      <div className="p-4 border-t border-vivaah-border">
        <div className="bg-premium-gradient rounded-xl p-4 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <Crown size={14} className="text-gold-300" />
            <span className="text-xs font-bold text-gold-300 tracking-wide">Go Premium</span>
          </div>
          <p className="text-xs text-white/70 mb-3 leading-relaxed">
            Unlock all features and get better matches.
          </p>
          <Link
            href="/premium-benefits"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-4 bg-gold-gradient text-neutral-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
            Upgrade Now →
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-white border border-vivaah-border rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-neutral-600">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
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
