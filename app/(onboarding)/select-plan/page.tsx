'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Check, Heart, Zap, Crown, Star, ArrowRight, Loader2, ShieldCheck, Lock } from 'lucide-react';

/* ── Plans ──────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free', label: 'Silver', price: 0, priceStr: 'Free', icon: Star, color: 'neutral',
    tagline: 'Start your journey',
    features: ['5 matches per day', 'Basic profile creation', 'Send interest to profiles', 'View profiles (limited)'],
    cta: 'Continue for Free',
  },
  {
    id: 'gold', label: 'Gold', price: 499, priceStr: '₹499/mo', icon: Zap, color: 'gold',
    tagline: 'Most popular', popular: true,
    features: ['Unlimited matches', 'Real-time messaging', 'Advanced search filters', 'See who viewed your profile', 'Priority support'],
    cta: 'Choose Gold',
  },
  {
    id: 'platinum', label: 'Platinum', price: 999, priceStr: '₹999/mo', icon: Crown, color: 'blue',
    tagline: 'Enhanced experience',
    features: ['Everything in Gold', 'Audio & Video calls', 'AI compatibility insights', 'Profile boost weekly', 'Dedicated support'],
    cta: 'Choose Platinum',
  },
  {
    id: 'diamond', label: 'Diamond', price: 2499, priceStr: '₹2,499/mo', icon: Heart, color: 'primary',
    tagline: 'Premium experience',
    features: ['Everything in Platinum', 'Concierge matchmaking', 'Family account access', 'Video profile upload', 'Background verification'],
    cta: 'Choose Diamond',
  },
] as const;

type PlanId = typeof PLANS[number]['id'];

const COLOR_MAP = {
  neutral: { card: 'border-neutral-200 hover:border-neutral-400', icon: 'bg-neutral-100 text-neutral-600', badge: '', button: 'bg-neutral-800 hover:bg-neutral-700 text-white', check: 'text-neutral-500', ring: 'ring-neutral-400' },
  gold:    { card: 'border-amber-300 hover:border-amber-400',     icon: 'bg-amber-100 text-amber-600',     badge: 'bg-amber-100 text-amber-700 border-amber-300',  button: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-900 font-bold', check: 'text-amber-500', ring: 'ring-amber-400' },
  blue:    { card: 'border-blue-300 hover:border-blue-400',       icon: 'bg-blue-100 text-blue-600',       badge: 'bg-blue-100 text-blue-700 border-blue-300',    button: 'bg-blue-600 hover:bg-blue-700 text-white',                                   check: 'text-blue-500',  ring: 'ring-blue-400'  },
  primary: { card: 'border-[#6B1B3D]/30 hover:border-[#6B1B3D]', icon: 'bg-rose-100 text-[#6B1B3D]',     badge: 'bg-rose-100 text-[#6B1B3D] border-rose-300',   button: 'bg-[#6B1B3D] hover:bg-[#8B2252] text-white',                                check: 'text-[#6B1B3D]',ring: 'ring-[#6B1B3D]' },
};

/* ── Load Razorpay script ────────────────────────────────────── */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
    const script   = document.createElement('script');
    script.src     = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ── Page ────────────────────────────────────────────────────── */
export default function SelectPlanPage() {
  const router           = useRouter();
  const { refreshUser }  = useAuth();
  const [selected,  setSelected]  = useState<PlanId | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState<string | null>(null);

  const getToken = () => {
    try { return JSON.parse(localStorage.getItem('vivaah_auth') || '{}')?.accessToken as string; }
    catch { return ''; }
  };

  /* Free plan — direct activation */
  const activateFree = async () => {
    const token = getToken();
    if (!token) throw new Error('Not logged in');
    const res  = await fetch('/api/users/plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:   JSON.stringify({ tier: 'free' }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message ?? 'Failed');
  };

  /* Paid plan — Razorpay checkout */
  const openCheckout = async (planId: Exclude<PlanId, 'free'>) => {
    const token = getToken();
    if (!token) throw new Error('Not logged in');

    /* 1. Load Razorpay SDK */
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error('Failed to load payment SDK. Check your internet connection.');

    /* 2. Create order */
    const orderRes  = await fetch('/api/payments/create-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ tier: planId }),
    });
    const orderJson = await orderRes.json();
    if (!orderJson.success) throw new Error(orderJson.error?.message ?? 'Could not create payment order');

    const { orderId, amount, currency, keyId, description, prefill } = orderJson.data;

    /* 3. Open checkout */
    await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency,
        name:        'VivaahAI',
        description,
        order_id:    orderId,
        prefill,
        theme:       { color: '#6B1B3D' },
        modal:       { ondismiss: () => reject(new Error('Payment cancelled')) },
        handler: async (response) => {
          try {
            /* 4. Verify payment */
            const verifyRes  = await fetch('/api/payments/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                tier:                planId,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyJson.success) throw new Error(verifyJson.error?.message ?? 'Payment verification failed');
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      });
      rzp.open();
    });
  };

  const handleSelect = async (planId: PlanId) => {
    setSelected(planId);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (planId === 'free') {
        await activateFree();
      } else {
        await openCheckout(planId);
      }

      setSuccess('🎉 Plan activated successfully!');
      await refreshUser();
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg !== 'Payment cancelled') setError(msg);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex flex-col items-center justify-center p-4 py-10">

      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-full px-4 py-1.5 mb-4">
          <Heart className="w-3.5 h-3.5 text-[#6B1B3D]" fill="currentColor" />
          <span className="text-xs font-semibold text-[#6B1B3D]">Almost there — choose your plan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">
          How do you want to find<br />your perfect match?
        </h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Start free or unlock premium features for better matches, messaging, and AI-powered compatibility.
          You can upgrade or downgrade anytime.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-5xl">
        {PLANS.map((plan) => {
          const colors    = COLOR_MAP[plan.color];
          const Icon      = plan.icon;
          const isLoading = loading && selected === plan.id;
          const isPaid    = plan.price > 0;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col transition-all duration-200 ${colors.card} ${selected === plan.id ? `ring-2 ${colors.ring}` : ''}`}
            >
              {'popular' in plan && plan.popular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border text-xs font-bold whitespace-nowrap ${colors.badge}`}>
                  ⭐ Most Popular
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors.icon}`}>
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-extrabold text-neutral-900 text-lg">{plan.label}</h3>
              <p className="text-xs text-neutral-400 mb-2">{plan.tagline}</p>

              <div className="mb-4">
                <span className="text-2xl font-extrabold text-neutral-900">{plan.priceStr}</span>
                {plan.price > 0 && <span className="text-xs text-neutral-400 ml-1">billed monthly</span>}
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.check}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Secure badge for paid plans */}
              {isPaid && (
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-2">
                  <Lock className="w-3 h-3" />
                  <span>Secured by Razorpay</span>
                  <ShieldCheck className="w-3 h-3 text-green-500 ml-auto" />
                </div>
              )}

              <button
                onClick={() => handleSelect(plan.id)}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${colors.button}`}
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {isPaid ? 'Opening checkout…' : 'Activating…'}</>
                  : <>{plan.cta} <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 max-w-md text-center">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 max-w-md text-center font-semibold">
          {success}
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> SSL Secured</div>
        <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-500" /> 256-bit Encryption</div>
        <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-[#6B1B3D]" /> Cancel Anytime</div>
      </div>

      <p className="text-xs text-neutral-400 mt-3 text-center max-w-sm">
        No credit card required for Free plan. Paid plans via Razorpay — UPI, Cards, Net Banking accepted. All prices include GST.
      </p>
    </div>
  );
}
