import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrustBadge {
  icon: ReactNode;
  text: string;
  description: string;
}

export interface Stat {
  icon: ReactNode;
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  date: string;
  image: string;
  quote: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const TRUST_BADGES: TrustBadge[] = [
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

export const STATS: Stat[] = [
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

export const TESTIMONIALS: Testimonial[] = [
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
