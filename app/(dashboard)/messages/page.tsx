'use client';

import { useState, useRef, useEffect } from 'react';

const CONVERSATIONS = [
  { id: 1, name: 'Ananya Singh', lastMsg: 'Hey! I saw your profile and I think we have a lot in common 😊', time: '2m ago', unread: 3, isOnline: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 2, name: 'Neha Gupta', lastMsg: "That's amazing! I love traveling too", time: '1h ago', unread: 0, isOnline: false, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { id: 3, name: 'Priya Sharma', lastMsg: 'Would you like to schedule a video call?', time: '3h ago', unread: 1, isOnline: true, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 4, name: 'Kavya Reddy', lastMsg: 'Nice to meet you!', time: '1d ago', unread: 0, isOnline: false, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
];

const MOCK_MESSAGES: Record<number, { id: number; text: string; sender: 'me' | 'them'; time: string }[]> = {
  1: [
    { id: 1, text: "Hey! I saw your profile and I think we have a lot in common 😊", sender: 'them', time: '10:30 AM' },
    { id: 2, text: "Hi Ananya! Yes, I noticed too. You're also into yoga and travel?", sender: 'me', time: '10:32 AM' },
    { id: 3, text: "Yes! I love backpacking across Himachal. Have you been to Kasol?", sender: 'them', time: '10:33 AM' },
    { id: 4, text: "I've been to Kheerganga! Kasol is on my list. Maybe we can plan a trip with family someday 😄", sender: 'me', time: '10:35 AM' },
    { id: 5, text: "That's so cool! Are you free for a call this weekend?", sender: 'them', time: '10:38 AM' },
  ],
  2: [
    { id: 1, text: "Hi! I read your profile bio and it's really thoughtful", sender: 'them', time: 'Yesterday' },
    { id: 2, text: "Thank you! I try to be genuine. Your design work looks amazing btw", sender: 'me', time: 'Yesterday' },
    { id: 3, text: "That's amazing! I love traveling too", sender: 'them', time: '1h ago' },
  ],
};

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = CONVERSATIONS.find((c) => c.id === activeChat);
  const chatMessages = activeChat ? (messages[activeChat] || []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    const newMsg = { id: Date.now(), text: message, sender: 'me' as const, time: 'Just now' };
    setMessages((prev) => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }));
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-neutral-900 mb-4">Messages</h1>

      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden flex" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        {/* Sidebar */}
        <div className={`${activeChat ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 lg:w-80 flex-col border-r border-vivaah-border flex-shrink-0`}>
          <div className="p-4 border-b border-vivaah-border">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
              <input type="text" placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-vivaah-bg rounded-xl text-sm border border-vivaah-border outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((conv) => (
              <button key={conv.id} onClick={() => setActiveChat(conv.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-vivaah-bg transition-colors text-left border-b border-vivaah-border/50 ${activeChat === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-700' : ''}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-primary-100">
                    <img src={conv.photo} alt={conv.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-neutral-900 truncate">{conv.name}</span>
                    <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{conv.lastMsg}</p>
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

        {/* Chat Window */}
        {activeChat && activeConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-vivaah-border flex items-center gap-3 bg-white">
              <button onClick={() => setActiveChat(null)} className="sm:hidden p-1 text-neutral-400 hover:text-neutral-700">
                ←
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100">
                  <img src={activeConv.photo} alt={activeConv.name} className="w-full h-full object-cover" />
                </div>
                {activeConv.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">{activeConv.name}</p>
                <p className={`text-xs ${activeConv.isOnline ? 'text-green-500' : 'text-neutral-400'}`}>
                  {activeConv.isOnline ? 'Online now' : 'Offline'}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors text-sm">
                  📞
                </button>
                <button className="w-9 h-9 rounded-xl bg-vivaah-bg border border-vivaah-border flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-700/40 transition-colors text-sm">
                  🎥
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-vivaah-bg">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me'
                    ? 'bg-primary-gradient text-white rounded-tr-sm'
                    : 'bg-white text-neutral-800 border border-vivaah-border rounded-tl-sm shadow-xs'}`}>
                    {msg.text}
                    <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-neutral-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-vivaah-border bg-white">
              <div className="flex gap-2 items-end">
                <button className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-primary-700 transition-colors flex-shrink-0">
                  📎
                </button>
                <div className="flex-1 relative">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message..." rows={1}
                    className="w-full px-4 py-2.5 bg-vivaah-bg border border-vivaah-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
                </div>
                <button onClick={sendMessage} disabled={!message.trim()}
                  className="w-9 h-9 bg-primary-gradient rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 rotate-90">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center text-center text-neutral-400">
            <div>
              <div className="text-5xl mb-3">💬</div>
              <p className="font-medium text-neutral-600">Select a conversation</p>
              <p className="text-sm mt-1">Choose from your conversations to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
