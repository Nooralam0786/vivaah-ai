"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroSection from "./_components/HeroSection";
import StepsSection from "./_components/StepsSection";
import MatchingProcessSection from "./_components/MatchingProcessSection";
import CtaBannerSection from "./_components/CtaBannerSection";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <HeroSection />
      <StepsSection />
      <MatchingProcessSection />
      <CtaBannerSection />

      <SiteFooter />
    </main>
  );
}
