'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Stage = 'email' | 'otp' | 'reset' | 'done';

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resetToken, setResetToken] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Failed to send OTP. Please try again.');
        return;
      }
      if (json.data?.devOtp) setDevOtp(json.data.devOtp);
      startResendTimer();
      setStage('otp');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Invalid OTP. Please try again.');
        return;
      }
      setResetToken(json.data.resetToken);
      setStage('reset');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 8) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resetToken}` },
        body: JSON.stringify({ password: newPassword }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Failed to reset password. Please try again.');
        return;
      }
      setStage('done');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const stageConfig = {
    email: { icon: '🔐', title: 'Forgot Password?', desc: "No worries! Enter your email and we'll send you a reset code." },
    otp: { icon: '📧', title: 'Enter OTP', desc: `We've sent a 6-digit code to ${email}` },
    reset: { icon: '🔑', title: 'Set New Password', desc: 'Choose a strong password for your account.' },
    done: { icon: '🎉', title: 'Password Reset!', desc: 'Your password has been updated successfully.' },
  };

  const current = stageConfig[stage];

  return (
    <div className="min-h-screen flex items-center justify-center bg-vivaah-bg p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center text-white"><HeartIcon /></div>
          <span className="text-xl font-bold text-primary-700">VivaahAI</span>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* Stage indicator */}
          <div className="flex gap-1.5 mb-6">
            {['email', 'otp', 'reset'].map((s, i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                stage === 'done' || (stage === 'email' && i === 0) || (stage === 'otp' && i <= 1) || (stage === 'reset' && i <= 2)
                  ? 'bg-primary-700' : 'bg-vivaah-border'
              }`} />
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              {current.icon}
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">{current.title}</h2>
            <p className="text-neutral-500 text-sm mt-1">{current.desc}</p>
          </div>

          {/* Email Stage */}
          {stage === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" required
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading || !email}
                className="w-full py-3 bg-primary-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sending...</> : 'Send Reset Code →'}
              </button>
            </form>
          )}

          {/* OTP Stage */}
          {stage === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3 text-center">Enter 6-digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && i > 0) { const prev = document.getElementById(`otp-${i - 1}`); (prev as HTMLInputElement)?.focus(); } }}
                      className="w-12 h-14 text-center text-xl font-bold border border-vivaah-border rounded-xl outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 bg-vivaah-bg" />
                  ))}
                </div>
                {devOtp && (
                  <p className="mt-3 text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2">
                    Dev mode OTP: <strong>{devOtp}</strong>
                  </p>
                )}
              </div>
              <div className="text-center text-sm text-neutral-500">
                {resendTimer > 0
                  ? <span>Resend code in <span className="font-semibold text-primary-700">{resendTimer}s</span></span>
                  : <button type="button" onClick={() => handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent)} className="font-semibold text-primary-700 hover:underline">Resend Code</button>}
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading || otp.some((d) => !d)}
                className="w-full py-3 bg-primary-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Verifying...</> : 'Verify OTP →'}
              </button>
            </form>
          )}

          {/* Reset Password Stage */}
          {stage === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters" required
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password" required
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-vivaah-border bg-vivaah-bg focus:ring-primary-700/20 focus:border-primary-700'
                  }`} />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              {/* Password strength */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${
                        newPassword.length >= (i + 1) * 2 ? (newPassword.length >= 10 ? 'bg-green-500' : newPassword.length >= 6 ? 'bg-amber-500' : 'bg-red-400') : 'bg-vivaah-border'
                      }`} />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {newPassword.length >= 10 ? '✅ Strong password' : newPassword.length >= 6 ? '⚠️ Medium strength' : '❌ Too weak'}
                  </p>
                </div>
              )}
              {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading || !newPassword || newPassword !== confirmPassword || newPassword.length < 8}
                className="w-full py-3 bg-primary-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Updating...</> : 'Reset Password →'}
              </button>
            </form>
          )}

          {/* Done Stage */}
          {stage === 'done' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mx-auto">✅</div>
              <p className="text-neutral-600 text-sm">You can now sign in with your new password.</p>
              <button onClick={() => router.push('/login')}
                className="w-full py-3 bg-primary-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all">
                Go to Sign In →
              </button>
            </div>
          )}

          {stage !== 'done' && (
            <p className="text-center text-sm text-neutral-500 mt-5">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-primary-700 hover:text-secondary-500 transition-colors">Sign In</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
