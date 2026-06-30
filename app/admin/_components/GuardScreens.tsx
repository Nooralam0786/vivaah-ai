'use client';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#6B1B3D]/30 border-t-[#6B1B3D] rounded-full animate-spin" />
        <span className="text-gray-500 text-sm">Verifying admin access…</span>
      </div>
    </div>
  );
}

export function UnauthorizedScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Login Required</h2>
        <p className="text-sm text-gray-500 mb-5">Please log in to your admin account to access the panel.</p>
        <button onClick={onLogin}
          className="px-6 py-2.5 bg-[#6B1B3D] text-white rounded-xl text-sm font-semibold hover:bg-[#8B2252] transition-colors">
          Go to Login
        </button>
      </div>
    </div>
  );
}

export function ForbiddenScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">⛔</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-sm text-gray-500 mb-2">Your account doesn&apos;t have admin privileges.</p>
        <p className="text-xs text-gray-400 mb-5">Contact <span className="text-[#6B1B3D] font-medium">arun@techotd.com</span> to request access.</p>
        <button onClick={onBack}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
