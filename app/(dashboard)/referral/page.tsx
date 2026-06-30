'use client';

import { useEffect, useState } from 'react';
import { Gift, Copy, CheckCheck, Users, Star, Share2 } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface ReferralStats {
  totalReferred: number;
  totalRewarded: number;
  totalDaysEarned: number;
  pending: number;
}

interface ReferralData {
  referralCode: string;
  referralLink: string;
  stats: ReferralStats;
}

export default function ReferralPage() {
  const [data, setData]       = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState<'code' | 'link' | null>(null);

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) return;
    fetch('/api/referral', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((r) => r.json())
      .then((j) => { if (j.success) setData(j.data); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareWhatsApp = () => {
    if (!data) return;
    const msg = encodeURIComponent(
      `Find your perfect match on VivaahAI! 💍\nJoin using my referral link and get started for free:\n${data.referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  if (!auth) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p>Please <a href="/login" className="text-[#6B1B3D] font-semibold">log in</a> to view your referrals.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#6B1B3D] to-[#9B2B5D] rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full translate-y-12 -translate-x-12" />
        <div className="relative">
          <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mb-4">
            <Gift className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-1">Invite & Earn</h1>
          <p className="text-white/70 text-sm">Invite friends to VivaahAI — earn 1 month free Gold for each friend who upgrades</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
        <h2 className="font-semibold text-neutral-800 mb-4">How it works</h2>
        <div className="space-y-4">
          {[
            { step: '1', label: 'Share your link', desc: 'Send your referral link to friends looking for a match' },
            { step: '2', label: 'Friend joins', desc: 'They sign up using your link — you get credit' },
            { step: '3', label: 'Friend upgrades', desc: 'When they buy any paid plan, you get 30 days Gold free!' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#6B1B3D] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{label}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral code + link */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 space-y-4 animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-32" />
          <div className="h-12 bg-neutral-100 rounded-xl" />
          <div className="h-12 bg-neutral-100 rounded-xl" />
        </div>
      ) : data && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-neutral-800">Your Referral</h2>

          {/* Code */}
          <div>
            <p className="text-xs text-neutral-500 mb-1.5">Referral Code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#F9F0F4] rounded-xl px-4 py-3 font-mono font-bold text-[#6B1B3D] text-lg tracking-widest">
                {data.referralCode}
              </div>
              <button
                onClick={() => copy(data.referralCode, 'code')}
                className="w-11 h-11 bg-[#6B1B3D] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              >
                {copied === 'code' ? <CheckCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Link */}
          <div>
            <p className="text-xs text-neutral-500 mb-1.5">Referral Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-600 truncate font-mono">
                {data.referralLink}
              </div>
              <button
                onClick={() => copy(data.referralLink, 'link')}
                className="w-11 h-11 bg-neutral-100 text-neutral-600 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors flex-shrink-0"
              >
                {copied === 'link' ? <CheckCheck size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Share2 size={15} /> Share on WhatsApp
            </button>
            <button
              onClick={() => copy(data.referralLink, 'link')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              <Copy size={15} /> Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Friends Invited', value: data.stats.totalReferred, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Converted', value: data.stats.totalRewarded, icon: Star, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
            { label: 'Days Earned', value: data.stats.totalDaysEarned, icon: Gift, color: 'text-[#6B1B3D]', bg: 'bg-[#F9F0F4]' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-neutral-100 p-4 text-center">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending notice */}
      {data && data.stats.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          <strong>{data.stats.pending}</strong> friend{data.stats.pending > 1 ? 's' : ''} joined but haven't upgraded yet.
          Your reward activates when they buy a paid plan.
        </div>
      )}
    </div>
  );
}
