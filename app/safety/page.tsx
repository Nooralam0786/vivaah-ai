"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SafetyFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SAFETY_FEATURES: SafetyFeature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-1.042.133-2.052.382-3.016A8.97 8.97 0 0012 3c2.13 0 4.078.78 5.572 2.07.225.194.45.397.665.61A8.967 8.967 0 0121 12z" />
      </svg>
    ),
    title: "Verified Profiles",
    description: "All profiles are manually verified for authenticity.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M15.75 3v1.5M3 8.25h1.5M3 12h1.5m-1.5 3.75h1.5M19.5 8.25H21M19.5 12H21m-1.5 3.75H21M8.25 19.5V21M15.75 19.5V21M6.75 6.75h10.5v10.5H6.75V6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5v4.5h-4.5v-4.5z" />
      </svg>
    ),
    title: "AI Fraud Detection",
    description: "Advanced AI detects and prevents suspicious activity.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy Protection",
    description: "Your data is encrypted and never shared with anyone.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5a1.5 1.5 0 113 0V11h.25a.75.75 0 01.75.75v2a.75.75 0 01-.75.75h-3.5a.75.75 0 01-.75-.75v-2a.75.75 0 01.75-.75H14.5V9.5z" />
      </svg>
    ),
    title: "Secure Communication",
    description: "Chat safely within our platform. Your privacy is protected.",
  },
];

const SAFETY_TIPS: string[] = [
  "Never share OTP or personal details",
  "Meet in public places for the first time",
  "Verify profile and background",
  "Report any suspicious activity",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ShieldCheckBadge() {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
      <div
        className="absolute inset-[-40%] rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(255,182,193,0.55) 0%, rgba(255,182,193,0) 70%)" }}
      />
      <div className="absolute inset-[-12%] rounded-full border-2 border-dashed border-[#D4AF37]/40 animate-[spin_18s_linear_infinite]" />
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#F4C95D] via-[#D4AF37] to-[#b8860b] shadow-2xl flex items-center justify-center">
        <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M12 3c2.13 0 4.078.78 5.572 2.07.225.194.45.397.665.61A8.967 8.967 0 0121 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a8.967 8.967 0 012.763-6.32C6.922 4.78 8.87 4 11 4" />
        </svg>
      </div>
    </div>
  );
}

function FeatureColumn({ feature }: { feature: SafetyFeature }) {
  return (
    <div className="group relative flex flex-col items-center text-center cursor-default">
      <svg className="absolute -top-1 left-2 w-3 h-3 text-[#D4AF37]/60 transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
      </svg>
      <div className="w-14 h-14 rounded-full bg-[#FFF3F0] text-[#6B1B3D] flex items-center justify-center mb-3 shadow-sm transition-all duration-300 group-hover:bg-[#6B1B3D] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(107,27,61,0.3)]">
        {feature.icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {feature.title}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed max-w-[160px]">{feature.description}</p>
    </div>
  );
}

function TipRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
      <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#6B1B3D] text-[#6B1B3D] flex items-center justify-center">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.364 6.3-2.228-2.207a1 1 0 00-1.408 1.42l2.932 2.903a1 1 0 001.408 0l7.068-7.004z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="text-sm text-neutral-700">{text}</span>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        <div className="relative">
          <div className="ml-auto w-full sm:w-3/5 md:w-1/2 lg:w-[55%]">
            <div className="relative w-full aspect-[1622/970]">
              <Image
                src="/Images/safety.png"
                alt="Couple using VivaahAI safely"
                fill
                priority
                className="object-contain object-right"
                sizes="(max-width: 640px) 100vw, 55vw"
              />
              <div className="absolute left-[8%] sm:left-[14%] top-[28%] sm:top-[22%] z-10">
                <ShieldCheckBadge />
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 45%, rgba(255,229,224,0.35) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 30%, transparent 50%)",
            }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-full sm:max-w-sm md:max-w-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ color: "#5a1030" }}>
                Your Safety is
                <br />
                Our Priority
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-md">
                We are committed to creating a{" "}
                <span className="font-semibold text-[#6B1B3D]">safe, secure and trusted</span> environment for you and
                your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip — overlaps the hero/section boundary */}
      <section className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-14 md:-mt-16 pb-14 sm:pb-16">
        <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {SAFETY_FEATURES.map((f) => (
              <FeatureColumn key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips + Need Help */}
      <section className="pb-14 sm:pb-16">
        <div className="container-safe grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Safety Tips */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-[#6B1B3D]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-1.042.133-2.052.382-3.016A8.97 8.97 0 0012 3c2.13 0 4.078.78 5.572 2.07.225.194.45.397.665.61A8.967 8.967 0 0121 12z" />
              </svg>
              Safety Tips
            </h2>
            <span className="block w-10 h-0.5 bg-[#D4AF37] mb-3" />
            <ul>
              {SAFETY_TIPS.map((tip) => (
                <TipRow key={tip} text={tip} />
              ))}
            </ul>
          </div>

          {/* Need Help */}
          <div className="relative overflow-hidden bg-[#FFF3F0] rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
            <svg className="pointer-events-none absolute -bottom-6 -right-6 w-32 h-32 text-[#D4AF37]/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white text-[#6B1B3D] flex items-center justify-center shadow-sm mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-1">Need Help?</h2>
              <p className="text-sm text-neutral-500 mb-6">Our support team is here for you 24/7.</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6B1B3D] text-white text-sm font-semibold rounded-xl hover:bg-[#581630] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM19.5 8.25v3m0 0v3m0-3h3m-3 0h-3" />
                  </svg>
                  Report a Profile
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#6B1B3D] text-[#6B1B3D] text-sm font-semibold rounded-xl hover:bg-[#6B1B3D]/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="pb-14 sm:pb-16">
        <div className="container-safe">
          <div className="relative overflow-hidden bg-[#FFF3F0] rounded-2xl px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B1B3D]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.25 14.5L7 11.75l1.41-1.41 2.34 2.34 5.84-5.84L18 8.25l-7.25 7.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-[#6B1B3D]">Your trust is important to us.</p>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Together, let&rsquo;s build safe connections.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
