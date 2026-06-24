"use client";

import { useState } from "react";
import Link from "next/link";
import { COUPLES, type Couple } from "../data";
import {
  ArrowRight,
  CTASection,
  CoupleCard,
  SiteFooter,
  SiteHeader,
  StoryDetailModal,
} from "../components";

export default function AllStoriesPage() {
  const [selectedCouple, setSelectedCouple] = useState<Couple | null>(null);

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
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">Happy Couples</h1>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl">
            Every match on VivaahAI has a story. Here are all the couples who found each other and said yes.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-safe">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COUPLES.map((c) => (
              <CoupleCard key={c.id} couple={c} onOpen={setSelectedCouple} />
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
    </main>
  );
}
