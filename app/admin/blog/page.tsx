'use client';

import { FileText, Clock, Plus } from 'lucide-react';

const EXAMPLE_POSTS = [
  {
    title: 'How AI is Transforming Indian Matrimonial Matching in 2026',
    author: 'Arun (Admin)',
    category: 'Technology',
    status: 'Published',
    date: '29 Jun 2026',
    reads: '1.2k',
  },
  {
    title: 'Top 10 Questions to Ask Before Meeting Your Match',
    author: 'Arun (Admin)',
    category: 'Advice',
    status: 'Published',
    date: '25 Jun 2026',
    reads: '3.4k',
  },
  {
    title: 'Understanding Compatibility: Beyond Horoscopes',
    author: 'Arun (Admin)',
    category: 'Relationships',
    status: 'Draft',
    date: '22 Jun 2026',
    reads: '—',
  },
  {
    title: 'VivaahAI Feature Update: Video Kundali Matching',
    author: 'Arun (Admin)',
    category: 'Product',
    status: 'Scheduled',
    date: '01 Jul 2026',
    reads: '—',
  },
];

const STATUS_STYLE: Record<string, string> = {
  Published: 'bg-emerald-50 text-emerald-600',
  Draft:     'bg-gray-100 text-gray-500',
  Scheduled: 'bg-blue-50 text-blue-600',
};

export default function BlogPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your platform blog and content</p>
        </div>
        <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-[#6B1B3D]/50 text-white rounded-xl text-sm font-semibold cursor-not-allowed self-start sm:self-auto">
          <Plus size={15} /> New Post
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Blog Management CMS</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Write, edit, and publish blog posts with a rich-text editor. Schedule posts, manage categories, track reads, and optimize for SEO directly from the admin panel.
        </p>
      </div>

      {/* Example posts */}
      <div className="space-y-3 opacity-60 pointer-events-none select-none">
        {EXAMPLE_POSTS.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#6B1B3D]/10 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-[#6B1B3D]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[10px] text-gray-400">{p.author}</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{p.category}</span>
                  {p.reads !== '—' && (
                    <>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">{p.reads} reads</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 pl-12 sm:pl-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>{p.status}</span>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{p.date}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">Example blog posts shown above — full CMS editor coming soon.</p>
    </div>
  );
}
