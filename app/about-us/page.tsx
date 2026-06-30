"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroSection from "./_components/HeroSection";
import JourneySection from "./_components/JourneySection";
import DifferentiatorsSection from "./_components/DifferentiatorsSection";
import CoreValuesSection from "./_components/CoreValuesSection";
import StorySection from "./_components/StorySection";
import MemberTestimonialsSection from "./_components/MemberTestimonialsSection";
import CtaBannerSection from "./_components/CtaBannerSection";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <HeroSection />
      <JourneySection />
      <DifferentiatorsSection />
      <CoreValuesSection />
      <StorySection />
      <MemberTestimonialsSection />
      <CtaBannerSection />

      <SiteFooter />
    </main>
  );
}
