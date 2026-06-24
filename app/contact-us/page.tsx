"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { getAuthFromStorage } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReachOption {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  variant: "link" | "button";
}

interface TrustStat {
  icon: ReactNode;
  title: string;
  description: string;
}

interface Inquiry {
  icon: ReactNode;
  title: string;
  email: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface ContactTestimonial {
  name: string;
  image: string;
  quote: string;
  date: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REACH_OPTIONS: ReachOption[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Live Chat",
    description: "Chat with our support team in real-time.",
    actionLabel: "Start Chat",
    actionHref: "#",
    variant: "button",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Email Support",
    description: "Drop us an email and we'll get back to you.",
    actionLabel: "support@vivaahai.com",
    actionHref: "mailto:support@vivaahai.com",
    variant: "link",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: "Phone Support",
    description: "Call us between 9 AM – 9 PM (IST)",
    actionLabel: "+91 98765 43210",
    actionHref: "tel:+919876543210",
    variant: "link",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Help Center",
    description: "Find answers to common questions.",
    actionLabel: "Visit Help Center",
    actionHref: "#",
    variant: "button",
  },
];

const TRUST_STATS: TrustStat[] = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "100% Secure",
    description: "Your data is encrypted and protected.",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy First",
    description: "Your privacy and safety come first always.",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-1.042.133-2.052.382-3.016A8.97 8.97 0 0012 3c2.13 0 4.078.78 5.572 2.07.225.194.45.397.665.61A8.967 8.967 0 0121 12z" />
      </svg>
    ),
    title: "Verified Support",
    description: "Our team is trained and trusted.",
  },
];

const RESPONSE_PROMISES: string[] = [
  "We respond to all inquiries within 24 hours.",
  "Urgent issues are prioritized.",
  "We're here to support you at every step of your journey.",
];

const CONTACT_TESTIMONIALS: ContactTestimonial[] = [
  {
    name: "Priya & Arjun",
    image: "/Images/sucess story.png",
    quote:
      "The VivaahAI support team was incredibly helpful and guided me through every step. I felt supported and valued throughout my journey.",
    date: "Married in Feb 2024",
  },
  {
    name: "Neha & Karan",
    image: "/Images/sucess story2.png",
    quote:
      "Whenever I had a question, the team responded within hours. It made the whole process so much easier and stress-free.",
    date: "Married in Nov 2023",
  },
  {
    name: "Sneha & Rohan",
    image: "/Images/sucess story 3.png",
    quote: "I felt safe and supported from day one. The support team truly cares about your journey.",
    date: "Married in Jan 2024",
  },
];

const OTHER_INQUIRIES: Inquiry[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Partnerships",
    email: "partner@vivaahai.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    title: "Media & Press",
    email: "media@vivaahai.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Feedback & Suggestions",
    email: "feedback@vivaahai.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Billing & Payments",
    email: "billing@vivaahai.com",
  },
];

const FAQS_LEFT: Faq[] = [
  {
    question: "How quickly will I get a response?",
    answer:
      "We typically respond within 24 hours. For urgent issues, our team prioritizes and responds as soon as possible.",
  },
  {
    question: "How can I update my profile information?",
    answer: "Go to your Profile settings from the dashboard menu, where you can edit and save your details anytime.",
  },
  {
    question: "I found a technical issue. What should I do?",
    answer: "Please report it via Contact Support with as much detail as possible so our team can resolve it quickly.",
  },
];

