"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, Crown } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Premium", href: "/premium" },
  { label: "Safety", href: "/safety" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Close dropdown on any outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const displayName = user?.fullName || "User";
  const photoUrl = user?.photo || null;
  const initial = displayName[0]?.toUpperCase() ?? "U";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-xs">
      <div className="container-safe flex items-center justify-between py-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors whitespace-nowrap ${
                isActive(href) ? "text-[#7A0026] font-semibold" : "text-neutral-700 hover:text-[#7A0026]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {isLoading ? (
            /* Skeleton while auth restores — no flash of wrong buttons */
            <>
              <div className="h-9 w-20 bg-neutral-100 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-neutral-100 rounded-lg animate-pulse" />
            </>
          ) : isAuthenticated ? (
            /* Authenticated — profile dropdown */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-neutral-200 hover:border-[#7A0026]/30 hover:bg-[#7A0026]/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0026]/50"
              >
                <div className="w-7 h-7 rounded-full bg-[#7A0026] flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                  {photoUrl
                    ? <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
                    : initial}
                </div>
                <span className="text-sm font-medium text-neutral-800">{displayName.split(" ")[0]}</span>
                <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900 text-sm">{displayName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#7A0026]/5 hover:text-[#7A0026] transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#7A0026]/5 hover:text-[#7A0026] transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link href="/premium-benefits" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-[#7A0026]/5 hover:text-[#7A0026] transition-colors">
                    <Crown className="w-4 h-4" />
                    Premium Benefits
                  </Link>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not authenticated */
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#7A0026] border border-[#7A0026] hover:bg-[#7A0026]/5 px-5 py-2 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-white bg-[#7A0026] hover:bg-[#5a0020] px-5 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0026]/50"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        id="site-mobile-menu"
        className={`lg:hidden bg-white border-t border-neutral-100 px-4 pb-5 relative z-50 transition-all duration-200 ${menuOpen ? 'block' : 'hidden'}`}
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm border-b border-neutral-50 last:border-0 transition-colors ${
                isActive(href) ? "text-[#7A0026] font-semibold" : "text-neutral-600 hover:text-[#7A0026]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {!isLoading && (
          <div className="flex gap-3 mt-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm font-semibold border border-[#7A0026] text-[#7A0026] py-2.5 rounded-xl hover:bg-[#7A0026]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0026]/50">
                  Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="flex-1 text-center text-sm font-semibold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm font-semibold border border-[#7A0026] text-[#7A0026] py-2.5 rounded-xl hover:bg-[#7A0026]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0026]/50">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm font-semibold text-white bg-[#7A0026] hover:bg-[#5a0020] py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0026]/50">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
