'use client';

import { ArrowLeft, Phone, Video, Plus, Lock } from 'lucide-react';
import type { ChatPartner } from './types';

interface ChatHeaderProps {
  chatPartner: ChatPartner;
  isTyping: boolean;
  hasPartnerPubKey: boolean;
  onBack: () => void;
  onStartAudioCall: () => void;
  onStartVideoCall: () => void;
}

export default function ChatHeader({
  chatPartner,
  isTyping,
  hasPartnerPubKey,
  onBack,
  onStartAudioCall,
  onStartVideoCall,
}: ChatHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-vivaah-border flex items-center gap-3 bg-white flex-shrink-0">
      <button
        onClick={onBack}
        className="sm:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-vivaah-bg transition-colors"
      >
        <ArrowLeft size={18} />
      </button>

      <a href={`/profile/${chatPartner.userId}`} className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center text-lg">
          {chatPartner.photo
            ? <img src={chatPartner.photo} alt={chatPartner.name} className="w-full h-full object-cover" />
            : '👤'}
        </div>
        {chatPartner.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />}
      </a>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a href={`/profile/${chatPartner.userId}`} className="font-semibold text-neutral-900 text-sm hover:text-primary-700 transition-colors">
            {chatPartner.name}
          </a>
          {hasPartnerPubKey && (
            <span className="flex items-center gap-0.5 text-[9px] text-green-600 font-medium bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
              <Lock size={8} /> E2E Encrypted
            </span>
          )}
        </div>
        <p className={`text-xs ${isTyping ? 'text-primary-600 font-medium' : chatPartner.isOnline ? 'text-green-500' : 'text-neutral-400'}`}>
          {isTyping ? 'typing…' : chatPartner.isOnline ? '● Online now' : 'Offline'}
        </p>
      </div>

      <div className="flex gap-1.5 ml-auto">
        <button
          onClick={onStartAudioCall}
          aria-label={`Start audio call with ${chatPartner?.name}`}
          className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/50">
          <Phone size={15} aria-hidden="true" />
        </button>
        <button
          onClick={onStartVideoCall}
          aria-label={`Start video call with ${chatPartner?.name}`}
          className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/50">
          <Video size={15} aria-hidden="true" />
        </button>
        <a
          href={`/profile/${chatPartner.userId}`}
          aria-label={`View ${chatPartner?.name}'s profile`}
          className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/50">
          <Plus size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
