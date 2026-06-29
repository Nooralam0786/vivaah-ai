'use client';

import { BookOpen, Clock, ExternalLink } from 'lucide-react';

const EXAMPLE_PAGES = [
  { title: 'About Us',        slug: '/about-us',      status: 'Published', updated: '15 Jun 2026' },
  { title: 'How It Works',    slug: '/how-it-works',  status: 'Published', updated: '10 Jun 2026' },
  { title: 'Privacy Policy',  slug: '/privacy',       status: 'Published', updated: '01 Jun 2026' },
  { title: 'Terms of Use',    slug: '/terms',         status: 'Published', updated: '01 Jun 2026' },
  { title: 'Safety Tips',     slug: '/safety',        status: 'Published', updated: '20 May 2026' },
  { title: 'Refund Policy',   slug: '/refund-policy', status: 'Draft',     updated: '28 Jun 2026' },
];

const STATUS_STYLE: Record<string, string> = {
  Published: 'bg-emerald-50 text-emerald-600',
  Draft:     'bg-gray-100 text-gray-500',
};

export default function PagesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage static content pages on the platform</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center">
          <BookOpen size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Static Page Editor</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Edit static pages like About Us, Privacy Policy, Terms of Use, and Safety Tips with a rich-text editor directly from the admin panel — no code required.
        </p>
      </div>

      {/* Example pages list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="divide-y divide-gray-50">
          {EXAMPLE_PAGES.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6B1B3D]/10 flex items-center justify-center">
                  <BookOpen size={15} className="text-[#6B1B3D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{p.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                <span className="text-[10px] text-gray-400 hidden sm:block">Updated {p.updated}</span>
                <ExternalLink size={13} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">Example pages shown above — inline page editor coming soon.</p>
    </div>
  );
}
