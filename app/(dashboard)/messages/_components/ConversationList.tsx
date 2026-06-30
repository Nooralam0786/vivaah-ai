'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import ConvSkeleton from './ConvSkeleton';
import { formatTime } from './helpers';
import type { Conversation } from './types';

interface ConversationListItemProps {
  conv: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
}

function ConversationListItemComponent({ conv, active, onSelect }: ConversationListItemProps) {
  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={`w-full flex items-center gap-3 p-4 hover:bg-vivaah-bg transition-colors text-left border-b border-vivaah-border/50 ${
        active ? 'bg-primary-50 border-l-2 border-l-primary-700' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center text-xl">
          {conv.photo
            ? <img src={conv.photo} alt={conv.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            : '👤'}
        </div>
        {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-800'}`}>
            {conv.name}
          </span>
          <span className="text-[10px] text-neutral-400 flex-shrink-0">{formatTime(conv.time)}</span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>
          {conv.lastMsg || 'Start a conversation'}
        </p>
      </div>
      {conv.unread > 0 && (
        <div className="w-5 h-5 bg-primary-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          {conv.unread}
        </div>
      )}
    </button>
  );
}

const ConversationListItem = memo(ConversationListItemComponent);

interface PendingUser { userId: string; name: string; photo: string | null; }

interface ConversationListProps {
  search: string;
  onSearchChange: (v: string) => void;
  loadingConvs: boolean;
  filteredConvs: Conversation[];
  pendingUser: PendingUser | null;
  activeConvId: string | null;
  onSelectPending: () => void;
  onSelectConv: (id: string) => void;
}

export default function ConversationList({
  search,
  onSearchChange,
  loadingConvs,
  filteredConvs,
  pendingUser,
  activeConvId,
  onSelectPending,
  onSelectConv,
}: ConversationListProps) {
  return (
    <>
      <div className="p-3 border-b border-vivaah-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-9 pr-4 py-2 bg-vivaah-bg rounded-xl text-xs border border-vivaah-border outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingConvs && Array.from({ length: 4 }).map((_, i) => <ConvSkeleton key={i} />)}

        {!loadingConvs && filteredConvs.length === 0 && !pendingUser && (
          <div className="p-6 text-center text-neutral-400">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm font-medium text-neutral-500">No conversations yet</p>
            <p className="text-xs mt-1">Go to a profile and click "Message"</p>
          </div>
        )}

        {pendingUser && (
          <button
            onClick={onSelectPending}
            className="w-full flex items-center gap-3 p-4 hover:bg-vivaah-bg transition-colors text-left border-b border-vivaah-border bg-primary-50 border-l-2 border-l-primary-700"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 flex items-center justify-center text-xl">
              {pendingUser.photo ? <img src={pendingUser.photo} alt="" className="w-full h-full object-cover" /> : '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm text-neutral-900 truncate block">{pendingUser.name}</span>
              <span className="text-xs text-primary-600">New conversation</span>
            </div>
          </button>
        )}

        {filteredConvs.map((conv) => (
          <ConversationListItem
            key={conv.id}
            conv={conv}
            active={activeConvId === conv.id}
            onSelect={onSelectConv}
          />
        ))}
      </div>
    </>
  );
}
