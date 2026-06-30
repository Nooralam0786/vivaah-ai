"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroSection from "./_components/HeroSection";
import WhyChooseSection from "./_components/WhyChooseSection";
import SuccessStoriesSection from "./_components/SuccessStoriesSection";
import CtaBannerSection from "./_components/CtaBannerSection";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <HeroSection />
      <WhyChooseSection />
      <SuccessStoriesSection />
      <CtaBannerSection />

      <SiteFooter />
    </main>
  );
}
