'use client';

export default function NoChatSelected() {
  return (
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
  );
}
