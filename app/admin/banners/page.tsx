'use client';

import { Image, Clock, Plus, Upload } from 'lucide-react';

const EXAMPLE_BANNERS = [
  { name: 'Hero Banner – Home',         size: '1920×600',  status: 'Active',   placement: 'Homepage Hero' },
  { name: 'Premium Upgrade CTA',        size: '800×200',   status: 'Active',   placement: 'Dashboard' },
  { name: 'Diwali Special Offer',       size: '1200×400',  status: 'Inactive', placement: 'All Pages' },
  { name: 'Success Story Background',   size: '1440×500',  status: 'Active',   placement: 'Success Stories' },
];

const STATUS_STYLE: Record<string, string> = {
  Active:   'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-gray-100 text-gray-500',
};

export default function BannersPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage promotional banners and images across the platform</p>
        </div>
        <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-[#6B1B3D]/50 text-white rounded-xl text-sm font-semibold cursor-not-allowed self-start sm:self-auto">
          <Plus size={15} /> Upload Banner
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Banner Management</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Upload, preview, and manage promotional banners. Assign banners to specific pages, schedule campaigns, and track impressions and click-through rates.
        </p>
      </div>

      {/* Upload placeholder */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 sm:p-8 text-center opacity-60 pointer-events-none select-none">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Upload size={22} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-600">Drop banner image here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB · Recommended: 1920×600px</p>
      </div>

      {/* Example banners */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Banner', 'Dimensions', 'Placement', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EXAMPLE_BANNERS.map((b, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-[#6B1B3D]/20 to-[#D4AF37]/20 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <Image size={14} className="text-gray-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500 font-mono">{b.size}</p></td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-600">{b.placement}</p></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-semibold">Edit</span>
                      <span className="px-2 py-1 bg-red-50 text-red-400 rounded-lg text-[10px] font-semibold">Delete</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">Example banners shown above — full banner management and image upload coming soon.</p>
    </div>
  );
}
