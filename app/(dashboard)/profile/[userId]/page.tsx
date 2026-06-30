'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Flag } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import type { ProfileFull, ProfileViewTab } from './types';
import ProfileViewSkeleton from './_components/ProfileViewSkeleton';
import ProfileHero from './_components/ProfileHero';
import ProfileActionButtons from './_components/ProfileActionButtons';
import MutualInterestsBanner from './_components/MutualInterestsBanner';
import ProfileViewTabs from './_components/ProfileViewTabs';
import AboutTab from './_components/AboutTab';
import PhotosTab from './_components/PhotosTab';
import InsightsTab from './_components/InsightsTab';

export default function ProfileViewPage() {
  const params   = useParams();
  const router   = useRouter();
  const userId   = params.userId as string;

  const [profile, setProfile]   = useState<ProfileFull | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileViewTab>('about');
  const [imgIdx, setImgIdx]     = useState(0);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in to view profiles.'); setLoading(false); return; }

    fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Profile not found');
        setProfile(json.data);
        setLiked(json.data.iLiked);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLike = async () => {
    if (!profile) return;
    setLiked((v) => !v);
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: profile.userId }),
      });
    } catch { /* non-fatal */ }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaved((v) => !v);
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: profile.userId }),
      });
    } catch { /* non-fatal */ }
  };

  const allPhotos = useMemo(
    () => (profile ? ([profile.photo, ...profile.photos].filter(Boolean) as string[]) : []),
    [profile],
  );
  const location = useMemo(
    () => (profile ? [profile.city, profile.state, profile.country].filter(Boolean).join(', ') : ''),
    [profile],
  );

  if (loading) return <div className="max-w-4xl mx-auto pt-2"><ProfileViewSkeleton /></div>;

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="font-bold text-neutral-700 text-lg mb-1">Profile not found</h2>
        <p className="text-sm text-neutral-400 mb-4">{error ?? 'This profile may have been removed.'}</p>
        <button onClick={() => router.back()} className="text-primary-700 font-semibold text-sm hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in pb-8">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <ProfileHero profile={profile} allPhotos={allPhotos} imgIdx={imgIdx} location={location} onSelectImage={setImgIdx} />

      <ProfileActionButtons userId={profile.userId} liked={liked} saved={saved} onLike={handleLike} onSave={handleSave} />

      <MutualInterestsBanner mutualInterests={profile.mutualInterests} />

      <ProfileViewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'about' && <AboutTab profile={profile} />}

      {activeTab === 'photos' && (
        <PhotosTab allPhotos={allPhotos} imgIdx={imgIdx} onSelectImage={setImgIdx} />
      )}

      {activeTab === 'insights' && <InsightsTab profile={profile} />}

      {/* ── Report ─────────────────────────────────────────────────────────── */}
      <div className="text-center">
        <button className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto">
          <Flag size={12} /> Report this profile
        </button>
      </div>
    </div>
  );
}
