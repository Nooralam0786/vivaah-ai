'use client';

import { MessageSquare, Clock } from 'lucide-react';

const EXAMPLE_THREADS = [
  { user1: 'Ananya Singh',  user2: 'Rohit Verma',   last: 'Sure! How about Saturday evening?', time: '2 min ago',  unread: 2 },
  { user1: 'Pooja Sharma',  user2: 'Arjun Mehta',   last: 'I love classical music too!',        time: '18 min ago', unread: 0 },
  { user1: 'Kavitha Nair',  user2: 'Siddharth Rao', last: 'My family is from Kochi originally', time: '1 hr ago',   unread: 1 },
  { user1: 'Meera Kapoor',  user2: 'Vikram Singh',  last: 'What do you do on weekends?',        time: '3 hr ago',   unread: 0 },
];

export default function MessagesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor conversations between matched users</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={18} className="text-blue-500" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Message Monitoring Dashboard</h2>
        <p className="text-white/70 text-sm max-w-lg">
          View all active message threads, flag inappropriate content, respond to user reports, and monitor platform communication health.
        </p>
      </div>

      {/* Example threads */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recent Message Threads</p>
        </div>
        <div className="divide-y divide-gray-50">
          {EXAMPLE_THREADS.map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-xs font-bold border-2 border-white z-10">{t.user1[0]}</div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">{t.user2[0]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{t.user1} &amp; {t.user2}</p>
                <p className="text-xs text-gray-400 truncate">{t.last}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-gray-400">{t.time}</span>
                {t.unread > 0 && (
                  <span className="w-4 h-4 bg-[#6B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{t.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">Example message threads shown above — real message monitoring will be available soon.</p>
    </div>
  );
}
