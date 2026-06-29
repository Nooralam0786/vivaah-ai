'use client';

import { Star, Clock, Plus, Heart } from 'lucide-react';

const EXAMPLE_STORIES = [
  {
    couple: 'Ananya & Rohit',
    city: 'Delhi',
    marriedOn: 'March 2026',
    quote: 'VivaahAI found us our perfect match within 3 weeks. We are forever grateful!',
    featured: true,
  },
  {
    couple: 'Priya & Arjun',
    city: 'Mumbai',
    marriedOn: 'January 2026',
    quote: 'The AI compatibility score was spot on. We knew from our first chat!',
    featured: false,
  },
  {
    couple: 'Kavitha & Siddharth',
    city: 'Bangalore',
    marriedOn: 'November 2025',
    quote: 'Two engineers from the same college — matched by AI. Destiny!',
    featured: true,
  },
];

export default function SuccessStoriesAdminPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Success Stories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Showcase couples who found love on VivaahAI</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#6B1B3D]/50 text-white rounded-xl text-sm font-semibold cursor-not-allowed">
          <Plus size={15} /> Add Story
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Success Story Management</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Add, edit, and feature success stories. Upload couple photos, record wedding dates, and publish testimonials to the public success stories page.
        </p>
      </div>

      {/* Example story cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-60 pointer-events-none select-none">
        {EXAMPLE_STORIES.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            {s.featured && (
              <div className="flex items-center gap-1.5 mb-3">
                <Star size={13} className="text-[#D4AF37]" fill="currentColor" />
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wide">Featured</span>
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center mb-3">
              <Heart size={22} className="text-white" fill="white" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">{s.couple}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.city} · Married {s.marriedOn}</p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed italic">&ldquo;{s.quote}&rdquo;</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">Example success stories shown above — full story management coming soon.</p>
    </div>
  );
}
