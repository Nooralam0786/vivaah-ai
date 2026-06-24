"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SmartSignupLink from "@/components/site/SmartSignupLink";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrustBadge {
  icon: ReactNode;
  text: string;
  description: string;
}

interface Stat {
  icon: ReactNode;
  value: string;
  label: string;
}


interface Testimonial {
  name: string;
  date: string;
  image: string;
  quote: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRUST_BADGES: TrustBadge[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    text: "AI-Powered Matching",
    description: "Advanced AI algorithms find highly compatible life partners based on your preferences.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    text: "100% Verified Profiles",
    description: "Every profile goes through a rigorous verification process for authenticity and trust.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    text: "Privacy & Safety First",
    description: "Your personal information remains secure with industry-leading privacy protection.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: "Family Involved",
    description: "Families can actively participate in the matchmaking journey with confidence.",
  },
];

const STATS: Stat[] = [
  {
    icon: (
      <svg className="w-9 h-9 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    value: "500K+",
    label: "Registered Users",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-accent-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
      </svg>
    ),
    value: "50K+",
    label: "Happy Matches",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-accent-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: "100%",
    label: "Verified Profiles",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-accent-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    value: "4.8/5",
    label: "User Rating",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amit & Priya",
    date: "Married in 2025",
    image: "/Images/sucess story.png",
    quote: "We found our perfect match through VivaahAI. The AI recommendations were incredibly accurate.",
  },
  {
    name: "Rahul & Sneha",
    date: "Married in 2024",
    image: "/Images/sucess story 3.png",
    quote: "The platform made our journey simple and trustworthy. Today we are happily married.",
  },
  {
    name: "Arjun & Kavya",
    date: "Married in 2025",
    image: "/Images/sucess story2.png",
    quote: "A beautiful experience that connected us at the right time. Thank you VivaahAI.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({ badge }: { badge: TrustBadge }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-8 text-center border border-neutral-200 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-16 h-16 mx-auto rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mb-5 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {badge.icon}
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-3 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {badge.text}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{badge.description}</p>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-visible pb-16">
        <div className="relative overflow-hidden lg:min-h-[580px]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/Images/hero.png"
              alt="VivaahAI couple"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, transparent 100%)" }}
          />

          <div className="container-safe relative z-10 py-14 sm:py-20 md:py-28">
            <div className="max-w-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ color: "#5a1030" }}>
                AI-Powered Matches,
                <br />
                Meaningful Connections
              </h1>

              <p className="text-neutral-700 text-base md:text-lg mb-8 leading-relaxed">
                VivaahAI combines advanced AI technology with
                <br className="hidden sm:block" />
                Indian values to help you find your life partner.
              </p>

              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 mb-10">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2">
                    <span className="text-accent-500 flex-shrink-0">{badge.icon}</span>
                    <span className="text-sm font-medium text-neutral-800">{badge.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SmartSignupLink className="inline-flex items-center justify-center px-7 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-base">
                  Find Your Match
                </SmartSignupLink>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-accent-500 text-accent-600 hover:bg-accent-50 font-semibold rounded-lg transition-colors text-base bg-white">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  How It Works
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar — overlaps the hero's bottom edge at every breakpoint (half on the hero, half below) */}
        <div className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-12 md:-mt-14">
          <div className="mx-auto max-w-6xl animate-rise-in">
            <div className="bg-white rounded-2xl shadow-xl px-6 sm:px-10 lg:px-12 py-6 sm:py-8 lg:py-9 transition-shadow duration-300 hover:shadow-2xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                    className={`group flex items-center gap-4 sm:gap-6 cursor-default animate-fade-in-up ${i !== 0 ? "lg:border-l lg:border-neutral-200 lg:pl-8" : ""}`}
                  >
                    <div className="flex-shrink-0 text-primary-700 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 [&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-14 sm:[&>svg]:h-14">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 leading-tight transition-colors duration-300 group-hover:text-secondary-500">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-neutral-500 mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose VivaahAI */}
      <section className="py-20 bg-[#FFF8F4]">
        <div className="container-safe">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-sm font-medium mb-4 transition-all duration-300 hover:bg-[#6B1B3D] hover:text-[#D4AF37] hover:shadow-lg">
              Why Choose VivaahAI
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Trusted by Families Across India
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Experience the future of matchmaking with AI-powered compatibility, verified profiles, and complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <FeatureCard key={badge.text} badge={badge} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-24 overflow-hidden bg-[#FFF8F4]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: "#6B1B3D", filter: "blur(90px)" }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: "#D4AF37", filter: "blur(90px)" }} />

        <div className="container-safe relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-sm font-semibold mb-4 tracking-wide uppercase transition-all duration-300 hover:bg-[#6B1B3D] hover:text-[#D4AF37] hover:shadow-lg cursor-default">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
              Real People, Real Connections
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-base leading-relaxed">
              Thousands of couples found their perfect match through VivaahAI. Here are some of their beautiful stories.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(107,27,61,0.75) 100%)" }}
                  />
                  {/* Heart badge */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 fill-[#6B1B3D]" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white font-bold text-lg leading-tight drop-shadow">{t.name}</p>
                    <p className="text-white/75 text-xs mt-0.5">{t.date}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 pt-5 pb-6 relative">
                  {/* Decorative large quote */}
                  <span className="pointer-events-none select-none absolute -top-4 right-5 text-8xl font-serif text-[#D4AF37] opacity-20 leading-none">&ldquo;</span>
                  <p className="text-neutral-600 text-sm leading-relaxed italic relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-[#6B1B3D] font-semibold bg-[#6B1B3D]/10 px-3 py-1 rounded-full">
                      Verified Match
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#6B1B3D] text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm"
            >
              Read More Stories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="container-safe">
          <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Ready to find your perfect match?
              </h2>
              <p className="text-white/80 text-lg">Join thousands of successful stories</p>
            </div>
            <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg">
              Get Started Now
            </SmartSignupLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
