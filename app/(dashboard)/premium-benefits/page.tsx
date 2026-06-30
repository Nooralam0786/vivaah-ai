'use client';

import { useState } from 'react';

const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 999,
    period: '3 months',
    icon: '🥈',
    color: 'border-neutral-300',
    header: 'bg-neutral-100',
    badge: '',
    features: [
      '50 Interests per month',
      'View 20 contact numbers',
      'Chat with matches',
      'Profile highlighted in search',
      'Basic AI recommendations',
      'Email support',
    ],
    cta: 'Get Silver',
    ctaClass: 'bg-neutral-700 hover:bg-neutral-800',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1999,
    period: '6 months',
    icon: '🥇',
    color: 'border-gold-500 ring-2 ring-gold-400/30',
    header: 'bg-gold-gradient',
    badge: 'Most Popular',
    features: [
      'Unlimited Interests',
      'Unlimited contact access',
      'Priority chat support',
      'Profile Boost (2x visibility)',
      'Advanced AI recommendations',
      'Video calling (30 min/day)',
      'Family Connect feature',
      'Dedicated relationship manager',
    ],
    cta: 'Get Gold',
    ctaClass: 'bg-gold-gradient text-neutral-900 hover:opacity-90',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 3999,
    period: '1 year',
    icon: '💎',
    color: 'border-primary-700 ring-2 ring-primary-700/20',
    header: 'bg-premium-gradient',
    badge: 'Best Value',
    features: [
      'Everything in Gold',
      'Unlimited video calling',
      'Profile featured on homepage',
      'Background verification included',
      'Kundali matching AI',
      'Personal stylist consultation',
      'VIP event invitations',
      'Priority customer support (24/7)',
      'Full access to all features',
    ],
    cta: 'Get Platinum',
    ctaClass: 'bg-primary-gradient hover:opacity-90',
  },
];

const TESTIMONIALS = [
  { name: 'Arjun & Divya', text: 'We found each other through VivaahAI Gold plan and got married in 3 months!', date: 'March 2024', avatar: '💑' },
  { name: 'Rohan & Priya', text: 'The AI recommendations were spot on. The Platinum plan was worth every penny.', date: 'January 2024', avatar: '👫' },
];

export default function PremiumPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="bg-premium-gradient rounded-2xl p-8 text-white text-center">
        <div className="text-4xl mb-3">👑</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Unlock Premium Membership</h1>
        <p className="text-white/70 max-w-lg mx-auto">Get verified contacts, unlimited messages, AI-powered matches, and exclusive features to find your perfect match faster.</p>
      </div>

      {/* Features Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '💬', label: 'Unlimited Messaging', desc: 'Chat with all matches' },
          { icon: '📱', label: 'Contact Access', desc: 'Get real phone numbers' },
          { icon: '🤖', label: 'AI Recommendations', desc: 'Smart match suggestions' },
          { icon: '🚀', label: 'Profile Boost', desc: '2x more visibility' },
        ].map((f) => (
          <div key={f.label} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-sm font-semibold text-neutral-900">{f.label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-neutral-900' : 'text-neutral-400'}`}>Monthly</span>
        <button onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'yearly' ? 'bg-primary-700' : 'bg-neutral-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-neutral-900' : 'text-neutral-400'}`}>
          Yearly <span className="text-green-600 text-xs font-bold">Save 20%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {PLANS.map((plan) => (
          <div key={plan.id}
            className={`bg-white rounded-2xl border-2 ${plan.color} overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${selected === plan.id ? 'scale-[1.02]' : ''}`}>
            {/* Plan Header */}
            <div className={`${plan.header} p-5 text-center relative`}>
              {plan.badge && (
                <div className="absolute top-3 right-3 bg-white/90 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}
              <div className="text-4xl mb-2">{plan.icon}</div>
              <h3 className={`text-xl font-bold ${plan.id === 'gold' ? 'text-neutral-900' : plan.id === 'platinum' ? 'text-white' : 'text-neutral-700'}`}>
                {plan.name}
              </h3>
              <div className={`mt-2 ${plan.id === 'platinum' ? 'text-white' : plan.id === 'gold' ? 'text-neutral-900' : 'text-neutral-700'}`}>
                <span className="text-2xl sm:text-3xl font-bold">₹{billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}</span>
                <span className="text-sm opacity-70"> / {plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <div className="p-5">
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setSelected(plan.id)}
                className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all ${plan.ctaClass} text-white ${selected === plan.id ? 'ring-2 ring-offset-2 ring-primary-700' : ''}`}>
                {selected === plan.id ? '✓ Selected' : plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      {selected && (
        <div className="text-center px-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-primary-gradient text-white rounded-2xl text-sm sm:text-base font-bold hover:opacity-90 transition-opacity shadow-lg animate-bounce-soft">
            Proceed to Payment → {PLANS.find((p) => p.id === selected)?.name} Plan
          </button>
        </div>
      )}

      {/* Testimonials */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 mb-4 text-center">Success Stories from Premium Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
              <div className="text-3xl mb-3">{t.avatar}</div>
              <p className="text-sm text-neutral-700 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold text-sm text-neutral-900">{t.name}</span>
                <span className="text-xs text-neutral-400">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-neutral-400">All plans include a 7-day money-back guarantee. Cancel anytime. Secure payment via Razorpay.</p>
    </div>
  );
}
