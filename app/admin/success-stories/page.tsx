'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, XCircle, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface Story {
  id:           string;
  userId:       string;
  partnerName:  string;
  story:        string;
  marriageDate: string | null;
  city:         string | null;
  photo:        string | null;
  status:       'pending' | 'approved' | 'rejected';
  isPublished:  boolean;
  createdAt:    string;
}

interface Counts { pending: number; approved: number; rejected: number; }

const STATUS_BADGE: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminSuccessStoriesPage() {
  const [stories,  setStories]  = useState<Story[]>([]);
  const [counts,   setCounts]   = useState<Counts>({ pending: 0, approved: 0, rejected: 0 });
  const [filter,   setFilter]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const auth = getAuthFromStorage();

  const fetchStories = useCallback(async (status = filter) => {
    if (!auth) return;
    setLoading(true);
    const url = `/api/admin/success-stories${status ? `?status=${status}` : ''}`;
    const res  = await fetch(url, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
    const json = await res.json();
    if (json.success) {
      setStories(json.data.stories);
      setCounts(json.data.counts);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const action = async (id: string, act: 'approve' | 'reject' | 'publish' | 'unpublish' | 'delete') => {
    if (!auth) return;
    setActing(id + act);

    if (act === 'delete') {
      if (!confirm('Delete this story permanently?')) { setActing(null); return; }
      await fetch('/api/admin/success-stories', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ id }),
      });
      setStories((prev) => prev.filter((s) => s.id !== id));
    } else {
      const res  = await fetch('/api/admin/success-stories', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ id, action: act }),
      });
      const json = await res.json();
      if (json.success) {
        setStories((prev) => prev.map((s) => s.id === id ? { ...s, ...json.data } : s));
        await fetchStories(filter);
      }
    }
    setActing(null);
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900">Success Stories</h1>
          <p className="text-sm text-neutral-500">Review and approve user-submitted stories</p>
        </div>
        <button
          onClick={() => fetchStories()}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 rounded-lg text-sm text-neutral-600 hover:bg-neutral-200 transition-colors self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Count tabs */}
      <div className="flex gap-2 sm:gap-3 mb-5 flex-wrap">
        {[
          { label: 'All',      value: '',         count: counts.pending + counts.approved + counts.rejected },
          { label: 'Pending',  value: 'pending',  count: counts.pending,  color: 'text-amber-600' },
          { label: 'Approved', value: 'approved', count: counts.approved, color: 'text-green-600' },
          { label: 'Rejected', value: 'rejected', count: counts.rejected, color: 'text-red-600' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setFilter(tab.value); fetchStories(tab.value); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab.value ? 'bg-[#6B1B3D] text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
            <span className={`text-xs font-bold ${filter === tab.value ? 'text-white/80' : (tab.color ?? 'text-neutral-500')}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Stories list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
          <Star size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No stories found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">

              {/* Story header */}
              <div className="p-4 flex items-start gap-3 sm:gap-4">
                {/* Photo or placeholder */}
                <div className="relative w-14 h-14 rounded-xl bg-[#F9F0F4] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {story.photo
                    ? <Image src={story.photo} alt="" fill sizes="56px" className="object-cover" />
                    : <Star size={20} className="text-[#6B1B3D]/40" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-neutral-900">{story.partnerName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[story.status]}`}>
                      {story.status.toUpperCase()}
                    </span>
                    {story.isPublished && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">PUBLISHED</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {[story.city, story.marriageDate].filter(Boolean).join(' · ')} ·{' '}
                    {new Date(story.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  {/* Story preview */}
                  <p className={`text-sm text-neutral-600 mt-2 leading-relaxed ${expanded === story.id ? '' : 'line-clamp-2'}`}>
                    {story.story}
                  </p>
                  {story.story.length > 120 && (
                    <button
                      onClick={() => setExpanded(expanded === story.id ? null : story.id)}
                      className="text-xs text-[#6B1B3D] font-medium mt-1 hover:underline"
                    >
                      {expanded === story.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
                {story.status === 'pending' && (
                  <>
                    <button
                      onClick={() => action(story.id, 'approve')}
                      disabled={!!acting}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors disabled:opacity-60"
                    >
                      <CheckCircle2 size={13} /> Approve & Publish
                    </button>
                    <button
                      onClick={() => action(story.id, 'reject')}
                      disabled={!!acting}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors disabled:opacity-60"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}

                {story.status === 'approved' && (
                  <button
                    onClick={() => action(story.id, story.isPublished ? 'unpublish' : 'publish')}
                    disabled={!!acting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors disabled:opacity-60"
                  >
                    {story.isPublished ? <><EyeOff size={13} /> Unpublish</> : <><Eye size={13} /> Publish</>}
                  </button>
                )}

                {story.status === 'rejected' && (
                  <button
                    onClick={() => action(story.id, 'approve')}
                    disabled={!!acting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle2 size={13} /> Re-approve
                  </button>
                )}

                <a
                  href={`/profile/${story.userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-colors"
                >
                  <Eye size={13} /> View Profile
                </a>

                <button
                  onClick={() => action(story.id, 'delete')}
                  disabled={!!acting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60 ml-auto"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
