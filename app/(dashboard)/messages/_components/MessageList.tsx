'use client';

import { memo } from 'react';
import { Lock } from 'lucide-react';
import { msgTime } from './helpers';
import type { ChatMessage, ChatPartner } from './types';

interface MessageBubbleProps {
  msg: ChatMessage;
  showAvatar: boolean;
  partnerPhoto: string | null;
}

function MessageBubbleComponent({ msg, showAvatar, partnerPhoto }: MessageBubbleProps) {
  return (
    <div className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
      {msg.sender === 'them' && (
        <div className={`w-7 h-7 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 flex items-center justify-center text-sm ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
          {partnerPhoto
            ? <img src={partnerPhoto} alt="" className="w-full h-full object-cover" />
            : '👤'}
        </div>
      )}
      <div className={`max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          msg.sender === 'me'
            ? 'bg-primary-gradient text-white rounded-tr-sm'
            : 'bg-white text-neutral-800 border border-vivaah-border rounded-tl-sm shadow-sm'
        }`}>
          {msg.text}
        </div>
        <p className="text-[10px] text-neutral-400 mt-0.5 px-1 flex items-center gap-1">
          <Lock size={9} className="opacity-60" />
          {msgTime(msg.time)}
        </p>
      </div>
    </div>
  );
}

const MessageBubble = memo(MessageBubbleComponent);

interface MessageListProps {
  loadingMsgs: boolean;
  displayMessages: ChatMessage[];
  chatPartner: ChatPartner;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({
  loadingMsgs,
  displayMessages,
  chatPartner,
  isTyping,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-vivaah-bg min-h-0">
      {loadingMsgs && (
        <div className="text-center py-8 text-neutral-400">
          <div className="animate-spin w-5 h-5 border-2 border-primary-700/30 border-t-primary-700 rounded-full mx-auto mb-2" />
          <p className="text-xs">Loading messages…</p>
        </div>
      )}

      {!loadingMsgs && displayMessages.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          <div className="text-4xl mb-3">👋</div>
          <p className="font-medium text-neutral-600">Say hello to {chatPartner.name}!</p>
          <p className="text-xs mt-1">Be the first to send a message.</p>
        </div>
      )}

      {displayMessages.map((msg, idx) => {
        const prev = displayMessages[idx - 1];
        const showAvatar = msg.sender === 'them' && (!prev || prev.sender !== 'them');
        return (
          <MessageBubble
            key={msg.id}
            msg={msg}
            showAvatar={showAvatar}
            partnerPhoto={chatPartner.photo}
          />
        );
      })}

      {/* Typing indicator bubble */}
      {isTyping && (
        <div className="flex items-end gap-2 justify-start">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 flex items-center justify-center text-sm">
            {chatPartner.photo
              ? <img src={chatPartner.photo} alt="" className="w-full h-full object-cover" />
              : '👤'}
          </div>
          <div className="bg-white border border-vivaah-border rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 flex gap-1 items-center">
            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
