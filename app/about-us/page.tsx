"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SmartSignupLink from "@/components/site/SmartSignupLink";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  icon: ReactNode;
  value: string;
  label: string;
}

interface Differentiator {
  icon: ReactNode;
  title: string;
  description: string;
}

interface CoreValue {
  icon: ReactNode;
  title: string;
  description: string;
}

interface StoryHighlight {
  icon: ReactNode;
  title: string;
  description: string;
}

interface MemberTestimonial {
  name: string;
  image: string;
  quote: string;
  rating: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ArrowIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MILESTONES: Milestone[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V4.5a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v3h7.5a.75.75 0 01.75.75V21M3 21h18M9 8.25h1.5m-1.5 3h1.5M15 12h1.5m-1.5 3h1.5" />
      </svg>
    ),
    value: "2024",
    label: "VivaahAI Founded",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    value: "50K+",
    label: "Couples Joined",
  },
  {
    icon: <HeartIcon className="w-5 h-5" />,
    value: "10K+",
    label: "Matches Made",
  },
  {
    icon: <span className="text-xs font-extrabold tracking-wide">AI</span>,
    value: "AI",
    label: "Matching Engine Launched",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: "100%",
    label: "Verified Profiles",
  },
];

const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    title: "AI-Powered Matchmaking",
    description: "Compatibility scoring powered by intelligent algorithms to help you find your perfect match.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Verified Profiles",
    description: "Every profile is manually reviewed and verified to keep our community genuine and trustworthy.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Family Involvement",
    description: "Bring your family into the journey whenever you want so decisions are made together.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure Platform",
    description: "Industry-grade encryption keeps your data and conversations private at every step.",
  },
];


const CORE_VALUES: CoreValue[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Trust",
    description: "Everything we build starts with transparency.",
  },
  {
    icon: <HeartIcon className="w-5 h-5" />,
    title: "Commitment",
    description: "We stay with you, every step of the way.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Family",
    description: "Family is at the heart of every match we make.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Safety",
    description: "Your safety and privacy always come first.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "Innovation",
    description: "We keep improving how meaningful matches are made.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Inclusivity",
    description: "Every story, every faith, every background is welcome.",
  },
];

const STORY_HIGHLIGHTS: StoryHighlight[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "AI-Powered Matching",
    description: "Advanced algorithms analyze compatibility beyond just basic preferences.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Family Involved",
    description: "We believe families play an important role in building stronger bonds.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy First",
    description: "Your data and privacy are our top priorities.",
  },
  {
    icon: <HeartIcon className="w-5 h-5" />,
    title: "Real Connections",
    description: "We focus on meaningful relationships that last a lifetime.",
  },
];

