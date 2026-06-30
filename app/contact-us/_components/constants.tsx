import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReachOption {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  variant: "link" | "button";
}

export interface TrustStat {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Inquiry {
  icon: ReactNode;
  title: string;
  email: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactTestimonial {
  name: string;
  image: string;
  quote: string;
  date: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const REACH_OPTIONS: ReachOption[] = [
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

export const TRUST_STATS: TrustStat[] = [
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

export const RESPONSE_PROMISES: string[] = [
  "We respond to all inquiries within 24 hours.",
  "Urgent issues are prioritized.",
  "We're here to support you at every step of your journey.",
];

export const CONTACT_TESTIMONIALS: ContactTestimonial[] = [
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

export const OTHER_INQUIRIES: Inquiry[] = [
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

export const FAQS_LEFT: Faq[] = [
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

export const FAQS_RIGHT: Faq[] = [
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
