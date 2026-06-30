import { Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';

interface ProfileActionButtonsProps {
  userId: string;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}

export default function ProfileActionButtons({ userId, liked, saved, onLike, onSave }: ProfileActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onLike}
        className={`flex-1 min-w-[140px] py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          liked
            ? 'bg-primary-gradient text-white shadow-sm'
            : 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50'
        }`}
      >
        <Heart size={16} className={liked ? 'fill-white' : ''} />
        {liked ? 'Interest Sent ✓' : 'Send Interest'}
      </button>

      <a
        href={`/messages?userId=${userId}`}
        className="flex-1 min-w-[120px] py-3 bg-white border border-vivaah-border rounded-2xl font-semibold text-sm text-neutral-700 hover:border-primary-700/40 hover:text-primary-700 transition-colors flex items-center justify-center gap-2"
      >
        <MessageSquare size={16} /> Message
      </a>

      <button
        onClick={onSave}
        aria-label={saved ? 'Remove bookmark' : 'Bookmark profile'}
        className={`w-12 h-12 flex-shrink-0 rounded-2xl border flex items-center justify-center transition-all ${
          saved ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-white border-vivaah-border text-neutral-400 hover:text-amber-500'
        }`}
      >
        <Bookmark size={18} className={saved ? 'fill-amber-400' : ''} />
      </button>

      <button aria-label="Share profile" className="w-12 h-12 flex-shrink-0 rounded-2xl border border-vivaah-border bg-white flex items-center justify-center text-neutral-400 hover:text-primary-700 transition-colors">
        <Share2 size={18} />
      </button>
    </div>
  );
}
