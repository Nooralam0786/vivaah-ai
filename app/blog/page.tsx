"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroSection from "./_components/HeroSection";
import FeaturedSection from "./_components/FeaturedSection";
import LatestBlogsSection from "./_components/LatestBlogsSection";
import NewsletterSection from "./_components/NewsletterSection";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <HeroSection />
      <FeaturedSection />
      <LatestBlogsSection />
      <NewsletterSection />

      <SiteFooter />
    </main>
  );
}
