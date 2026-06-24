"use client";

import { useState } from "react";
import Link from "next/link";
import { VIDEOS, type VideoStory } from "../data";
import {
  ArrowRight,
  CTASection,
  SiteFooter,
  SiteHeader,
  StoryDetailModal,
  VideoCard,
} from "../components";

export default function AllVideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoStory | null>(null);

  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <section className="bg-[#FFF8F4] py-10 sm:py-14">
        <div className="container-safe">
          <Link
            href="/success-stories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors mb-4"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Back to Success Stories
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">Video Testimonials</h1>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl">
            Hear it straight from the couples — real conversations about how they found each other on VivaahAI.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-safe">
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
