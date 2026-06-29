'use client';

import { useState } from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

export default function SubmitStoryPage() {
  const [form, setForm] = useState({
    partnerName:  '',
    story:        '',
    marriageDate: '',
    city:         '',
  });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');
  const [charCount, setCharCount] = useState(0);

  const auth = getAuthFromStorage();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
    if (k === 'story') setCharCount(val.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (form.story.length < 50) { setError('Story must be at least 50 characters.'); return; }

    setLoading(true);
    setError('');

    const res  = await fetch('/api/success-stories', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body:    JSON.stringify(form),
    });
    const json = await res.json();

    setLoading(false);
    if (json.success) {
      setSuccess(true);
    } else {
      setError(json.error?.message ?? 'Failed to submit. Please try again.');
    }
  };

  if (!auth) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <p>Please <a href="/login" className="text-[#6B1B3D] font-semibold">log in</a> to share your story.</p>
    </div>
  );

  if (success) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="text-green-500" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Story Submitted!</h2>
      <p className="text-neutral-500 max-w-sm mx-auto">
        Thank you for sharing your journey. Your story will appear on the success stories page after admin review (1-2 days).
      </p>
      <a href="/success-stories" className="inline-block mt-6 px-6 py-2.5 bg-[#6B1B3D] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
        View Success Stories
      </a>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#6B1B3D] to-[#9B2B5D] rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Heart className="text-white" size={28} fill="white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Share Your Story</h1>
          <p className="text-white/70 text-sm">Found your life partner on VivaahAI? Inspire others with your journey!</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-5">

        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">
            Partner's Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.partnerName}
            onChange={set('partnerName')}
            placeholder="e.g. Priya & Rahul"
            required
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 focus:border-[#6B1B3D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">Marriage Date</label>
            <input
              type="date"
              value={form.marriageDate}
              onChange={set('marriageDate')}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 focus:border-[#6B1B3D]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">City</label>
            <input
              type="text"
              value={form.city}
              onChange={set('city')}
              placeholder="e.g. Mumbai"
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 focus:border-[#6B1B3D]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
            <span>Your Story <span className="text-red-400">*</span></span>
            <span className={`text-xs font-normal ${charCount < 50 ? 'text-red-400' : 'text-neutral-400'}`}>
              {charCount}/2000 {charCount < 50 && `(min 50)`}
            </span>
          </label>
          <textarea
            value={form.story}
            onChange={set('story')}
            placeholder="Tell us how you both met on VivaahAI, your first conversation, what made you fall in love, and how you decided to get married..."
            required
            rows={8}
            maxLength={2000}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1B3D]/20 focus:border-[#6B1B3D] resize-none leading-relaxed"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || form.partnerName.length < 2 || form.story.length < 50}
          className="w-full py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
            : <><Heart size={16} fill="white" /> Submit Your Story</>}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Stories are reviewed by our team before publishing (1-2 business days)
        </p>
      </form>
    </div>
  );
}
