"use client";

import { useState } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SmartSignupLink from "@/components/site/SmartSignupLink";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Plan {
  id: "free" | "premium" | "elite";
  name: string;
  monthlyPrice: number;
  badge?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    features: ["5 Matches Daily", "Basic Search", "Limited Profile Access", "View Limited Photos"],
    cta: "Current Plan",
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 1499,
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Unlimited Matches",
      "Advanced Search Filters",
      "Priority Listing",
      "Read Receipts",
      "Message First",
      "Family Connect",
    ],
    cta: "Upgrade Plan",
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPrice: 2999,
    features: [
      "All Premium Features",
      "Personal Matchmaker",
      "Highest Visibility",
      "VIP Support",
      "Background Verification",
    ],
    cta: "Upgrade Plan",
  },
];

interface CompareRow {
  label: string;
  free: string | boolean;
  premium: string | boolean;
  elite: string | boolean;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: "Daily Matches", free: "5", premium: "Unlimited", elite: "Unlimited" },
  { label: "Advanced Filters", free: false, premium: true, elite: true },
  { label: "Priority Listing", free: false, premium: true, elite: true },
  { label: "Message First", free: false, premium: true, elite: true },
  { label: "Personal Matchmaker", free: false, premium: false, elite: true },
  { label: "VIP Support", free: false, premium: false, elite: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 ${muted ? "text-neutral-300" : "text-green-500"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 text-neutral-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: "monthly" | "yearly" }) {
  const price = billing === "yearly" ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 ${
        plan.highlighted
          ? "border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(212,175,55,0.25)] lg:-translate-y-3"
          : "border border-neutral-200 shadow-sm"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#6B1B3D] text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
          {plan.badge}
        </span>
      )}

      <h3 className="text-lg font-bold text-neutral-900 text-center mb-3">{plan.name}</h3>

      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-[#6B1B3D]">₹{price}</span>
        <span className="text-sm text-neutral-500">/month</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-700">
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>

      <SmartSignupLink
        className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          plan.id === "free"
            ? "bg-neutral-100 text-neutral-500 cursor-default"
            : plan.id === "premium"
            ? "bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D]"
            : "bg-[#6B1B3D] hover:bg-[#581630] text-white"
        }`}
      >
        {plan.cta}
      </SmartSignupLink>
    </div>
  );
}

function CompareCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return <td className="py-4 px-4 text-center">{value ? <CheckIcon /> : <XIcon />}</td>;
  }
  return <td className="py-4 px-4 text-center text-sm text-neutral-700 font-medium">{value}</td>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="py-12 sm:py-16 text-center bg-gradient-to-b from-[#FFF8F4] to-white">
        <div className="container-safe">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Unlock Premium Features
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">
            Get more visibility, better matches and a faster connection.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${billing === "monthly" ? "text-neutral-900" : "text-neutral-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              aria-label="Toggle billing period"
              className={`relative w-12 h-6 rounded-full transition-colors ${billing === "yearly" ? "bg-[#6B1B3D]" : "bg-neutral-200"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  billing === "yearly" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billing === "yearly" ? "text-neutral-900" : "text-neutral-400"}`}>
              Yearly <span className="text-green-600 text-xs font-bold">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="container-safe">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto lg:items-center">
            {PLANS.map((plan) => (
              <div key={plan.id} className={plan.id === "elite" ? "sm:col-span-2 lg:col-span-1" : ""}>
                <PlanCard plan={plan} billing={billing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Plans */}
      <section className="pb-20">
        <div className="container-safe">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-10">Compare Plans</h2>

          <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="bg-[#FFF8F4]">
                  <th className="py-4 px-4 text-left text-sm font-bold text-neutral-900">Features</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-neutral-900">Free</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-[#6B1B3D]">Premium</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-neutral-900">Elite</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.label} className={i !== COMPARE_ROWS.length - 1 ? "border-b border-neutral-100" : ""}>
                    <td className="py-4 px-4 text-sm text-neutral-700">{row.label}</td>
                    <CompareCell value={row.free} />
                    <CompareCell value={row.premium} />
                    <CompareCell value={row.elite} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
