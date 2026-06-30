'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { uploadPhotoToS3 } from '@/lib/upload';
import { EMPTY_PROFILE, EMPTY_PREFERENCE } from './constants';
import type { ProfileData, PreferenceData, UploadTarget } from './types';
import ProfileHeader from './_components/ProfileHeader';
import ProfileTabs from './_components/ProfileTabs';
import BasicInfoPanel from './_components/BasicInfoPanel';
import PersonalDetailsPanel from './_components/PersonalDetailsPanel';
import CareerPanel from './_components/CareerPanel';
import LocationPanel from './_components/LocationPanel';
import PhotosPanel from './_components/PhotosPanel';
import PreferencesPanel from './_components/PreferencesPanel';

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [preference, setPreference] = useState<PreferenceData>(EMPTY_PREFERENCE);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<UploadTarget>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError('Please log in to see your profile.');
      return;
    }

    fetch('/api/users/profile', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Failed to load profile');
        setProfile({ ...EMPTY_PROFILE, ...json.data });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));

    fetch('/api/users/preferences', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPreference({ ...EMPTY_PREFERENCE, ...json.data });
      })
      .catch(() => {
        // Preferences are non-critical — keep defaults if this fails.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!auth) return;
    setSaving(true);
    try {
      const [profileRes, preferenceRes] = await Promise.all([
        fetch('/api/users/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
          body: JSON.stringify(profile),
        }),
        fetch('/api/users/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
          body: JSON.stringify(preference),
        }),
      ]);
      const profileJson = await profileRes.json();
      const preferenceJson = await preferenceRes.json();
      if (profileJson.success && preferenceJson.success) {
        setProfile({ ...EMPTY_PROFILE, ...profileJson.data });
        setPreference({ ...EMPTY_PREFERENCE, ...preferenceJson.data });
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
        // Sync AuthContext so Navbar reflects new name/photo immediately
        refreshUser();
      }
    } finally {
      setSaving(false);
    }
  };

  const update = useCallback((patch: Partial<ProfileData>) => setProfile((prev) => ({ ...prev, ...patch })), []);
  const updatePreference = useCallback((patch: Partial<PreferenceData>) => setPreference((prev) => ({ ...prev, ...patch })), []);

  const openPhotoPicker = useCallback((target: 'avatar' | 'cover' | number) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  }, []);

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTarget;
    e.target.value = ''; // allow re-selecting the same file later
    if (!file || !auth || target === null) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      setUploadTarget(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('That image is too large (max 8MB).');
      setUploadTarget(null);
      return;
    }

    setPhotoError(null);
    try {
      const maxDim = target === 'cover' ? 1200 : 600;
      const publicUrl = await uploadPhotoToS3(file, auth.accessToken, maxDim);
      let patch: { photo: string } | { coverPhoto: string } | { photos: string[] };
      if (target === 'avatar') {
        patch = { photo: publicUrl };
      } else if (target === 'cover') {
        patch = { coverPhoto: publicUrl };
      } else {
        const nextPhotos = [...profile.photos];
        nextPhotos[target] = publicUrl;
        patch = { photos: nextPhotos.slice(0, 4) };
      }

      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (json.success) {
        setProfile((prev) => ({ ...prev, ...json.data }));
      } else {
        setPhotoError(json.error?.message || 'Failed to upload photo.');
      }
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Failed to upload photo.');
    } finally {
      setUploadTarget(null);
    }
  };

  const removeGalleryPhoto = async (index: number) => {
    if (!auth) return;
    const nextPhotos = profile.photos.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, photos: nextPhotos }));
    try {
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ photos: nextPhotos }),
      });
    } catch {
      // Optimistic removal stays even if the network call fails.
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card h-44 animate-pulse" />
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card h-64 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16 text-neutral-400">
        <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
        <p className="font-medium text-neutral-600">{error}</p>
        {!auth && <a href="/login" className="text-sm mt-2 inline-block text-primary-700 font-semibold hover:underline">Go to login</a>}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <ProfileHeader
        profile={profile}
        editing={editing}
        saving={saving}
        saved={saved}
        uploadTarget={uploadTarget}
        photoError={photoError}
        fileInputRef={fileInputRef}
        onPhotoSelected={handlePhotoSelected}
        onOpenPhotoPicker={openPhotoPicker}
        onCancel={() => setEditing(false)}
        onSave={handleSave}
        onStartEdit={() => setEditing(true)}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6 animate-fade-in">
        {activeTab === 'Basic Info' && (
          <BasicInfoPanel profile={profile} editing={editing} onUpdate={update} />
        )}

        {activeTab === 'Personal Details' && (
          <PersonalDetailsPanel profile={profile} editing={editing} onUpdate={update} />
        )}

        {activeTab === 'Career' && (
          <CareerPanel profile={profile} editing={editing} onUpdate={update} />
        )}

        {activeTab === 'Location' && (
          <LocationPanel profile={profile} editing={editing} onUpdate={update} />
        )}

        {activeTab === 'Photos' && (
          <PhotosPanel
            profile={profile}
            editing={editing}
            uploadTarget={uploadTarget}
            photoError={photoError}
            onOpenPhotoPicker={openPhotoPicker}
            onRemoveGalleryPhoto={removeGalleryPhoto}
          />
        )}

        {activeTab === 'Preferences' && (
          <PreferencesPanel preference={preference} editing={editing} onUpdate={updatePreference} />
        )}
      </div>
    </div>
  );
}
