'use client';

import { MessageCircle, Clock, Plus, Star } from 'lucide-react';

const EXAMPLE_TESTIMONIALS = [
  {
    name: 'Ananya & Rohit',
    city: 'Delhi',
    rating: 5,
    text: 'Found my soulmate in just 3 weeks! The AI suggestions were incredibly accurate.',
    approved: true,
  },
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    rating: 5,
    text: 'VivaahAI understood my preferences better than I did. Amazing experience!',
    approved: true,
  },
  {
    name: 'Arjun Mehta',
    city: 'Pune',
    rating: 4,
    text: 'The verification process gave me so much confidence. Highly recommend.',
    approved: false,
  },
  {
    name: 'Meera Kapoor',
    city: 'Bangalore',
    rating: 5,
    text: 'Best matrimonial platform I\'ve used. Modern, safe, and actually works!',
    approved: true,
  },
];

export default function TestimonialsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-0.5">User reviews and testimonials management</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#6B1B3D]/50 text-white rounded-xl text-sm font-semibold cursor-not-allowed">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Testimonial Management</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Review and approve user testimonials, feature them on the homepage, manage ratings, and curate social proof for the VivaahAI platform.
        </p>
      </div>

      {/* Example testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60 pointer-events-none select-none">
        {EXAMPLE_TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.city}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {t.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={12} className={j < t.rating ? 'text-[#D4AF37]' : 'text-gray-200'} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-semibold border border-emerald-100">Approve</span>
              <span className="px-2 py-1 bg-[#6B1B3D]/10 text-[#6B1B3D] rounded-lg text-[10px] font-semibold border border-[#6B1B3D]/20">Feature</span>
              <span className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-semibold border border-red-100">Delete</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <MessageCircle size={12} />
        Example testimonials shown above — approval workflow and feature management coming soon.
      </p>
    </div>
  );
}
