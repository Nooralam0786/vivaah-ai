import Link from "next/link";

const QUICK_LINKS = [
  { label: "About Us",        href: "/about-us" },
  { label: "How It Works",    href: "/how-it-works" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Safety",          href: "/safety" },
  { label: "Premium",         href: "/premium" },
];

const SUPPORT_LINKS = [
  { label: "Help Center",      href: "/help" },
  { label: "Contact Us",       href: "/contact-us" },
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy",    href: "/refund-policy" },
  { label: "FAQ",              href: "/help" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" },
  { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02v-6.5l5.75 3.25-5.75 3.25z" },
  { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM6 9H2v12h4zM4 2a2 2 0 100 4 2 2 0 000-4z" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-[#581630] via-[#6B1B3D] to-[#581630] text-white">
      <div className="container-safe py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand — full-width on mobile, 1-col on sm+ */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#D4AF37]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <span className="text-xl font-extrabold">VivaahAI</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              AI-powered matrimonial platform helping people find meaningful relationships.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={`Follow us on ${s.label}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#6B1B3D] flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-[#D4AF37] mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[#D4AF37] transition-colors focus:outline-none focus-visible:text-[#D4AF37]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-[#D4AF37] mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[#D4AF37] transition-colors focus:outline-none focus-visible:text-[#D4AF37]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4">Download App</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 bg-black hover:bg-neutral-900 rounded-lg px-3 py-2 transition-colors w-fit">
                <svg viewBox="0 0 512 512" className="w-6 h-6">
                  <path fill="#fff" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="leading-tight">
                  <p className="text-[9px] text-white/60">GET IT ON</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-black hover:bg-neutral-900 rounded-lg px-3 py-2 transition-colors w-fit">
                <svg viewBox="0 0 384 512" className="w-6 h-6">
                  <path fill="#fff" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div className="leading-tight">
                  <p className="text-[9px] text-white/60">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-safe py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/60">&copy; 2026 VivaahAI. All Rights Reserved.</p>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
