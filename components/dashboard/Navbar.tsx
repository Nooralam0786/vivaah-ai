'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu, Search, Bell, MessageSquare, ChevronDown,
  Crown, User, Settings, HelpCircle, LogOut, ShieldCheck,
} from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

export default function DashboardNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);
  const [notifications,  setNotifications]  = useState<Array<{
    id: string; type: string; title: string; body: string;
    fromPhoto: string | null; link: string | null; isRead: boolean; createdAt: string;
  }>>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  const displayName  = user?.fullName || 'User';
  const displayEmail = user?.email    || '';
  const photoUrl     = user?.photo    || null;
  const isVerified   = (user as unknown as { isVerified?: boolean })?.isVerified ?? false;

  const tier = user?.subscriptionTier ?? 'free';
  const TIER_LABELS: Record<string, { label: string; className: string }> = {
    free:     { label: 'Free Member',     className: 'text-neutral-400' },
    gold:     { label: 'Gold Member',     className: 'text-amber-500'   },
    platinum: { label: 'Platinum Member', className: 'text-blue-500'    },
    diamond:  { label: 'Diamond Member',  className: 'text-primary-600' },
  };
  const tierDisplay = TIER_LABELS[tier] ?? TIER_LABELS['free'];

  /* ── Fetch unread chat count ────────────────────────────────────────────── */
  const fetchUnread = useCallback(async () => {
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      const res  = await fetch('/api/chat/unread', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (json.success) setUnreadCount(json.data.unread);
    } catch { /* silent */ }
  }, []);

  /* ── Fetch in-app notifications ─────────────────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      const res  = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data.notifications);
        setNotifCount(json.data.unreadCount);
      }
    } catch { /* silent */ }
  }, []);

  const markAllRead = useCallback(async () => {
    const auth = getAuthFromStorage();
    if (!auth) return;
    await fetch('/api/notifications', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body:    JSON.stringify({}),
    });
    setNotifCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  useEffect(() => {
    fetchUnread();
    fetchNotifications();
    const id = setInterval(() => { fetchUnread(); fetchNotifications(); }, 30_000);
    return () => clearInterval(id);
  }, [fetchUnread, fetchNotifications]);

  /* ── Close dropdowns on outside click ──────────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = () => { logout(); router.replace('/login'); };

  const NOTIF_ICONS: Record<string, string> = {
    like: '❤️', match: '💍', message: '💬', view: '👀', referral: '🎁', boost: '⚡',
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 h-14 bg-white border-b border-vivaah-border flex items-center px-4 md:px-6 gap-3 shadow-sm">

      {/* Hamburger — mobile only */}
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
        <Link href="/upgrade"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-gradient text-neutral-900 text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
          <Crown className="w-3.5 h-3.5" />
          Upgrade
        </Link>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); if (!notifOpen) fetchNotifications(); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-500">
            <Bell className="w-5 h-5" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#6B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-vivaah-border py-2 z-50 animate-slide-up max-h-[420px] flex flex-col">
              <div className="px-4 py-2 border-b border-vivaah-border flex items-center justify-between flex-shrink-0">
                <span className="font-semibold text-neutral-900 text-sm">Notifications</span>
                {notifCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-700 font-medium hover:underline">Mark all read</button>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-neutral-400">
                    <div className="text-3xl mb-2">🔔</div>
                    No notifications yet
                  </div>
                ) : notifications.map((n) => (
                  <a
                    key={n.id}
                    href={n.link ?? '#'}
                    onClick={() => setNotifOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-vivaah-bg transition-colors ${!n.isRead ? 'bg-primary-50/40' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-primary-50 flex items-center justify-center text-lg">
                      {n.fromPhoto
                        ? <img src={n.fromPhoto} alt="" className="w-full h-full object-cover" />
                        : NOTIF_ICONS[n.type] ?? '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 leading-snug">{n.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-snug truncate">{n.body}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 bg-primary-700 rounded-full mt-1.5 flex-shrink-0" />}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages with unread badge */}
        <Link href="/messages"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-vivaah-muted transition-colors text-neutral-500">
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#6B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-vivaah-border mx-1 hidden md:block" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-vivaah-muted transition-colors">
            <div className="relative">
              <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                {photoUrl
                  ? <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
                  : displayName[0]?.toUpperCase() ?? '?'}
              </div>
              {isVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                  <ShieldCheck size={8} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-neutral-900 leading-none">{displayName}</p>
              <p className={`text-[10px] font-semibold leading-none mt-0.5 ${tierDisplay.className}`}>{tierDisplay.label}</p>
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
                { href: '/profile',      label: 'View Profile',     Icon: User },
                { href: '/settings',     label: 'Account Settings', Icon: Settings },
                ...(!isVerified ? [{ href: '/verification', label: 'Get Verified ✓', Icon: ShieldCheck }] : []),
                { href: '/upgrade',      label: 'Upgrade Plan',     Icon: Crown },
                { href: '/help',         label: 'Help & Support',   Icon: HelpCircle },
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
