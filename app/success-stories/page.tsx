"use client";

import { useState } from "react";
import Image from "next/image";
import { COUPLES, VIDEOS, type Couple, type VideoStory } from "./data";
import {
  CTASection,
  CoupleCard,
  SectionHeader,
  SiteFooter,
  SiteHeader,
  StoryDetailModal,
  VideoCard,
} from "./components";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const STATS: Stat[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    value: "50K+",
    label: "Happy Matches",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.4a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM12 13.9V21M8.5 21h7" />
        <circle cx="12" cy="9.4" r="2" />
      </svg>
    ),
    value: "10K+",
    label: "Successful Marriages",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    value: "4.8/5",
    label: "Average Rating",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: "100%",
    label: "Verified Profiles",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    value: "Trusted by",
    label: "Millions",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuccessStoriesPage() {
  const [selectedCouple, setSelectedCouple] = useState<Couple | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoStory | null>(null);

  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        <div className="relative">
          {/* Image box: width-driven aspect-ratio so it always shows the full photo with zero crop and zero leftover gap */}
          <div className="ml-auto w-full sm:w-3/5 md:w-1/2 lg:w-[55%]">
            <div className="relative w-full aspect-[1624/968]">
              <Image
                src="/Images/success story.png"
                alt="Couple who found love through VivaahAI"
                fill
                priority
                className="object-contain object-right"
                sizes="(max-width: 640px) 100vw, 55vw"
              />
            </div>
          </div>

          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 45%, rgba(255,229,224,0.4) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,243,240,0.6) 32%, rgba(255,229,224,0.05) 50%, transparent 52%)",
            }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-full sm:max-w-md md:max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: "#5a1030" }}>
                Success Stories
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base md:text-lg mb-3">
                Real people, real stories, real connections.
              </p>
              <p className="text-sm sm:text-base text-neutral-500 max-w-md leading-relaxed">
                At VivaahAI, every match is more than an algorithm — it&rsquo;s the beginning of a beautiful journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar — overlaps the hero/section boundary, half on each */}
      <section className="relative z-20 px-4 sm:px-6 -mt-14 sm:-mt-16 md:-mt-20 pb-6 sm:pb-8">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg px-9 py-2.5 sm:px-11 sm:py-3 flex items-center gap-3 sm:gap-4 border border-neutral-200 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]"
            >
              <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
              <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

              <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
                {stat.icon}
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-[#6B1B3D] leading-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-neutral-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Happy Couples */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="container-safe">
          <SectionHeader title="Happy Couples" linkLabel="See all stories" linkHref="/success-stories/all" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COUPLES.map((c) => (
              <CoupleCard key={c.id} couple={c} onOpen={setSelectedCouple} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="pb-16 sm:pb-20 bg-[#FFF8F4]">
        <div className="container-safe pt-12 sm:pt-16">
          <SectionHeader title="Video Testimonials" linkLabel="See all videos" linkHref="/success-stories/videos" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEOS.map((v) => (
              <VideoCard key={v.id} video={v} onOpen={setSelectedVideo} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <SiteFooter />

      <StoryDetailModal
        open={!!selectedCouple}
        onClose={() => setSelectedCouple(null)}
        image={selectedCouple?.image ?? ""}
        imageAlt={selectedCouple?.names ?? ""}
        eyebrow={selectedCouple?.location}
        title={selectedCouple?.names ?? ""}
        meta={selectedCouple?.marriedSince}
        body={selectedCouple?.story ?? ""}
      />

      <StoryDetailModal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        image={selectedVideo?.thumbnail ?? ""}
        imageAlt={selectedVideo?.title ?? ""}
        eyebrow="Video Testimonial"
        title={selectedVideo?.title ?? ""}
        meta={selectedVideo?.duration}
        body={selectedVideo?.description ?? ""}
        showPlayIcon
      />
    </main>
  );
}
