'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Check, Heart, Zap, Crown, Star, ArrowRight, Loader2, ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PLANS = [
  {
    id: 'free', label: 'Silver', price: 0, priceStr: 'Free', icon: Star, color: 'neutral',
    tagline: 'Basic access',
    features: ['5 matches per day', 'Basic profile', 'Send interests', 'Limited views'],
  },
  {
    id: 'gold', label: 'Gold', price: 499, priceStr: '₹499/mo', icon: Zap, color: 'gold',
    tagline: 'Most popular', popular: true,
    features: ['Unlimited matches', 'Real-time messaging', 'Advanced filters', 'Who viewed me', 'Priority support'],
  },
  {
    id: 'platinum', label: 'Platinum', price: 999, priceStr: '₹999/mo', icon: Crown, color: 'blue',
    tagline: 'Enhanced',
    features: ['Everything in Gold', 'Audio & Video calls', 'AI insights', 'Weekly boost', 'Dedicated support'],
  },
  {
    id: 'diamond', label: 'Diamond', price: 2499, priceStr: '₹2,499/mo', icon: Heart, color: 'primary',
    tagline: 'Premium',
    features: ['Everything in Platinum', 'Concierge matching', 'Family accounts', 'Video profile', 'Background check'],
  },
] as const;

type PlanId = typeof PLANS[number]['id'];

const TIER_ORDER: Record<string, number> = { free: 0, gold: 1, platinum: 2, diamond: 3 };

const COLOR_MAP = {
  neutral: { card: 'border-gray-200',              icon: 'bg-gray-100 text-gray-600',     badge: '', button: 'bg-gray-800 hover:bg-gray-700 text-white',                                               check: 'text-gray-500',    ring: 'ring-gray-300'    },
  gold:    { card: 'border-amber-300',              icon: 'bg-amber-100 text-amber-600',   badge: 'bg-amber-100 text-amber-700 border-amber-300', button: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-900 font-bold', check: 'text-amber-500',  ring: 'ring-amber-400'   },
  blue:    { card: 'border-blue-300',               icon: 'bg-blue-100 text-blue-600',     badge: 'bg-blue-100 text-blue-700 border-blue-200',    button: 'bg-blue-600 hover:bg-blue-700 text-white',    check: 'text-blue-500',   ring: 'ring-blue-400'    },
  primary: { card: 'border-[#6B1B3D]/40',           icon: 'bg-rose-100 text-[#6B1B3D]',   badge: 'bg-rose-100 text-[#6B1B3D] border-rose-200',  button: 'bg-[#6B1B3D] hover:bg-[#8B2252] text-white', check: 'text-[#6B1B3D]',  ring: 'ring-[#6B1B3D]'  },
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
    const s    = document.createElement('script');
    s.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload   = () => resolve(true);
    s.onerror  = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function UpgradePage() {
  const router          = useRouter();
  const { user, refreshUser } = useAuth();
  const currentTier     = user?.subscriptionTier ?? 'free';

  const [selected,  setSelected]  = useState<PlanId | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [done,      setDone]      = useState<string | null>(null);

  const getToken = () => {
    try { return JSON.parse(localStorage.getItem('vivaah_auth') || '{}')?.accessToken as string; } catch { return ''; }
  };

  const handleSelect = async (planId: PlanId) => {
    if (planId === currentTier) return;
    if (planId === 'free') { setError('You cannot downgrade to Free. Please contact support.'); return; }

    setSelected(planId);
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment SDK.');

      const orderRes  = await fetch('/api/payments/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ tier: planId }),
      });
      const orderJson = await orderRes.json();
      if (!orderJson.success) throw new Error(orderJson.error?.message ?? 'Could not create order');

      const { orderId, amount, currency, keyId, description, prefill } = orderJson.data;

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId, amount, currency,
          name: 'VivaahAI', description, order_id: orderId, prefill,
          theme: { color: '#6B1B3D' },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
          handler: async (response) => {
            try {
              const vRes  = await fetch('/api/payments/verify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body:    JSON.stringify({ ...response, tier: planId }),
              });
              const vJson = await vRes.json();
              if (!vJson.success) throw new Error(vJson.error?.message ?? 'Verification failed');
              resolve();
            } catch (err) { reject(err); }
          },
        });
        rzp.open();
      });

      setDone(`🎉 You've upgraded to ${PLANS.find((p) => p.id === planId)?.label}!`);
      await refreshUser();
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg !== 'Payment cancelled') setError(msg);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900">{done}</h2>
          <p className="text-gray-500 mt-2 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Upgrade Your Plan</h1>
          <p className="text-gray-500 text-sm mt-2">
            Currently on <span className="font-semibold capitalize text-[#6B1B3D]">{currentTier}</span> plan.
            Unlock more features by upgrading.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const colors      = COLOR_MAP[plan.color];
            const Icon        = plan.icon;
            const isCurrent   = plan.id === currentTier;
            const isDowngrade = TIER_ORDER[plan.id] < TIER_ORDER[currentTier];
            const isLoading   = loading && selected === plan.id;
            const isPaid      = plan.price > 0;

            return (
              <div key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col transition-all duration-200 ${
                  isCurrent ? 'border-green-400 ring-2 ring-green-300' : colors.card
                } ${isDowngrade || isCurrent ? 'opacity-70' : ''}`}
              >
                {'popular' in plan && plan.popular && !isCurrent && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border text-xs font-bold whitespace-nowrap ${colors.badge}`}>
                    ⭐ Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border text-xs font-bold whitespace-nowrap bg-green-100 text-green-700 border-green-200">
                    ✓ Current Plan
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">{plan.label}</h3>
                <p className="text-xs text-gray-400 mb-2">{plan.tagline}</p>
                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-gray-900">{plan.priceStr}</span>
                  {plan.price > 0 && <span className="text-xs text-gray-400 ml-1">/ month</span>}
                </div>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.check}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {isPaid && !isCurrent && !isDowngrade && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                    <Lock className="w-3 h-3" /> Secured by Razorpay
                  </div>
                )}

                <button
                  onClick={() => handleSelect(plan.id)}
                  disabled={isCurrent || isDowngrade || loading}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                    isCurrent
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : isDowngrade
                      ? 'bg-gray-100 text-gray-400'
                      : `${colors.button} disabled:opacity-50`
                  }`}
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening checkout…</>
                    : isCurrent
                    ? <><CheckCircle2 className="w-4 h-4" /> Active</>
                    : isDowngrade
                    ? 'Contact Support to Downgrade'
                    : <>Upgrade to {plan.label} <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 max-w-md mx-auto text-center">{error}</div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> SSL Secured</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> Razorpay Protected</span>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-[#6B1B3D]" /> Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
