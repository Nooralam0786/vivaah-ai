import { RefObject } from 'react';
import { Camera, Loader2, Check, Pencil } from 'lucide-react';
import type { ProfileData, UploadTarget } from '../types';

interface ProfileHeaderProps {
  profile: ProfileData;
  editing: boolean;
  saving: boolean;
  saved: boolean;
  uploadTarget: UploadTarget;
  photoError: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onPhotoSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPhotoPicker: (target: 'avatar' | 'cover' | number) => void;
  onCancel: () => void;
  onSave: () => void;
  onStartEdit: () => void;
}

export default function ProfileHeader({
  profile, editing, saving, saved, uploadTarget, photoError,
  fileInputRef, onPhotoSelected, onOpenPhotoPicker, onCancel, onSave, onStartEdit,
}: ProfileHeaderProps) {
  const profileStrength = profile.profileCompleteness;
  const strengthLabel = profileStrength >= 80 ? 'Excellent' : profileStrength >= 50 ? 'Good' : 'Needs work';
  const strengthColor = profileStrength >= 80 ? 'text-green-600' : profileStrength >= 50 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />

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
              onClick={() => onOpenPhotoPicker('avatar')}
              disabled={uploadTarget !== null}
              aria-label="Change profile photo"
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
                  <button onClick={onCancel}
                    className="px-3 py-1.5 border border-vivaah-border rounded-lg text-xs font-semibold text-neutral-600 hover:bg-vivaah-bg transition-colors">
                    Cancel
                  </button>
                  <button onClick={onSave} disabled={saving}
                    className="px-3 py-1.5 bg-[#7A0026] text-white rounded-lg text-xs font-bold hover:bg-[#A10035] transition-colors disabled:opacity-60 inline-flex items-center gap-1.5">
                    {saving ? <Loader2 className="animate-spin w-3 h-3" /> : saved ? <Check className="w-3 h-3" /> : null}
                    {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={onStartEdit}
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
  );
}
