'use client';

import { useEffect, useRef, useState } from 'react';
import {
  User, Dna, Briefcase, MapPin, GalleryHorizontalEnd, Heart, Lock, Camera, Pencil,
  Loader2, Check, ShieldAlert, Plus, X,
} from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

/** Resizes/compresses an image file in the browser and returns a JPEG data URL. */
function resizeImageToDataUrl(file: File, maxDimension = 480, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Image processing is not supported in this browser'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const TABS = [
  { id: 'Basic Info', icon: User },
  { id: 'Personal Details', icon: Dna },
  { id: 'Career', icon: Briefcase },
  { id: 'Location', icon: MapPin },
  { id: 'Photos', icon: GalleryHorizontalEnd },
  { id: 'Preferences', icon: Heart },
];

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  height: string;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  qualification: string;
  occupation: string;
  company: string;
  annualIncome: string;
  country: string;
  state: string;
  city: string;
  aboutMe: string;
  interests: string[];
  photo: string | null;
  coverPhoto: string | null;
  photos: string[];
  profileCompleteness: number;
}

interface PreferenceData {
  ageMin: number;
  ageMax: number;
  religion: string;
  location: string;
  education: string;
}

const EMPTY_PROFILE: ProfileData = {
  fullName: '', email: '', phone: '', gender: '', dob: '', height: '', religion: '', caste: '',
  motherTongue: '', maritalStatus: '', qualification: '', occupation: '', company: '', annualIncome: '',
  country: '', state: '', city: '', aboutMe: '', interests: [], photo: null, coverPhoto: null, photos: [],
  profileCompleteness: 0,
};

const EMPTY_PREFERENCE: PreferenceData = {
  ageMin: 18, ageMax: 35, religion: 'Any Religion', location: '', education: 'Any',
};

