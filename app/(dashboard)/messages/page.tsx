'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getAuthFromStorage } from '@/lib/auth';
import { getSocket, disconnectSocket } from '@/lib/socket-client';
import { useWebRTC } from '@/hooks/useWebRTC';

/* WebRTC call UI is code-split out of the initial messages bundle — only needed once a call starts. */
const CallModal = dynamic(() => import('@/components/call/CallModal'), { ssr: false });
import {
  getOrCreateKeyPair,
  encryptMsg,
  decryptMsg,
  isE2EEncrypted,
  type E2EKeyPair,
} from '@/lib/encryption';
import ConversationList from './_components/ConversationList';
import ChatWindow from './_components/ChatWindow';
import NoChatSelected from './_components/NoChatSelected';
import type { Conversation, ChatMessage, SocketMessage } from './_components/types';

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

  // E2E encryption — my keypair + per-partner public key cache
  const myKeyPairRef       = useRef<E2EKeyPair | null>(null);
  const partnerPubKeyCache = useRef<Record<string, string | null>>({}); // userId → base64 pubkey or null

  const auth = getAuthFromStorage();

  // Socket ref for WebRTC
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  useEffect(() => {
    if (auth) socketRef.current = getSocket(auth.accessToken);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── E2E init: generate/load keypair + register public key with server ──────
  useEffect(() => {
    if (!auth) return;
    const kp = getOrCreateKeyPair(auth.userId);
    myKeyPairRef.current = kp;

    // Register public key with server (idempotent — server upserts)
    fetch('/api/users/public-key', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body:    JSON.stringify({ publicKey: kp.publicKey }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Fetch (and cache) a partner's E2E public key. Returns null if they haven't set one. */
  const getPartnerPubKey = useCallback(async (partnerId: string): Promise<string | null> => {
    if (partnerId in partnerPubKeyCache.current) return partnerPubKeyCache.current[partnerId];
    if (!auth) return null;
    try {
      const res  = await fetch(`/api/users/public-key?userId=${partnerId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const json = await res.json();
      const key  = json.success ? (json.data.publicKey ?? null) : null;
      partnerPubKeyCache.current[partnerId] = key;
      return key;
    } catch {
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Decrypt a single message text. Returns plaintext (or original if not encrypted / decryption fails). */
  const tryDecrypt = useCallback((text: string, partnerPubKey: string | null): string => {
    if (!isE2EEncrypted(text)) return text;
    if (!partnerPubKey || !myKeyPairRef.current) return '🔒 Encrypted message';
    return decryptMsg(text, partnerPubKey, myKeyPairRef.current.secretKey) ?? '🔒 Encrypted message';
  }, []);

  const {
    session: callSession, localStream, remoteStream,
    micOn, camOn,
    startCall, answerCall, rejectCall, endCall,
    toggleMic, toggleCam,
  } = useWebRTC(socketRef.current);

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

    socket.on('new_message', async (msg: SocketMessage) => {
      const currentConvId = activeConvIdRef.current;
      const isMine        = msg.senderId === auth.userId;

      // Decrypt the incoming message text
      const conv          = conversations.find((c) => c.id === msg.conversationId);
      const partnerId     = conv ? conv.userId : (isMine ? undefined : msg.senderId);
      const partnerPubKey = partnerId ? await getPartnerPubKey(partnerId) : null;
      const plainText     = tryDecrypt(msg.text, partnerPubKey);
      const displayText   = isE2EEncrypted(msg.text) ? '🔒 Encrypted message' : plainText;

      setMessages((prev) => {
        const existing = prev[msg.conversationId] ?? [];
        if (existing.some((m) => m.id === msg.id)) return prev;
        const newMsg: ChatMessage = { id: msg.id, text: plainText, sender: isMine ? 'me' : 'them', time: msg.time };
        return { ...prev, [msg.conversationId]: [...existing, newMsg] };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMsg: displayText, time: msg.time, unread: c.id === currentConvId ? 0 : c.unread + 1 }
            : c,
        ),
      );

      /* Browser notification for messages from others when tab is not active */
      if (!isMine && msg.conversationId !== currentConvId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          const notifBody = plainText === '🔒 Encrypted message'
            ? '🔒 Encrypted message'
            : (plainText.length > 60 ? plainText.slice(0, 60) + '…' : plainText);
          new Notification(`New message from ${conv?.name ?? 'Someone'}`, {
            body: notifBody,
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

  // ── Fetch messages for a conversation (with decryption) ───────────────────
  const fetchMessages = useCallback(async (convId: string, partnerId?: string) => {
    if (!auth) return;
    setLoadingMsgs(true);
    try {
      const res  = await fetch(`/api/chat/conversations/${convId}/messages`, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (!json.success) return;

      // Decrypt all messages with partner's public key
      const partnerPubKey = partnerId ? await getPartnerPubKey(partnerId) : null;
      const decrypted = (json.data as ChatMessage[]).map((m) => ({
        ...m,
        text: tryDecrypt(m.text, partnerPubKey),
      }));
      setMessages((prev) => ({ ...prev, [convId]: decrypted }));
    } finally {
      setLoadingMsgs(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, getPartnerPubKey, tryDecrypt]);

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
    const conv = conversations.find((c) => c.id === activeConvId);
    if (!messages[activeConvId]) fetchMessages(activeConvId, conv?.userId);
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

    // Encrypt the message if partner has an E2E public key
    const partnerPubKey    = await getPartnerPubKey(toUserId);
    const contentToSend    = (partnerPubKey && myKeyPairRef.current)
      ? encryptMsg(trimmed, partnerPubKey, myKeyPairRef.current.secretKey)
      : trimmed;

    // Optimistic update always shows plaintext
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
        body:    JSON.stringify({ content: contentToSend, toUserId }),
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
    <>
    <CallModal
      session={callSession}
      localStream={localStream}
      remoteStream={remoteStream}
      micOn={micOn}
      camOn={camOn}
      onAnswer={answerCall}
      onReject={rejectCall}
      onEnd={endCall}
      onToggleMic={toggleMic}
      onToggleCam={toggleCam}
    />
    <div className="max-w-7xl mx-auto animate-fade-in flex flex-col" style={{ height: 'calc(100dvh - var(--navbar-h, 3.5rem) - 2.5rem)', minHeight: '540px' }}>
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
          <ConversationList
            search={search}
            onSearchChange={setSearch}
            loadingConvs={loadingConvs}
            filteredConvs={filteredConvs}
            pendingUser={pendingUser}
            activeConvId={activeConvId}
            onSelectPending={() => { setActiveConvId(null); }}
            onSelectConv={(id) => { setActiveConvId(id); setPendingUser(null); }}
          />
        </div>

        {/* ── Chat Window ───────────────────────────────────────────────────── */}
        {chatPartner ? (
          <ChatWindow
            chatPartner={chatPartner}
            isTyping={isTyping}
            hasPartnerPubKey={!!partnerPubKeyCache.current[chatPartner.userId]}
            onBack={() => { setActiveConvId(null); setPendingUser(null); }}
            onStartAudioCall={() => chatPartner && startCall(chatPartner.userId, chatPartner.name, chatPartner.photo ?? null, 'audio')}
            onStartVideoCall={() => chatPartner && startCall(chatPartner.userId, chatPartner.name, chatPartner.photo ?? null, 'video')}
            loadingMsgs={loadingMsgs}
            displayMessages={displayMessages}
            messagesEndRef={messagesEndRef}
            text={text}
            onTextChange={(v) => { setText(v); emitTyping(); }}
            onKeyDown={handleKey}
            onSend={sendMessage}
            sending={sending}
            textareaRef={textareaRef}
          />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
    </>
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
