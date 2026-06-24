"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SmartSignupLink from "@/components/site/SmartSignupLink";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepDetail {
  number: number;
  title: string;
  bullets: string[];
  badge: string;
  visual: ReactNode;
}

interface ProcessNode {
  icon: ReactNode;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEP_DETAILS: StepDetail[] = [
  {
    number: 1,
    title: "Create Profile",
    visual: <ProfileVisual />,
    bullets: [
      "Quick & easy registration",
      "Add photos & basic details",
      "Verify your mobile number",
      "Profile privacy control",
    ],
    badge: "Takes 2-3 minutes",
  },
  {
    number: 2,
    title: "Set Preferences",
    visual: <PreferencesVisual />,
    bullets: [
      "Set partner preferences",
      "Choose your must-haves",
      "Add lifestyle & hobbies",
      "Define deal-breakers",
    ],
    badge: "Takes 3-5 minutes",
  },
  {
    number: 3,
    title: "AI Matchmaking",
    visual: <MatchmakingVisual />,
    bullets: [
      "Advanced AI algorithm",
      "100+ compatibility factors",
      "Behavioral analysis",
      "Continuous learning",
    ],
    badge: "Works 24/7 for you",
  },
  {
    number: 4,
    title: "Review Matches",
    visual: <MatchesVisual />,
    bullets: [
      "View curated matches",
      "See compatibility score",
      "Detailed insights",
      "Save your favorites",
    ],
    badge: "New matches daily",
  },
  {
    number: 5,
    title: "Connect & Chat",
    visual: <ChatVisual />,
    bullets: [
      "Send interest to connect",
      "Safe & secure chat",
      "Ice-breaker suggestions",
      "Report & block option",
    ],
    badge: "You're in control",
  },
  {
    number: 6,
    title: "Build Relationship",
    visual: <RelationshipVisual />,
    bullets: [
      "Get to know each other",
      "Involve family (optional)",
      "Take it offline safely",
      "Forever starts here",
    ],
    badge: "Forever starts here",
  },
];

const PROCESS_NODES: ProcessNode[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20c0-3.866 3.358-7 7.5-7s7.5 3.134 7.5 7" />
      </svg>
    ),
    label: "Your Profile",
  },
  {
    icon: <span className="text-xs font-extrabold tracking-wide">AI</span>,
    label: "AI Match",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "Connect",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="14.5" r="6" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8l3-5 3 5" />
      </svg>
    ),
    label: "Happy Marriage",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-1.5 text-[10.5px] sm:text-[11px] text-neutral-600 leading-snug">
      <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#6B1B3D]" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.364 6.3-2.228-2.207a1 1 0 00-1.408 1.42l2.932 2.903a1 1 0 001.408 0l7.068-7.004z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function PersonIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ProfileVisual() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-left shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-neutral-700">Basic Info</span>
        <div className="w-6 h-6 rounded-md bg-[#FFF3F0] flex items-center justify-center">
          <PersonIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
      </div>
      {["Education", "Profession", "Location"].map((f) => (
        <div key={f} className="flex items-center justify-between py-1 border-t border-neutral-100">
          <span className="text-[8.5px] text-neutral-400">{f}</span>
          <span className="w-9 h-1.5 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

function PreferencesVisual() {
  const rows = [
    { label: "Age", value: "24 - 30" },
    { label: "Height", value: "5'4\" - 5'10\"" },
    { label: "Religion", value: "Any" },
    { label: "Lifestyle", value: "Moderate" },
    { label: "Values", value: "Traditional" },
  ];
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-left shadow-sm space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-2">
          <span className="text-[8.5px] text-neutral-400 whitespace-nowrap">{r.label}</span>
          <span className="text-[8.5px] font-semibold text-[#6B1B3D] bg-[#FFF3F0] px-1.5 py-0.5 rounded whitespace-nowrap">
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function MatchmakingVisual() {
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <div className="relative h-24 w-full flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="-56 -48 112 96">
        {angles.map((a) => {
          const rad = (a * Math.PI) / 180;
          const x = 40 * Math.cos(rad);
          const y = 34 * Math.sin(rad);
          return (
            <line key={a} x1="0" y1="0" x2={x} y2={y} stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
          );
        })}
      </svg>
      {angles.map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 40 * Math.cos(rad);
        const y = 34 * Math.sin(rad);
        return (
          <div
            key={a}
            className="absolute w-5 h-5 rounded-full bg-[#FFE5E0] border border-[#D4AF37]/50 flex items-center justify-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <PersonIcon className="w-2.5 h-2.5 text-[#6B1B3D]" />
          </div>
        );
      })}
      <div className="relative z-10 w-9 h-9 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center text-[10px] font-extrabold shadow-md">
        AI
      </div>
    </div>
  );
}

function MatchesVisual() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
      <div className="relative h-14 bg-gradient-to-br from-[#D4AF37]/30 to-[#6B1B3D]/20 flex items-center justify-center">
        <PersonIcon className="w-7 h-7 text-white/90" />
        <span className="absolute top-1 right-1 bg-[#6B1B3D] text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
          92% Match
        </span>
      </div>
      <div className="flex gap-1 p-1.5 bg-white">
        <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#FFF3F0] text-[#6B1B3D] whitespace-nowrap">Education</span>
        <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#FFF3F0] text-[#6B1B3D] whitespace-nowrap">Lifestyle</span>
      </div>
    </div>
  );
}