// ─── Reusable field — defined at module scope so its identity is stable across
// re-renders. Defining this inside ProfilePage caused React to remount the
// underlying <input> on every keystroke, dropping focus after one character. ───
function Field({
  label, value, onChange, type = 'text', editing, locked,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  editing: boolean;
  locked?: boolean;
}) {
  if (editing && onChange) {
    return (
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
        />
      </div>
    );
  }

  if (editing && locked) {
    return (
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
          {label} <Lock className="w-3 h-3" />
        </label>
        <p className="w-full px-4 py-2.5 rounded-xl border border-dashed border-vivaah-border bg-vivaah-bg text-sm text-neutral-500">
          {value || <span className="text-neutral-300">Not specified</span>}
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">Contact support to change this</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
      <p className="text-sm text-neutral-800 font-medium">{value || <span className="text-neutral-300">Not specified</span>}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <h3 className="flex items-center gap-2 font-bold text-neutral-900 mb-4">
      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700">
        <Icon className="w-4 h-4" />
      </span>
      {title}
    </h3>
  );
}

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
  // 'avatar' | 'cover' | gallery slot index (0-3) — whichever slot is currently picking/uploading a file
  const [uploadTarget, setUploadTarget] = useState<'avatar' | 'cover' | number | null>(null);
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

  const update = (patch: Partial<ProfileData>) => setProfile((prev) => ({ ...prev, ...patch }));
  const updatePreference = (patch: Partial<PreferenceData>) => setPreference((prev) => ({ ...prev, ...patch }));

  const openPhotoPicker = (target: 'avatar' | 'cover' | number) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

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
      const dataUrl = await resizeImageToDataUrl(file, target === 'cover' ? 1000 : 480);
      let patch: { photo: string } | { coverPhoto: string } | { photos: string[] };
      if (target === 'avatar') {
        patch = { photo: dataUrl };
      } else if (target === 'cover') {
        patch = { coverPhoto: dataUrl };
      } else {
        const nextPhotos = [...profile.photos];
        nextPhotos[target] = dataUrl; // replaces an existing slot, or appends if target === current length
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

  const profileStrength = profile.profileCompleteness;
  const strengthLabel = profileStrength >= 80 ? 'Excellent' : profileStrength >= 50 ? 'Good' : 'Needs work';
  const strengthColor = profileStrength >= 80 ? 'text-green-600' : profileStrength >= 50 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelected} />

        {/* ── Avatar + Info + Strength ── */}
        <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Avatar */}
          <div className="relative flex-shrink-0 self-start sm:self-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-gradient border-2 border-white shadow-lg flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden">
              {uploadTarget === 'avatar' ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : profile.photo ? (
                <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                profile.fullName ? profile.fullName[0].toUpperCase() : '?'
              )}
            </div>
            {/* Camera button only visible in edit mode */}
            {editing && (
              <button
                type="button"
                onClick={() => openPhotoPicker('avatar')}
                disabled={uploadTarget !== null}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#7A0026] border-2 border-white rounded-full flex items-center justify-center shadow-md hover:bg-[#A10035] transition-colors disabled:opacity-60"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          {/* Name + meta + strength */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-tight truncate">
                  {profile.fullName || 'Your Name'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {[profile.occupation, profile.city, profile.country].filter(Boolean).join(' · ') || 'Add your details'}
                </p>
                {profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.interests.slice(0, 4).map((interest) => (
                      <span key={interest} className="text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-semibold border border-primary-100">
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 4 && (
                      <span className="text-[11px] text-neutral-400 px-1 py-0.5">+{profile.interests.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Edit / Save */}
              <div className="flex gap-2 flex-shrink-0">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)}
                      className="px-3 py-1.5 border border-vivaah-border rounded-lg text-xs font-semibold text-neutral-600 hover:bg-vivaah-bg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="px-3 py-1.5 bg-[#7A0026] text-white rounded-lg text-xs font-bold hover:bg-[#A10035] transition-colors disabled:opacity-60 inline-flex items-center gap-1.5">
                      {saving ? <Loader2 className="animate-spin w-3 h-3" /> : saved ? <Check className="w-3 h-3" /> : null}
                      {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)}
                    className="px-3 py-1.5 border border-[#7A0026] text-[#7A0026] rounded-lg text-xs font-bold hover:bg-primary-50 transition-colors inline-flex items-center gap-1.5">
                    <Pencil className="w-3 h-3" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Strength bar — inline below name */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${profileStrength}%`,
                    background: profileStrength >= 80 ? 'linear-gradient(90deg,#D4A017,#f0c040)' : profileStrength >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)',
                  }}
                />
              </div>
              <span className={`text-xs font-bold whitespace-nowrap ${strengthColor}`}>
                {profileStrength}% · {strengthLabel}
              </span>
            </div>
          </div>
        </div>

        {photoError && (
          <p className="mx-5 mb-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{photoError}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${activeTab === tab.id
                  ? 'bg-[#7A0026] text-white shadow-sm'
                  : 'text-neutral-500 hover:text-[#7A0026] hover:bg-[#7A0026]/5'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6 animate-fade-in">
        {activeTab === 'Basic Info' && (
          <div className="space-y-5">
            <SectionTitle icon={User} title="Basic Information" />
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">About Me</label>
              {editing ? (
                <textarea value={profile.aboutMe} onChange={(e) => update({ aboutMe: e.target.value })} rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
              ) : (
                <p className="text-sm text-neutral-700 leading-relaxed">{profile.aboutMe || <span className="text-neutral-300">Not specified</span>}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field editing={editing} label="Full Name" value={profile.fullName} onChange={(v) => update({ fullName: v })} />
              <Field editing={editing} label="Email" value={profile.email} type="email" locked />
              <Field editing={editing} label="Mobile" value={profile.phone} locked />
              <Field editing={editing} label="Gender" value={profile.gender} onChange={(v) => update({ gender: v })} />
            </div>
          </div>
        )}

        {activeTab === 'Personal Details' && (
          <div className="space-y-5">
            <SectionTitle icon={Dna} title="Personal Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field editing={editing} label="Date of Birth" value={profile.dob} onChange={(v) => update({ dob: v })} type="date" />
              <Field editing={editing} label="Height" value={profile.height} onChange={(v) => update({ height: v })} />
              <Field editing={editing} label="Religion" value={profile.religion} onChange={(v) => update({ religion: v })} />
              <Field editing={editing} label="Caste" value={profile.caste} onChange={(v) => update({ caste: v })} />
              <Field editing={editing} label="Mother Tongue" value={profile.motherTongue} onChange={(v) => update({ motherTongue: v })} />
              <Field editing={editing} label="Marital Status" value={profile.maritalStatus} onChange={(v) => update({ maritalStatus: v })} />
            </div>
          </div>
        )}

        {activeTab === 'Career' && (
          <div className="space-y-5">
            <SectionTitle icon={Briefcase} title="Career & Education" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field editing={editing} label="Qualification" value={profile.qualification} onChange={(v) => update({ qualification: v })} />
              <Field editing={editing} label="Occupation" value={profile.occupation} onChange={(v) => update({ occupation: v })} />
              <Field editing={editing} label="Company / Organization" value={profile.company} onChange={(v) => update({ company: v })} />
              <Field editing={editing} label="Annual Income" value={profile.annualIncome} onChange={(v) => update({ annualIncome: v })} />
            </div>
          </div>
        )}

        {activeTab === 'Location' && (
          <div className="space-y-5">
            <SectionTitle icon={MapPin} title="Location" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field editing={editing} label="Country" value={profile.country} onChange={(v) => update({ country: v })} />
              <Field editing={editing} label="State" value={profile.state} onChange={(v) => update({ state: v })} />
              <Field editing={editing} label="City" value={profile.city} onChange={(v) => update({ city: v })} />
            </div>
          </div>
        )}

        {activeTab === 'Photos' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={GalleryHorizontalEnd} title="Profile Photos" />
              {!editing && (
                <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5">
                  Click <span className="font-semibold text-[#7A0026]">Edit Profile</span> to manage photos
                </span>
              )}
            </div>
            {photoError && (
              <p className="mb-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{photoError}</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {/* Main / avatar photo */}
              <div className="relative aspect-square group">
                <div
                  onClick={() => editing && openPhotoPicker('avatar')}
                  className={`w-full h-full relative rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-3xl overflow-hidden ${editing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {uploadTarget === 'avatar' ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : profile.photo ? (
                    <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    profile.fullName ? profile.fullName[0].toUpperCase() : '?'
                  )}
                  {editing && (
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                      <Pencil className="w-3.5 h-3.5" /> Change
                    </span>
                  )}
                </div>
                <span className="absolute top-1 left-1 bg-black/50 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">Main</span>
              </div>

              {[...Array(4)].map((_, i) => {
                const photoUrl = profile.photos[i];
                const isNextEmptySlot = i === profile.photos.length;
                const isLocked = !photoUrl && !isNextEmptySlot;
                return (
                  <div key={i} className="relative aspect-square group">
                    <button
                      type="button"
                      onClick={() => editing && !isLocked && openPhotoPicker(i)}
                      disabled={!editing || uploadTarget !== null || isLocked}
                      className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-1 overflow-hidden transition-all ${
                        photoUrl
                          ? ''
                          : !editing || isLocked
                          ? 'bg-vivaah-bg border-2 border-dashed border-neutral-200 cursor-not-allowed opacity-40'
                          : 'bg-vivaah-bg border-2 border-dashed border-primary-700/30 hover:border-primary-700/60 hover:bg-primary-50'
                      }`}
                    >
                      {uploadTarget === i ? (
                        <Loader2 className="animate-spin w-5 h-5 text-primary-700" />
                      ) : photoUrl ? (
                        <img src={photoUrl} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Plus className={`w-6 h-6 ${editing && !isLocked ? 'text-neutral-300 group-hover:text-primary-700' : 'text-neutral-200'}`} />
                          {editing && !isLocked && <span className="text-xs text-neutral-400 group-hover:text-primary-700">Add Photo</span>}
                        </>
                      )}
                    </button>
                    {/* Delete button — only in edit mode */}
                    {editing && photoUrl && uploadTarget === null && (
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-neutral-400 mt-3">Add up to 5 photos. Your first photo is your main profile picture.</p>
          </div>
        )}

        {activeTab === 'Preferences' && (
          <div className="space-y-5">
            <SectionTitle icon={Heart} title="Match Preferences" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Age Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={preference.ageMin} min={18} max={50} disabled={!editing}
                    onChange={(e) => updatePreference({ ageMin: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 disabled:bg-vivaah-bg disabled:text-neutral-500" />
                  <span className="text-neutral-400 text-sm">to</span>
                  <input type="number" value={preference.ageMax} min={18} max={50} disabled={!editing}
                    onChange={(e) => updatePreference({ ageMax: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary-700/20 disabled:bg-vivaah-bg disabled:text-neutral-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Religion Preference</label>
                <select value={preference.religion} disabled={!editing}
                  onChange={(e) => updatePreference({ religion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500">
                  <option>Any Religion</option>
                  <option>Hindu</option><option>Muslim</option><option>Christian</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Location</label>
                <input type="text" value={preference.location} disabled={!editing}
                  onChange={(e) => updatePreference({ location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Education Preference</label>
                <select value={preference.education} disabled={!editing}
                  onChange={(e) => updatePreference({ education: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none disabled:bg-vivaah-bg disabled:text-neutral-500">
                  <option>Any</option>
                  <option>Graduate & Above</option><option>Post Graduate & Above</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