const FAQS_RIGHT: Faq[] = [
  {
    question: "How do I report a user?",
    answer: "Open the user's profile and tap \"Report\", or reach out to our support team with the profile details.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes. All personal data is encrypted and never shared with third parties without your consent.",
  },
  {
    question: "How do I cancel my premium subscription?",
    answer: "Go to Settings → Subscription and select Cancel Plan. You'll retain access until the billing period ends.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ArrowIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <span className="h-px w-10 bg-[#D4AF37]/50" />
      <h2 className="text-xl sm:text-2xl font-bold text-[#6B1B3D]">{title}</h2>
      <span className="h-px w-10 bg-[#D4AF37]/50" />
    </div>
  );
}

function ReachCard({ option }: { option: ReachOption }) {
  return (
    <div className="group flex flex-col items-center text-center px-2 py-4 cursor-default transition-transform duration-300 hover:-translate-y-1.5">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF3F0] text-[#6B1B3D] flex items-center justify-center mb-4 shadow-sm transition-all duration-300 group-hover:bg-[#6B1B3D] group-hover:text-white group-hover:scale-110">
        {option.icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1.5">{option.title}</h3>
      <p className="text-xs text-neutral-500 leading-relaxed mb-4 max-w-[160px]">{option.description}</p>
      {option.variant === "button" ? (
        <Link
          href={option.actionHref}
          className="text-xs font-semibold border border-neutral-200 text-neutral-700 hover:border-[#6B1B3D] hover:text-[#6B1B3D] px-4 py-2 rounded-lg transition-colors"
        >
          {option.actionLabel}
        </Link>
      ) : (
        <Link href={option.actionHref} className="text-xs font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors">
          {option.actionLabel}
        </Link>
      )}
    </div>
  );
}

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        open ? "border-[#6B1B3D]/40 bg-[#FFF8F4]" : "border-neutral-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left"
      >
        <span className={`text-sm font-semibold ${open ? "text-[#6B1B3D]" : "text-neutral-800"}`}>{faq.question}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-neutral-500 transition-transform duration-300 ${open ? "rotate-180 text-[#6B1B3D]" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-4 sm:px-5 pb-4 text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactUsPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>("How quickly will I get a response?");

  const [contactForm, setContactForm] = useState({ fullName: "", email: "", subject: "", message: "" });
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

  const testimonial = CONTACT_TESTIMONIALS[testimonialIndex];

  const goPrev = () =>
    setTestimonialIndex((i) => (i === 0 ? CONTACT_TESTIMONIALS.length - 1 : i - 1));
  const goNext = () =>
    setTestimonialIndex((i) => (i === CONTACT_TESTIMONIALS.length - 1 ? 0 : i + 1));

  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
        <div className="relative">
          <div className="ml-auto w-full sm:w-3/5 md:w-1/2 lg:w-[55%]">
            <div className="relative w-full aspect-[1622/970]">
              <Image
                src="/Images/safety.png"
                alt="Couple connecting with VivaahAI support"
                fill
                priority
                className="object-contain object-right"
                sizes="(max-width: 640px) 100vw, 55vw"
              />
              <HeartIcon className="absolute w-4 h-4 text-[#E89A8A]/70 top-[14%] left-[58%] hidden sm:block" />
              <HeartIcon className="absolute w-3 h-3 text-[#E89A8A]/60 top-[30%] left-[68%] hidden sm:block" />
            </div>
          </div>

          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 45%, rgba(255,229,224,0.35) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 30%, transparent 50%)",
            }}
          />

          <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-full sm:max-w-sm md:max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-xs font-semibold mb-4 w-fit">
                <HeartIcon className="w-3.5 h-3.5" />
                We&rsquo;re Here to Help
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: "#5a1030" }}>
                Contact Us
              </h1>
              <p className="text-neutral-700 font-semibold text-base sm:text-lg mb-3">We&rsquo;re just a message away.</p>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
                Have questions or need assistance? Our support team is here to help you on your journey to find
                meaningful connections.
              </p>
              <Link
                href="#contact-form"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm whitespace-nowrap w-fit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Send Us a Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Reach Us */}
      <section className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-14 md:-mt-16 pb-14 sm:pb-16">
        <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 sm:p-8">
          <SectionHeading title="Ways to Reach Us" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {REACH_OPTIONS.map((o) => (
              <ReachCard key={o.title} option={o} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust + Response Promise */}
      <section className="pb-14 sm:pb-16">
        <div className="container-safe grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">Your Trust is Our Priority</h2>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  We are committed to providing a safe, secure, and respectful experience for everyone.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-neutral-100">
              {TRUST_STATS.map((s) => (
                <div key={s.title}>
                  <div className="w-7 h-7 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center mb-2">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-neutral-900">{s.title}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{s.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#FFF3F0] rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
            <svg className="pointer-events-none absolute -bottom-4 -right-2 w-28 h-28 text-[#D4AF37]/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 relative z-10">Our Response Promise</h2>
            <ul className="relative z-10 space-y-3">
              {RESPONSE_PROMISES.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.364 6.3-2.228-2.207a1 1 0 00-1.408 1.42l2.932 2.903a1 1 0 001.408 0l7.068-7.004z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial carousel */}
      <section className="pb-14 sm:pb-16">
        <div className="container-safe">
          <div className="relative mx-auto max-w-3xl bg-[#FFF8F4] rounded-2xl px-6 sm:px-14 py-8 sm:py-10 text-center">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white transition-colors"
            >
              <ArrowIcon className="w-4 h-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white transition-colors"
            >
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-white shadow-md">
              <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
            </div>
            <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed max-w-xl mx-auto mb-4">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="text-sm font-bold text-[#6B1B3D]">— {testimonial.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{testimonial.date}</p>

            <div className="flex items-center justify-center gap-2 mt-6">
              {CONTACT_TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === testimonialIndex ? "w-6 bg-[#6B1B3D]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Send Us a Message */}
      <section id="contact-form" className="pb-14 sm:pb-16 scroll-mt-20">
        <div className="container-safe">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6B1B3D] mb-2">Send Us a Message</h2>
            <span className="block w-12 h-0.5 bg-[#D4AF37] mx-auto mb-3" />
            <p className="text-sm sm:text-base text-neutral-500">
              Fill out the form below and our team will get back to you soon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
            <form onSubmit={handleContactSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:border-[#6B1B3D] transition-colors"
                >
                  <option value="">What is this regarding?</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing">Billing</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Report a Profile">Report a Profile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors resize-none"
                />
              </div>

              {submitResult && (
                <p className={`text-sm rounded-lg px-3 py-2 border ${submitResult.type === "success" ? "text-green-700 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"}`}>
                  {submitResult.message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                {submitting ? "Sending…" : "Send Message"}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Your information is secure and will never be shared.
              </p>
            </form>

            <div className="bg-[#FFF3F0] rounded-2xl p-6 sm:p-7 h-fit">
              <h3 className="text-base font-bold text-neutral-900 mb-5">Other Inquiries</h3>
              <div className="space-y-4">
                {OTHER_INQUIRIES.map((inq) => (
                  <div key={inq.title} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-[#6B1B3D] flex items-center justify-center shadow-sm">
                      {inq.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">{inq.title}</div>
                      <a href={`mailto:${inq.email}`} className="text-xs text-[#6B1B3D] hover:text-[#D4AF37] transition-colors">
                        {inq.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-14 sm:pb-16">
        <div className="container-safe">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {FAQS_LEFT.map((f) => (
                <FaqItem
                  key={f.question}
                  faq={f}
                  open={openFaq === f.question}
                  onToggle={() => setOpenFaq((cur) => (cur === f.question ? null : f.question))}
                />
              ))}
            </div>
            <div className="space-y-3">
              {FAQS_RIGHT.map((f) => (
                <FaqItem
                  key={f.question}
                  faq={f}
                  open={openFaq === f.question}
                  onToggle={() => setOpenFaq((cur) => (cur === f.question ? null : f.question))}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="pb-16 sm:pb-20">
        <div className="container-safe">
          <div className="bg-[#6B1B3D] rounded-2xl px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                <HeartIcon className="w-6 h-6 text-[#D4AF37]" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Still need help?</h2>
                <p className="text-sm text-white/70 mt-0.5">Our support team is available 24/7 to assist you on your journey.</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg text-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Live Chat
              </Link>
              <span className="text-xs text-white/60">Available: 9 AM – 9 PM (IST)</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