function ChatVisual() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm space-y-1.5">
      <div className="flex justify-start">
        <span className="text-[8px] bg-neutral-100 text-neutral-700 px-2 py-1 rounded-lg rounded-bl-none max-w-[88%] leading-snug">
          Hi! I liked your profile.
        </span>
      </div>
      <div className="flex justify-end">
        <span className="text-[8px] bg-[#6B1B3D] text-white px-2 py-1 rounded-lg rounded-br-none max-w-[88%] leading-snug">
          Thank you! Nice to meet you too.
        </span>
      </div>
    </div>
  );
}

function RelationshipVisual() {
  return (
    <div className="h-24 w-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#FFE5E0] border-2 border-white shadow flex items-center justify-center -mr-3">
        <PersonIcon className="w-6 h-6 text-[#6B1B3D]" />
      </div>
      <div className="relative z-10 w-7 h-7 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center shadow-md">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div className="w-12 h-12 rounded-full bg-[#FFF3F0] border-2 border-white shadow flex items-center justify-center -ml-3">
        <PersonIcon className="w-6 h-6 text-[#D4AF37]" />
      </div>
    </div>
  );
}

function StepDetailCard({ step }: { step: StepDetail }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-[0_12px_32px_rgba(107,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 p-3.5 sm:p-4 flex flex-col">
      <h3 className="text-center text-[11px] sm:text-xs font-bold text-[#6B1B3D] mb-3 leading-snug">
        {step.number}. {step.title}
      </h3>
      <div className="mb-3 flex items-center justify-center">{step.visual}</div>
      <ul className="space-y-1.5 mb-4 flex-1">
        {step.bullets.map((b) => (
          <CheckBullet key={b}>{b}</CheckBullet>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1 self-center px-2.5 py-1 rounded-full bg-[#FFF3F0] text-[9px] sm:text-[10px] font-semibold text-[#6B1B3D] whitespace-nowrap">
        <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {step.badge}
      </span>
    </div>
  );
}

function ProcessArrow() {
  return (
    <svg className="hidden sm:block w-10 h-4 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 40 16">
      <path d="M0 8h32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M28 3l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroCopy() {
  return (
    <div className="max-w-full sm:max-w-sm md:max-w-lg">
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-xs font-semibold tracking-wide mb-4 w-fit">
        <svg className="w-3.5 h-3.5 fill-[#6B1B3D]" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        SIMPLE &bull; SMART &bull; MEANINGFUL
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#5a1030" }}>
        How VivaahAI
        <br />
        Works
      </h1>

      <div className="flex items-center gap-2 my-4">
        <span className="h-px w-10 bg-[#D4AF37]/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>

      <p className="text-neutral-700 font-medium text-sm sm:text-base md:text-lg mb-2">
        Find your perfect partner in 4 simple steps
      </p>
      <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-sm">
        Our AI-powered platform makes meaningful connections effortless, secure, and personalized for you.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        {/* Mobile: image on top, copy stacked below in normal flow */}
        <div className="sm:hidden">
          <div className="relative w-full aspect-[1213/791]">
            <Image
              src="/Images/how-it-works-hero.png"
              alt="Couple who found each other through VivaahAI"
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="container-safe py-8">
            <HeroCopy />
          </div>
        </div>

        {/* sm and up: image fills the right side, copy overlays on the left */}
        <div className="hidden sm:block relative">
          {/* Image box: width-driven aspect-ratio matching the pre-cropped hero photo, so the couple + heart always show fully framed with zero leftover gap */}
          <div className="ml-auto w-3/5 md:w-1/2 lg:w-[55%]">
            <div className="relative w-full aspect-[1213/791]">
              <Image
                src="/Images/how-it-works-hero.png"
                alt="Couple who found each other through VivaahAI"
                fill
                priority
                className="object-contain object-right"
                sizes="55vw"
              />
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 30%, transparent 50%)" }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <HeroCopy />
          </div>
        </div>
      </section>

      {/* A Closer Look at Each Step */}
      <section className="py-20 bg-white">
        <div className="container-safe">
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="h-px w-10 bg-[#D4AF37]/50" />
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.15em] text-[#D4AF37] uppercase whitespace-nowrap">
              A Closer Look at Each Step
            </h2>
            <span className="h-px w-10 bg-[#D4AF37]/50" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {STEP_DETAILS.map((step) => (
              <StepDetailCard key={step.title} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Matching Process */}
      <section className="pb-20 bg-white">
        <div className="container-safe">
          <div className="bg-[#FFF8F4] border border-neutral-100 rounded-3xl px-8 py-10 md:px-12">
            <h2 className="text-center text-xl md:text-2xl font-bold text-neutral-900 mb-10">
              Our Matching Process
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-2">
              {PROCESS_NODES.map((node, i) => (
                <div key={node.label} className="flex items-center gap-2 sm:gap-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-[#D4AF37] text-[#6B1B3D] flex items-center justify-center shadow-sm mb-3">
                      {node.icon}
                    </div>
                    <span className="text-sm font-semibold text-neutral-800 whitespace-nowrap">{node.label}</span>
                  </div>
                  {i < PROCESS_NODES.length - 1 && <ProcessArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-20 bg-white">
        <div className="container-safe">
          <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to start your journey?
              </h2>
              <p className="text-white/80 text-base md:text-lg">Join thousands of successful stories.</p>
            </div>
            <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap">
              Create Your Profile
            </SmartSignupLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
