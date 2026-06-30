import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  icon: ReactNode;
  label: string;
}

export interface BlogPost {
  image: string;
  date: string;
  title: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    label: "Relationship",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    label: "Marriage Tips",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="8" cy="15" r="5" />
        <circle cx="16" cy="15" r="5" />
        <path strokeLinecap="round" d="M12 4v4" />
      </svg>
    ),
  },
  {
    label: "Family",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Success Stories",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
  {
    label: "Dating",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: "Safety",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export const LATEST_BLOGS: BlogPost[] = [
  {
    image: "/Images/sucess story2.png",
    date: "12 May 2024",
    title: "10 Signs You've Found the Right Partner",
  },
  {
    image: "/Images/Ashish & Shubh .png",
    date: "10 May 2024",
    title: "How to Build a Strong Relationship",
  },
  {
    image: "/Images/sucess story 3.png",
    date: "08 May 2024",
    title: "Involving Families in Your Journey",
  },
  {
    image: "/Images/wedding.png",
    date: "05 May 2024",
    title: "5 Relationship Goals for a Happy Marriage",
  },
];
