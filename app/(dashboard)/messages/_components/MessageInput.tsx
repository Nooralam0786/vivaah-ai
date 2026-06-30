'use client';

import { Send } from 'lucide-react';

interface MessageInputProps {
  text: string;
  onTextChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  sending: boolean;
  partnerName: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export default function MessageInput({
  text,
  onTextChange,
  onKeyDown,
  onSend,
  sending,
  partnerName,
  textareaRef,
}: MessageInputProps) {
  return (
    <div className="px-4 py-3 border-t border-vivaah-border bg-white flex-shrink-0">
      <div className="flex gap-2 items-end">
        <div className="flex-1 bg-vivaah-bg border border-vivaah-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-700/20 focus-within:border-primary-700 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Message ${partnerName}…`}
            rows={1}
            className="w-full bg-transparent text-sm text-neutral-800 outline-none resize-none placeholder:text-neutral-400 leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!text.trim() || sending}
          className="w-10 h-10 bg-primary-gradient rounded-2xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {sending
            ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Send size={16} />}
        </button>
      </div>
      <p className="text-[10px] text-neutral-400 mt-1.5 pl-1">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
