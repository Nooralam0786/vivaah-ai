"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  icon: ReactNode;
  label: string;
}

interface BlogPost {
  image: string;
  date: string;
  title: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
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

const LATEST_BLOGS: BlogPost[] = [
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Petal({ className }: { className: string }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 24 24" fill="#E89A8A">
      <path d="M12 2c3 3 5 6 5 9a5 5 0 11-10 0c0-3 2-6 5-9z" opacity="0.55" />
    </svg>
  );
}

function CategoryPill({ category }: { category: Category }) {
  return (
    <button
      type="button"
      className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-neutral-200 hover:border-[#6B1B3D] hover:bg-[#6B1B3D]/5 transition-colors text-left"
    >
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center group-hover:bg-[#6B1B3D] group-hover:text-white transition-colors">
        {category.icon}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-neutral-700 group-hover:text-[#6B1B3D]">
        {category.label}
      </span>
    </button>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-[0_12px_32px_rgba(107,27,61,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-400 mb-1.5">{post.date}</p>
        <h3 className="text-sm font-bold text-neutral-900 mb-3 leading-snug">{post.title}</h3>
        <Link
          href="#"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors"
        >
          Read More
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        <div className="relative min-h-[300px] sm:min-h-[340px] md:min-h-[380px]">
          <div className="absolute inset-0 sm:right-0 sm:left-auto sm:w-3/5 md:w-1/2 lg:w-[55%]">
            <Image
              src="/Images/safety.png"
              alt="Couple reading relationship advice on VivaahAI"
              fill
              priority
              className="object-cover object-[50%_30%]"
              sizes="(max-width: 640px) 100vw, 55vw"
            />
          </div>

          {/* decorative floating petals */}
          <Petal className="w-5 h-5 top-[12%] left-[58%] rotate-12 hidden sm:block" />
          <Petal className="w-4 h-4 top-[24%] left-[68%] -rotate-12 hidden sm:block" />
          <Petal className="w-3 h-3 top-[40%] left-[52%] rotate-45 hidden sm:block" />
          <Petal className="w-4 h-4 top-[18%] left-[40%] rotate-90" />

          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 40%, rgba(255,229,224,0.4) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 28%, transparent 48%)",
            }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-full sm:max-w-xs md:max-w-md">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-1.5" style={{ color: "#5a1030" }}>
                Blog &amp; Relationship Advice
              </h1>
              <p className="text-neutral-600 text-xs sm:text-sm md:text-base mb-4 max-w-xs leading-relaxed">
                Expert tips, real stories and relationship advice to help you on your journey.
              </p>

              <div className="flex items-center bg-white rounded-xl shadow-md border border-neutral-100 p-1.5 max-w-xs">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm text-neutral-700 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#6B1B3D] hover:bg-[#581630] text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post + Categories — overlaps the hero/section boundary */}
      <section className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-14 md:-mt-16 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-5 sm:p-7 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-8">
          {/* Featured Post */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden">
              <Image src="/Images/sucess story.png" alt="Featured post" fill className="object-cover" />
              <span className="absolute top-2 left-2 bg-[#6B1B3D] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                Featured Post
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 leading-snug">
                How AI is Transforming Modern Matchmaking
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                Discover how artificial intelligence helps you find deeper, more meaningful connections.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors w-fit"
              >
                Read More
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t md:border-t-0 md:border-l border-neutral-100 pt-5 md:pt-0 md:pl-8">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((c) => (
                <CategoryPill key={c.label} category={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="pb-16 sm:pb-20">
        <div className="container-safe">
          <div className="flex items-end sm:items-center justify-between mb-8 gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Latest Blogs</h2>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              View all blogs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LATEST_BLOGS.map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-16 sm:pb-20">
        <div className="container-safe">
          <div className="bg-[#6B1B3D] rounded-2xl px-6 sm:px-10 py-7 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Stay Updated with Relationship Tips</h2>
                <p className="text-sm text-white/70 mt-0.5">Subscribe to our newsletter and never miss an update.</p>
              </div>
            </div>
            <div className="flex w-full md:w-auto gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="button"
                className="flex-shrink-0 px-5 py-3 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
