'use client';

import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatMessage, ChatPartner } from './types';

interface ChatWindowProps {
  chatPartner: ChatPartner;
  isTyping: boolean;
  hasPartnerPubKey: boolean;
  onBack: () => void;
  onStartAudioCall: () => void;
  onStartVideoCall: () => void;
  loadingMsgs: boolean;
  displayMessages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  text: string;
  onTextChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  sending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatWindow({
  chatPartner,
  isTyping,
  hasPartnerPubKey,
  onBack,
  onStartAudioCall,
  onStartVideoCall,
  loadingMsgs,
  displayMessages,
  messagesEndRef,
  text,
  onTextChange,
  onKeyDown,
  onSend,
  sending,
  textareaRef,
}: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <ChatHeader
        chatPartner={chatPartner}
        isTyping={isTyping}
        hasPartnerPubKey={hasPartnerPubKey}
        onBack={onBack}
        onStartAudioCall={onStartAudioCall}
        onStartVideoCall={onStartVideoCall}
      />

      <MessageList
        loadingMsgs={loadingMsgs}
        displayMessages={displayMessages}
        chatPartner={chatPartner}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        text={text}
        onTextChange={onTextChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
        sending={sending}
        partnerName={chatPartner.name}
        textareaRef={textareaRef}
      />
    </div>
  );
}
