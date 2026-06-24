'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu, Search, Bell, MessageSquare, ChevronDown,
  Crown, User, Settings, HelpCircle, LogOut,
} from 'lucide-react';

export default function DashboardNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName || 'User';
  const displayEmail = user?.email || '';
  const photoUrl = user?.photo || null;

  const handleSignOut = async () => {
    logout();
    router.replace('/login');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, icon: '💕', text: 'Ananya Singh liked your profile', time: '2h ago', unread: true },
    { id: 2, icon: '💬', text: 'New message from Priya Sharma', time: '3h ago', unread: true },
    { id: 3, icon: '👁️', text: '15 people viewed your profile', time: '1d ago', unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 h-14 bg-white border-b border-vivaah-border flex items-center px-4 md:px-6 gap-3 shadow-sm">

      {/* Hamburger — visible on mobile only (desktop sidebar is always open) */}
      <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-vivaah-muted transition-colors flex-shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xs hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-14 py-1.5 bg-vivaah-bg border border-vivaah-border rounded-xl text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700/40 transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded font-medium tracking-wide">
            ⌘ K
          </span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">

        {/* Upgrade to Premium */}
        <Link href="/premium-benefits"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-gradient text-neutral-900 text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
          <Crown className="w-3.5 h-3.5" />
          Upgrade to Premium
        </Link>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-500">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-700 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              12
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-vivaah-border py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-vivaah-border flex items-center justify-between">
                <span className="font-semibold text-neutral-900 text-sm">Notifications</span>
                <button className="text-xs text-primary-700 font-medium hover:underline">Mark all read</button>
              </div>
              {notifications.map((n) => (
                <div key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-vivaah-bg cursor-pointer transition-colors ${n.unread ? 'bg-primary-50/40' : ''}`}>
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-base flex-shrink-0">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.unread && <div className="w-2 h-2 bg-primary-700 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))}
              <div className="px-4 pt-2 border-t border-vivaah-border">
                <Link href="/notifications" className="block text-center text-xs text-primary-700 font-medium py-1.5 hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <Link href="/messages"
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-500">
          <MessageSquare className="w-5 h-5" />
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-vivaah-border mx-1 hidden md:block" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-vivaah-muted transition-colors">
            <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
              {photoUrl
                ? <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
                : displayName[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-neutral-900 leading-none">{displayName}</p>
              <p className="text-[10px] text-gold-500 font-semibold leading-none mt-0.5">Premium Member</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 hidden md:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-vivaah-border py-2 z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-vivaah-border">
                <p className="font-semibold text-neutral-900 text-sm">{displayName}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{displayEmail}</p>
              </div>
              {[
                { href: '/profile', label: 'View Profile', Icon: User },
                { href: '/settings', label: 'Account Settings', Icon: Settings },
                { href: '/premium-benefits', label: 'Premium Benefits', Icon: Crown },
                { href: '/help', label: 'Help & Support', Icon: HelpCircle },
              ].map(({ href, label, Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-vivaah-bg hover:text-primary-700 transition-colors">
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="border-t border-vivaah-border mt-1 pt-1">
                <button onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
