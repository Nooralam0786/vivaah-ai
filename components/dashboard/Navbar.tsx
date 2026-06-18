'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockUser = { name: 'Rohan Sharma', avatar: null, isPremium: true };

export default function DashboardNavbar() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
      {/* Spacer for mobile hamburger */}
      <div className="w-10 lg:hidden" />

      {/* Page Title - shown on mobile */}
      <div className="flex-1 lg:flex-none">
        <span className="text-sm font-semibold text-neutral-700 lg:hidden">VivaahAI</span>
      </div>

      <div className="flex-1 hidden lg:block" />

      <div className="flex items-center gap-2">
        {/* Upgrade Button */}
        {!mockUser.isPremium && (
          <Link href="/premium"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-gold-gradient text-neutral-900 text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-premium">
            <span>⭐</span> Upgrade to Premium
          </Link>
        )}

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-700 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-vivaah-border py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-vivaah-border flex items-center justify-between">
                <span className="font-semibold text-neutral-900 text-sm">Notifications</span>
                <button className="text-xs text-primary-700 font-medium hover:underline">Mark all read</button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-vivaah-bg cursor-pointer transition-colors ${n.unread ? 'bg-primary-50/50' : ''}`}>
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-base flex-shrink-0">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.unread && <div className="w-2 h-2 bg-primary-700 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))}
              <div className="px-4 pt-2 border-t border-vivaah-border">
                <Link href="/notifications" className="block text-center text-xs text-primary-700 font-medium py-2 hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <Link href="/messages"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-700 rounded-full text-white text-[9px] font-bold flex items-center justify-center">12</span>
        </Link>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-vivaah-muted transition-colors">
            <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {mockUser.avatar ? <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" /> : mockUser.name[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-neutral-900 leading-none">{mockUser.name}</p>
              {mockUser.isPremium && <p className="text-[10px] text-gold-600 font-medium leading-none mt-0.5">Premium Member</p>}
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3.5 h-3.5 text-neutral-400 hidden md:block transition-transform ${profileOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-vivaah-border py-2 z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-vivaah-border">
                <p className="font-semibold text-neutral-900 text-sm">{mockUser.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">rohan.sharma@email.com</p>
              </div>
              {[
                { href: '/profile', label: 'View Profile', icon: '👤' },
                { href: '/settings', label: 'Account Settings', icon: '⚙️' },
                { href: '/premium', label: 'Premium Benefits', icon: '👑' },
                { href: '/help', label: 'Help & Support', icon: '❓' },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-vivaah-bg hover:text-primary-700 transition-colors">
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-vivaah-border mt-1 pt-1">
                <button onClick={() => router.push('/login')}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
