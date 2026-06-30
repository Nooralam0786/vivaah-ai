import { GalleryHorizontalEnd, Loader2, Pencil } from 'lucide-react';
import SectionTitle from './SectionTitle';
import GallerySlot from './GallerySlot';
import type { ProfileData, UploadTarget } from '../types';

interface PhotosPanelProps {
  profile: ProfileData;
  editing: boolean;
  uploadTarget: UploadTarget;
  photoError: string | null;
  onOpenPhotoPicker: (target: 'avatar' | 'cover' | number) => void;
  onRemoveGalleryPhoto: (index: number) => void;
}

export default function PhotosPanel({
  profile, editing, uploadTarget, photoError, onOpenPhotoPicker, onRemoveGalleryPhoto,
}: PhotosPanelProps) {
  const uploadInProgress = uploadTarget !== null;

  return (
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
            onClick={() => editing && onOpenPhotoPicker('avatar')}
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
            <GallerySlot
              key={i}
              index={i}
              photoUrl={photoUrl}
              isLocked={isLocked}
              editing={editing}
              isUploading={uploadTarget === i}
              uploadInProgress={uploadInProgress}
              onPick={onOpenPhotoPicker}
              onRemove={onRemoveGalleryPhoto}
            />
          );
        })}
      </div>
      <p className="text-xs text-neutral-400 mt-3">Add up to 5 photos. Your first photo is your main profile picture.</p>
    </div>
  );
}