const MEMBER_TESTIMONIALS: MemberTestimonial[] = [
  {
    name: "Priya & Arjun",
    image: "/Images/sucess story.png",
    quote: "VivaahAI helped us find each other in the most beautiful way. The journey felt personal, not transactional.",
    rating: 5,
  },
  {
    name: "Neha & Karan",
    image: "/Images/sucess story 3.png",
    quote: "The matching felt instant and never looked back since. Our families bonded just as quickly as we did.",
    rating: 5,
  },
  {
    name: "Sneha & Rohan",
    image: "/Images/sucess story2.png",
    quote: "From the first chat to forever, a beautiful journey together. We're grateful for this platform.",
    rating: 4,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifferentiatorCard({ item }: { item: Differentiator }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-7 text-center border border-neutral-200 cursor-default transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-14 h-14 mx-auto rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mb-4 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {item.icon}
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-2 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {item.title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
    </div>
  );
}


function CoreValueItem({ value }: { value: CoreValue }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 text-center border border-neutral-200 cursor-default transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-12 h-12 mx-auto rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center mb-3 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {value.icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {value.title}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed">{value.description}</p>
    </div>
  );
}

function StarRating({ rating, animated }: { rating: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            i < rating ? "text-[#D4AF37]" : "text-neutral-200"
          } ${animated ? "group-hover:scale-125" : ""}`}
          style={animated ? { transitionDelay: `${i * 60}ms` } : undefined}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function MemberTestimonialCard({ t }: { t: MemberTestimonial }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_16px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <svg
        className="absolute top-5 right-5 w-12 h-12 text-[#6B1B3D]/[0.06] transition-colors duration-300 group-hover:text-[#D4AF37]/20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.17 17q-1.4 0-2.285-.957Q4 15.086 4 13.65q0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2T10.5 5.5l.625 1.3q-1.45.65-2.45 1.8T7.05 11q.4-.225.825-.3T8.7 10.6q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q9.8 17 7.17 17Zm9.5 0q-1.4 0-2.285-.957-.885-.958-.885-2.393 0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2t2.525-1.325l.625 1.3q-1.45.65-2.45 1.8T16.55 11q.4-.225.825-.3t.825-.075q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q19.3 17 16.67 17Z" />
      </svg>

      <div className="relative z-10 flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FFF3F0] transition-all duration-300 group-hover:ring-[#D4AF37]/50">
          <Image
            src={t.image}
            alt={t.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-[#6B1B3D]">
            {t.name}
          </h4>
          <StarRating rating={t.rating} animated />
        </div>
      </div>
      <p className="relative z-10 text-sm text-neutral-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-xs font-semibold tracking-wide uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h2>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        <div className="relative w-full aspect-[1932/814]">
          <Image
            src="/Images/about-us.png"
            alt="Couple matched through VivaahAI"
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0.25) 50%, transparent 65%)",
            }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-full sm:max-w-md md:max-w-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: "#5a1030" }}>
                About VivaahAI
              </h1>
              <p className="text-[#6B1B3D] font-semibold text-base sm:text-lg mb-4">Where Technology Meets Tradition</p>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
                We combine artificial intelligence with family values to help people discover meaningful and lifelong
                relationships.
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <Link
                  href="/success-stories"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm whitespace-nowrap"
                >
                  Our Success Stories
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#D4AF37] text-[#6B1B3D] hover:bg-[#D4AF37]/10 font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="container-safe">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-10">
            Our Journey
            <span className="block w-10 h-0.5 bg-[#D4AF37] mt-2" />
          </h2>

          <div className="relative grid grid-cols-3 sm:grid-cols-5 gap-y-8">
            <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] border-t-2 border-dashed border-[#D4AF37]/50" />
            {MILESTONES.map((m) => (
              <div
                key={m.label}
                className="group relative z-10 flex flex-col items-center text-center px-1 cursor-default transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF3F0] text-[#6B1B3D] flex items-center justify-center mb-3 shadow-md transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(212,175,55,0.45)]">
                  {m.icon}
                </div>
                <div className="text-base font-bold text-[#6B1B3D] transition-colors duration-300">{m.value}</div>
                <div className="text-xs text-neutral-500 mt-0.5 max-w-[110px] transition-colors duration-300 group-hover:text-neutral-700">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-14 sm:py-16 bg-[#FFF8F4]">
        <div className="container-safe">
          <SectionHeading eyebrow="Our Difference" title="What Makes Us Different" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFFERENTIATORS.map((d) => (
              <DifferentiatorCard key={d.title} item={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-14 sm:py-16 bg-[#FFF8F4]">
        <div className="container-safe">
          <SectionHeading title="Our Core Values" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {CORE_VALUES.map((v) => (
              <CoreValueItem key={v.title} value={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="container-safe grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 items-center">
          <div className="relative pb-8 pl-4">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/Images/wedding.png"
                alt="Family celebrating together"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-1 -left-1 sm:left-2 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">Safe &amp; Secure</div>
                <div className="text-xs text-neutral-500">100% Verified Profiles</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#6B1B3D" }}>
              Our Story
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4">
              VivaahAI was founded with a simple yet powerful idea — that finding the right life partner should be a
              joyful, trustworthy, and seamless experience.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
              We noticed that traditional matchmaking lacked transparency and efficiency, while modern dating
              platforms often missed the essence of cultural values. VivaahAI bridges this gap by combining advanced
              AI technology with family involvement and trust.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {STORY_HIGHLIGHTS.map((h) => (
                <div key={h.title} className="group cursor-default transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center mb-2 shadow-sm transition-all duration-300 group-hover:bg-[#6B1B3D] group-hover:text-white group-hover:scale-110">
                    {h.icon}
                  </div>
                  <h4 className="text-sm font-bold text-[#6B1B3D] mb-1">{h.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Our Members Say */}
      <section className="relative py-14 sm:py-16 bg-[#FFF8F4] overflow-hidden">
        <div
          className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-[0.07]"
          style={{ background: "#6B1B3D", filter: "blur(90px)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-[0.07]"
          style={{ background: "#D4AF37", filter: "blur(90px)" }}
        />

        <div className="container-safe relative z-10">
          <SectionHeading eyebrow="Real Stories" title="What Our Members Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MEMBER_TESTIMONIALS.map((t) => (
              <MemberTestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="container-safe">
          <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to Begin Your Journey?</h2>
              <p className="text-white/80 text-lg">Join thousands of successful stories and find your perfect match today.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap">
                Create Profile
              </SmartSignupLink>
              <Link
                href="/discover"
                className="px-8 py-4 border-2 border-white/40 text-white hover:bg-white/10 font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                Explore Matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
