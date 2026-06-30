'use client';

import { useEffect, useState } from 'react';
import { Zap, TrendingUp, Eye, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

declare const window: Window & { Razorpay: new (opts: unknown) => { open(): void } };

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as Record<string, unknown>).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BoostPage() {
  const [boostStatus, setBoostStatus] = useState<{ isActive: boolean; expiresAt: string | null } | null>(null);
  const [loading, setLoading]   = useState(true);
  const [paying,  setPaying]    = useState(false);
  const [success, setSuccess]   = useState(false);

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) return;
    fetch('/api/boost', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((r) => r.json())
      .then((j) => { if (j.success) setBoostStatus(j.data); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBoost = async () => {
    if (!auth || paying) return;
    setPaying(true);

    const loaded = await loadRazorpay();
    if (!loaded) { alert('Payment gateway failed to load. Check internet connection.'); setPaying(false); return; }

    const orderRes = await fetch('/api/boost', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body:    JSON.stringify({ action: 'create-order' }),
    });
    const orderJson = await orderRes.json();
    if (!orderJson.success) { alert('Failed to create order. Try again.'); setPaying(false); return; }

    const { orderId, amount, currency, keyId, description, prefill } = orderJson.data;

    new window.Razorpay({
      key:         keyId,
      amount,
      currency,
      name:        'VivaahAI',
      description,
      order_id:    orderId,
      image:       '/logo.png',
      prefill,
      theme:       { color: '#6B1B3D' },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        const verifyRes = await fetch('/api/boost', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
          body:    JSON.stringify({
            action:               'verify',
            razorpay_order_id:    response.razorpay_order_id,
            razorpay_payment_id:  response.razorpay_payment_id,
            razorpay_signature:   response.razorpay_signature,
          }),
        });
        const vj = await verifyRes.json();
        if (vj.success) {
          setBoostStatus({ isActive: true, expiresAt: vj.data.boostExpiresAt });
          setSuccess(true);
        } else {
          alert('Payment verification failed. Contact support.');
        }
        setPaying(false);
      },
      modal: { ondismiss: () => setPaying(false) },
    }).open();
  };

  const timeLeft = () => {
    if (!boostStatus?.expiresAt) return '';
    const diff = new Date(boostStatus.expiresAt).getTime() - Date.now();
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (!auth) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p>Please <a href="/login" className="text-[#6B1B3D] font-semibold">log in</a> to boost your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">

      {/* Success state */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
          <div>
            <p className="font-semibold text-green-800">Boost Activated!</p>
            <p className="text-sm text-green-700">Your profile is now featured at the top for 7 days.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[#6B1B3D] to-[#9B2B5D] rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative">
          <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mb-4">
            <Zap className="text-white" size={28} fill="white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Profile Boost</h1>
          <p className="text-white/70 text-sm">Get 10x more views — appear at the top of every search</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-bold">₹99</span>
            <span className="text-white/60">/ 7 days</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 space-y-4">
        <h2 className="font-semibold text-neutral-800">What you get</h2>
        {[
          { icon: TrendingUp, label: 'Top of Discover feed', desc: 'Your profile appears first for all users' },
          { icon: Eye,        label: '10x more profile views', desc: 'Dramatically increase your visibility' },
          { icon: Sparkles,   label: 'Boost badge on profile', desc: 'Stand out with a highlighted profile' },
          { icon: Clock,      label: 'Active for 7 days',      desc: 'Full week of boosted visibility' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#F9F0F4] rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-[#6B1B3D]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">{label}</p>
              <p className="text-xs text-neutral-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA / Status */}
      {loading ? (
        <div className="h-14 bg-neutral-100 rounded-2xl animate-pulse" />
      ) : boostStatus?.isActive ? (
        <div className="bg-[#F9F0F4] border border-[#6B1B3D]/20 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap size={18} className="text-[#6B1B3D]" fill="#6B1B3D" />
            <span className="font-bold text-[#6B1B3D]">Boost Active</span>
          </div>
          <p className="text-sm text-neutral-600">{timeLeft()}</p>
          <p className="text-xs text-neutral-400 mt-1">You can boost again after it expires</p>
        </div>
      ) : (
        <button
          onClick={handleBoost}
          disabled={paying}
          className="w-full py-4 bg-[#6B1B3D] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
        >
          {paying
            ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
            : <><Zap size={20} fill="white" /> Boost for ₹99</>}
        </button>
      )}

      <p className="text-center text-xs text-neutral-400 mt-3">Secured by Razorpay · Instant activation</p>
    </div>
  );
}
