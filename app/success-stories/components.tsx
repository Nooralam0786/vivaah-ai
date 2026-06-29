"use client";

import { useEffect } from "react";
import Link from "next/link";
import SmartSignupLink from "@/components/site/SmartSignupLink";
import Image from "next/image";
import type { Couple, VideoStory } from "./data";

export { default as Logo } from "@/components/site/Logo";
export { default as SiteHeader } from "@/components/site/SiteHeader";
export { default as SiteFooter } from "@/components/site/SiteFooter";

// ─── Shared bits ────────────────────────────────────────────────────────────

export function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function SectionHeader({
  title,
  linkLabel,
  linkHref,
}: {
  title: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <div className="flex items-end sm:items-center justify-between mb-8 gap-3">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h2>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
      >
        {linkLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-3 text-center md:text-left">
            <svg className="w-7 h-7 text-[#D4AF37] flex-shrink-0 hidden sm:block" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Your love story could be next.</h2>
              <p className="text-white/80 text-base">Join VivaahAI today and find your perfect match.</p>
            </div>
          </div>
          <SmartSignupLink className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap">
            Find Your Match
            <ArrowRight />
          </SmartSignupLink>
        </div>
      </div>
    </section>
  );
}

// ─── Cards ──────────────────────────────────────────────────────────────────

export function CoupleCard({ couple, onOpen }: { couple: Couple; onOpen: (couple: Couple) => void }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-[0_12px_32px_rgba(107,27,61,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
        <Image
          src={couple.image}
          alt={couple.names}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center shadow-md">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.17 17q-1.4 0-2.285-.957Q4 15.086 4 13.65q0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2T10.5 5.5l.625 1.3q-1.45.65-2.45 1.8T7.05 11q.4-.225.825-.3T8.7 10.6q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q9.8 17 7.17 17Zm9.5 0q-1.4 0-2.285-.957-.885-.958-.885-2.393 0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2t2.525-1.325l.625 1.3q-1.45.65-2.45 1.8T16.55 11q.4-.225.825-.3t.825-.075q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q19.3 17 16.67 17Z" />
          </svg>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-neutral-900 mb-1.5">{couple.names}</h3>
        <p className="text-sm text-neutral-500 italic leading-relaxed mb-3">&ldquo;{couple.quote}&rdquo;</p>
        <button
          type="button"
          onClick={() => onOpen(couple)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors"
        >
          Read Their Story
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function VideoCard({ video, onOpen }: { video: VideoStory; onOpen: (video: VideoStory) => void }) {
  return (
    <button type="button" onClick={() => onOpen(video)} className="group text-left cursor-pointer">
      <div className="relative h-52 sm:h-56 w-full overflow-hidden rounded-2xl shadow-sm group-hover:shadow-[0_12px_32px_rgba(107,27,61,0.2)] transition-shadow duration-300">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 ml-0.5 fill-[#6B1B3D]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
          {video.duration}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-neutral-800">{video.title}</p>
    </button>
  );
}

// ─── Detail modal (shared between couple stories and video testimonials) ────

interface StoryDetailModalProps {
  open: boolean;
  onClose: () => void;
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  meta?: string;
  body: string;
  showPlayIcon?: boolean;
}

export function StoryDetailModal({
  open,
  onClose,
  image,
  imageAlt,
  eyebrow,
  title,
  meta,
  body,
  showPlayIcon,
}: StoryDetailModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[88vh] grid grid-cols-1 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-600 hover:text-[#6B1B3D] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-56 sm:h-auto">
          <Image src={image} alt={imageAlt} fill className="object-cover" />
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 ml-0.5 fill-[#6B1B3D]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {eyebrow && (
            <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide mb-1">{eyebrow}</p>
          )}
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">{title}</h3>
          {meta && <p className="text-sm text-neutral-400 mb-4">{meta}</p>}
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{body}</p>

          <SmartSignupLink className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#6B1B3D] text-white text-sm font-semibold rounded-xl hover:bg-[#581630] transition-colors">
            Find Your Match
            <ArrowRight className="w-3.5 h-3.5" />
          </SmartSignupLink>
        </div>
      </div>
    </div>
  );
}
