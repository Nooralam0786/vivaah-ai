import { memo } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

interface GallerySlotProps {
  index: number;
  photoUrl: string | undefined;
  isLocked: boolean;
  editing: boolean;
  isUploading: boolean;
  uploadInProgress: boolean;
  onPick: (index: number) => void;
  onRemove: (index: number) => void;
}

function GallerySlot({
  index, photoUrl, isLocked, editing, isUploading, uploadInProgress, onPick, onRemove,
}: GallerySlotProps) {
  return (
    <div className="relative aspect-square group">
      <button
        type="button"
        onClick={() => editing && !isLocked && onPick(index)}
        disabled={!editing || uploadInProgress || isLocked}
        className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-1 overflow-hidden transition-all ${
          photoUrl
            ? ''
            : !editing || isLocked
            ? 'bg-vivaah-bg border-2 border-dashed border-neutral-200 cursor-not-allowed opacity-40'
            : 'bg-vivaah-bg border-2 border-dashed border-primary-700/30 hover:border-primary-700/60 hover:bg-primary-50'
        }`}
      >
        {isUploading ? (
          <Loader2 className="animate-spin w-5 h-5 text-primary-700" />
        ) : photoUrl ? (
          <img src={photoUrl} alt={`Photo ${index + 2}`} className="w-full h-full object-cover" />
        ) : (
          <>
            <Plus className={`w-6 h-6 ${editing && !isLocked ? 'text-neutral-300 group-hover:text-primary-700' : 'text-neutral-200'}`} />
            {editing && !isLocked && <span className="text-xs text-neutral-400 group-hover:text-primary-700">Add Photo</span>}
          </>
        )}
      </button>
      {/* Delete button — only in edit mode */}
      {editing && photoUrl && !uploadInProgress && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove photo ${index + 2}`}
          className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default memo(GallerySlot);
