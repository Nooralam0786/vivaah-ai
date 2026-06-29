'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Phone, Video, ArrowLeft, Search, Plus } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import { getSocket, disconnectSocket } from '@/lib/socket-client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  isOnline: boolean;
  lastMsg: string;
  time: string;
  unread: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface SocketMessage {
  id: string;
  conversationId: string;
  text: string;
  senderId: string;
  time: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  if (!iso || iso === 'Just now') return 'Just now';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function msgTime(iso: string): string {
  if (!iso || iso === 'Just now') return 'Just now';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ConvSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-vivaah-border animate-pulse">
      <div className="w-11 h-11 rounded-full bg-neutral-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-neutral-200 rounded w-28" />
        <div className="h-2.5 bg-neutral-100 rounded w-44" />
      </div>
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function MessagesInner() {
  const searchParams = useSearchParams();
  const initUserId   = searchParams.get('userId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId]   = useState<string | null>(null);
  const [pendingUser, setPendingUser]     = useState<{ userId: string; name: string; photo: string | null } | null>(null);
  const [messages, setMessages]           = useState<Record<string, ChatMessage[]>>({});
  const [text, setText]                   = useState('');
  const [search, setSearch]               = useState('');
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [sending, setSending]             = useState(false);
  const [isTyping, setIsTyping]           = useState(false);   // partner is typing
  const [connected, setConnected]         = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_error, setError]               = useState<string | null>(null);

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  const auth = getAuthFromStorage();

  // Keep ref in sync so socket callbacks always see latest value
  useEffect(() => { activeConvIdRef.current = activeConvId; }, [activeConvId]);

  // ── Browser notification permission ───────────────────────────────────────
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ── Mark conversation as read ─────────────────────────────────────────────
  const markAsRead = useCallback(async (convId: string) => {
    if (!auth) return;
    fetch(`/api/chat/conversations/${convId}/read`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth) return;

    const socket = getSocket(auth.accessToken);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_message', (msg: SocketMessage) => {
      const currentConvId = activeConvIdRef.current;
      const isMine        = msg.senderId === auth.userId;

      setMessages((prev) => {
        const existing = prev[msg.conversationId] ?? [];
        if (existing.some((m) => m.id === msg.id)) return prev;
        const newMsg: ChatMessage = { id: msg.id, text: msg.text, sender: isMine ? 'me' : 'them', time: msg.time };
        return { ...prev, [msg.conversationId]: [...existing, newMsg] };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMsg: msg.text, time: msg.time, unread: c.id === currentConvId ? 0 : c.unread + 1 }
            : c,
        ),
      );

      /* Browser notification for messages from others when tab is not active */
      if (!isMine && msg.conversationId !== currentConvId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          const conv = conversations.find((c) => c.id === msg.conversationId);
          new Notification(`New message from ${conv?.name ?? 'Someone'}`, {
            body: msg.text.length > 60 ? msg.text.slice(0, 60) + '…' : msg.text,
            icon: conv?.photo ?? '/favicon.ico',
            tag:  msg.conversationId,
          });
        }
      }

      /* Auto-mark as read if this conversation is currently open */
      if (msg.conversationId === currentConvId && !isMine) {
        markAsRead(msg.conversationId);
      }
    });

    socket.on('user_typing', () => {
      setIsTyping(true);
    });

    socket.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      disconnectSocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Join / leave conversation rooms ────────────────────────────────────────
  useEffect(() => {
    if (!auth) return;
    const socket = getSocket(auth.accessToken);

    if (activeConvId) {
      socket.emit('join_conversation', activeConvId);
      setIsTyping(false);
    }

    return () => {
      if (activeConvId) socket.emit('leave_conversation', activeConvId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId]);

  // ── Fetch conversation list ─────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!auth) return;
    try {
      const res  = await fetch('/api/chat/conversations', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (!json.success) return;
      setConversations(json.data);
      return json.data as Conversation[];
    } catch { return []; }
  }, [auth]);

  // ── Fetch messages for a conversation ──────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
    if (!auth) return;
    setLoadingMsgs(true);
    try {
      const res  = await fetch(`/api/chat/conversations/${convId}/messages`, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (!json.success) return;
      setMessages((prev) => ({ ...prev, [convId]: json.data }));
    } finally {
      setLoadingMsgs(false);
    }
  }, [auth]);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth) { setError('Please log in.'); setLoadingConvs(false); return; }

    fetchConversations().then((convs) => {
      setLoadingConvs(false);
      if (!convs || convs.length === 0) return;

      if (initUserId) {
        const match = convs.find((c) => c.userId === initUserId);
        if (match) { setActiveConvId(match.id); return; }
      }
      setActiveConvId(convs[0].id);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle ?userId= param ──────────────────────────────────────────────────
  useEffect(() => {
    if (!initUserId || !auth || loadingConvs) return;
    const match = conversations.find((c) => c.userId === initUserId);
    if (match) { setActiveConvId(match.id); return; }

    fetch(`/api/users/${initUserId}`, { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setPendingUser({ userId: initUserId, name: json.data.name, photo: json.data.photo });
          setActiveConvId(null);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initUserId, loadingConvs]);

  // ── Load messages + mark read when conversation changes ───────────────────
  useEffect(() => {
    if (!activeConvId) return;
    setPendingUser(null);
    if (!messages[activeConvId]) fetchMessages(activeConvId);
    markAsRead(activeConvId);
    /* Clear unread badge in conversation list */
    setConversations((prev) => prev.map((c) => c.id === activeConvId ? { ...c, unread: 0 } : c));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  const activeMessages = activeConvId ? (messages[activeConvId] ?? []) : [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping]);

  // ── Auto-resize textarea ───────────────────────────────────────────────────
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  }, [text]);

  // ── Typing emit ────────────────────────────────────────────────────────────
  const emitTyping = useCallback(() => {
    if (!auth || !activeConvId) return;
    const socket = getSocket(auth.accessToken);
    socket.emit('typing', { convId: activeConvId });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit('stop_typing', { convId: activeConvId });
    }, 1500);
  }, [auth, activeConvId]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !auth) return;

    const activeConv = conversations.find((c) => c.id === activeConvId);
    const toUserId   = activeConv?.userId ?? pendingUser?.userId;
    if (!toUserId) return;

    // Stop typing indicator
    if (activeConvId) {
      getSocket(auth.accessToken).emit('stop_typing', { convId: activeConvId });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    }

    setText('');
    setSending(true);

    // Optimistic update
    const optimisticId  = `local-${Date.now()}`;
    const optimisticMsg: ChatMessage = { id: optimisticId, text: trimmed, sender: 'me', time: 'Just now' };

    if (activeConvId) {
      setMessages((prev) => ({ ...prev, [activeConvId]: [...(prev[activeConvId] ?? []), optimisticMsg] }));
    } else {
      setMessages((prev) => ({ ...prev, __pending__: [...(prev.__pending__ ?? []), optimisticMsg] }));
    }

    try {
      const res  = await fetch('/api/chat/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ content: trimmed, toUserId }),
      });
      const json = await res.json();

      if (json.success) {
        const newConvId = json.data.conversationId;

        if (!activeConvId) {
          setActiveConvId(newConvId);
          setPendingUser(null);
          setMessages((prev) => {
            const pending = prev.__pending__ ?? [];
            const real: ChatMessage = { id: json.data.id, text: json.data.text, sender: 'me', time: json.data.time };
            const updated = pending.filter((m) => m.id !== optimisticId).concat(real);
            const { __pending__: _, ...rest } = prev;
            return { ...rest, [newConvId]: updated };
          });
        } else {
          // Replace optimistic with confirmed message (socket may have already added it — deduplicate)
          setMessages((prev) => {
            const existing = prev[activeConvId] ?? [];
            const withoutOptimistic = existing.filter((m) => m.id !== optimisticId);
            if (withoutOptimistic.some((m) => m.id === json.data.id)) return { ...prev, [activeConvId]: withoutOptimistic };
            const real: ChatMessage = { id: json.data.id, text: json.data.text, sender: 'me', time: json.data.time };
            return { ...prev, [activeConvId]: [...withoutOptimistic, real] };
          });
        }

        fetchConversations();
      }
    } catch {
      // Optimistic message stays visible
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const activeConv    = conversations.find((c) => c.id === activeConvId);
  const chatPartner   = activeConv ?? (pendingUser ? { ...pendingUser, isOnline: false, lastMsg: '', time: '', unread: 0, id: '' } : null);
  const displayMessages = activeConvId ? activeMessages : (messages.__pending__ ?? []);
  const filteredConvs   = conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  if (!auth) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20 text-neutral-400">
        <p className="font-medium text-neutral-600">Please log in to view messages.</p>
        <a href="/login" className="mt-2 text-sm text-primary-700 font-semibold hover:underline inline-block">Go to login →</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 120px)', minHeight: '540px' }}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-neutral-900">Messages</h1>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${connected ? 'text-green-500' : 'text-neutral-400'}`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-neutral-300'}`} />
          {connected ? 'Live' : 'Connecting…'}
        </div>
      </div>

      <div className="flex flex-1 bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden min-h-0">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className={`${activeConvId || pendingUser ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 lg:w-80 flex-col border-r border-vivaah-border flex-shrink-0`}>

          <div className="p-3 border-b border-vivaah-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => { setActiveConvId(null); }}
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
              <button
                key={conv.id}
                onClick={() => { setActiveConvId(conv.id); setPendingUser(null); }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-vivaah-bg transition-colors text-left border-b border-vivaah-border/50 ${
                  activeConvId === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-700' : ''
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
            ))}
          </div>
        </div>

        {/* ── Chat Window ───────────────────────────────────────────────────── */}
        {chatPartner ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header */}
            <div className="px-4 py-3 border-b border-vivaah-border flex items-center gap-3 bg-white flex-shrink-0">
              <button
                onClick={() => { setActiveConvId(null); setPendingUser(null); }}
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
                <a href={`/profile/${chatPartner.userId}`} className="font-semibold text-neutral-900 text-sm hover:text-primary-700 transition-colors">
                  {chatPartner.name}
                </a>
                <p className={`text-xs ${isTyping ? 'text-primary-600 font-medium' : chatPartner.isOnline ? 'text-green-500' : 'text-neutral-400'}`}>
                  {isTyping ? 'typing…' : chatPartner.isOnline ? '● Online now' : 'Offline'}
                </p>
              </div>

              <div className="flex gap-1.5 ml-auto">
                <button className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors">
                  <Phone size={15} />
                </button>
                <button className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors">
                  <Video size={15} />
                </button>
                <a href={`/profile/${chatPartner.userId}`} className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors">
                  <Plus size={15} />
                </a>
              </div>
            </div>

            {/* Messages area */}
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
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'them' && (
                      <div className={`w-7 h-7 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 flex items-center justify-center text-sm ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        {chatPartner.photo
                          ? <img src={chatPartner.photo} alt="" className="w-full h-full object-cover" />
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
                      <p className="text-[10px] text-neutral-400 mt-0.5 px-1">{msgTime(msg.time)}</p>
                    </div>
                  </div>
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

            {/* Input */}
            <div className="px-4 py-3 border-t border-vivaah-border bg-white flex-shrink-0">
              <div className="flex gap-2 items-end">
                <div className="flex-1 bg-vivaah-bg border border-vivaah-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-700/20 focus-within:border-primary-700 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => { setText(e.target.value); emitTyping(); }}
                    onKeyDown={handleKey}
                    placeholder={`Message ${chatPartner.name}…`}
                    rows={1}
                    className="w-full bg-transparent text-sm text-neutral-800 outline-none resize-none placeholder:text-neutral-400 leading-relaxed"
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
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
          </div>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center text-center text-neutral-400">
            <div>
              <div className="text-5xl mb-4">💬</div>
              <p className="font-semibold text-neutral-700 text-base">Your Messages</p>
              <p className="text-sm mt-1 max-w-xs">Select a conversation or go to a profile and click "Message" to start chatting.</p>
              <a href="/discover" className="inline-block mt-4 px-5 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Discover Profiles
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-neutral-900 mb-4">Messages</h1>
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card h-96 animate-pulse" />
      </div>
    }>
      <MessagesInner />
    </Suspense>
  );
}
