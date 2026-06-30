"use client";

import { useState } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { getAuthFromStorage } from "@/lib/auth";
import HeroSection from "./_components/HeroSection";
import ReachSection from "./_components/ReachSection";
import TrustPromiseSection from "./_components/TrustPromiseSection";
import TestimonialSection from "./_components/TestimonialSection";
import ContactFormSection, { type ContactFormState } from "./_components/ContactFormSection";
import FaqSection from "./_components/FaqSection";
import StillNeedHelpSection from "./_components/StillNeedHelpSection";
import { CONTACT_TESTIMONIALS } from "./_components/constants";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactUsPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>("How quickly will I get a response?");

  const [contactForm, setContactForm] = useState<ContactFormState>({ fullName: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const auth = getAuthFromStorage();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        },
        body: JSON.stringify(contactForm),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Failed to send your message");
      setSubmitResult({ type: "success", message: "Thanks! Your message has been sent — our team will get back to you soon." });
      setContactForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitResult({ type: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const goPrev = () =>
    setTestimonialIndex((i) => (i === 0 ? CONTACT_TESTIMONIALS.length - 1 : i - 1));
  const goNext = () =>
    setTestimonialIndex((i) => (i === CONTACT_TESTIMONIALS.length - 1 ? 0 : i + 1));

  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <HeroSection />
      <ReachSection />
      <TrustPromiseSection />
      <TestimonialSection
        testimonialIndex={testimonialIndex}
        onPrev={goPrev}
        onNext={goNext}
        onSelect={setTestimonialIndex}
      />
      <ContactFormSection
        contactForm={contactForm}
        setContactForm={setContactForm}
        submitting={submitting}
        submitResult={submitResult}
        onSubmit={handleContactSubmit}
      />
      <FaqSection
        openFaq={openFaq}
        onToggle={(question) => setOpenFaq((cur) => (cur === question ? null : question))}
      />
      <StillNeedHelpSection />

      <SiteFooter />
    </main>
  );
}
