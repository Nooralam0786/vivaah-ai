'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck, ChevronLeft, RefreshCw } from 'lucide-react';

const STEPS = ['Account', 'Verify', 'Password', 'Profile', 'Photos'];
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [session, setSession] = useState<{ userId: string; phone: string; devOtp?: string } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem('vivaah_onb');
    if (!raw) { router.replace('/signup'); return; }
    try {
      const parsed = JSON.parse(raw);
      setSession(parsed);
      // In dev mode, auto-fill the OTP boxes
      if (parsed.devOtp && parsed.devOtp.length === OTP_LENGTH) {
        setDigits(parsed.devOtp.split(''));
      }
    } catch { router.replace('/signup'); }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleDigit = (idx: number, value: string) => {
    const ch = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = ch;
    setDigits(next);
    setError('');
    if (ch && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = useCallback(async () => {
    if (!session) return;
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) { setError('Please enter all 6 digits'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.userId, phone: session.phone, otp }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message || 'Invalid or expired code'); return; }
      // Store the verify token for the create-password step
      sessionStorage.setItem('vivaah_onb', JSON.stringify({ ...session, verifyToken: json.data.verifyToken }));
      router.push('/create-password');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [digits, session, router]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (digits.every((d) => d !== '')) handleVerify();
  }, [digits, handleVerify]);

  const handleResend = async () => {
    if (!session || countdown > 0) return;
    setResendLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: session.phone }),
      });
      const json = await res.json();
      if (json.success) {
        const newDigits = Array(OTP_LENGTH).fill('');
        if (json.data?.devOtp) {
          const updated = { ...session, devOtp: json.data.devOtp };
          sessionStorage.setItem('vivaah_onb', JSON.stringify(updated));
          setSession(updated);
          json.data.devOtp.split('').forEach((c: string, i: number) => { newDigits[i] = c; });
        }
        setDigits(newDigits);
        setCountdown(RESEND_COOLDOWN);
        inputRefs.current[Math.min(OTP_LENGTH - 1, 0)]?.focus();
      } else {
        setError(json.error?.message || 'Failed to resend OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const maskedPhone = session?.phone ? `+91 ****${session.phone.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-6 sm:mb-8 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`flex flex-col items-center ${i === 1 ? 'opacity-100' : i === 0 ? 'opacity-60' : 'opacity-35'}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 1 ? 'bg-[#7A0026] border-[#7A0026] text-white' : i === 0 ? 'bg-[#7A0026]/20 border-[#7A0026]/40 text-[#7A0026]' : 'border-neutral-300 text-neutral-400 bg-white'}`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className={`hidden xs:block text-[10px] mt-1 font-medium ${i === 1 ? 'text-[#7A0026]' : 'text-neutral-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 sm:w-16 h-0.5 mb-0 xs:mb-4 mx-1 ${i === 0 ? 'bg-[#7A0026]/50' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 p-5 sm:p-8 text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-[#7A0026] rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#D4A017] fill-[#D4A017]" />
            </div>
            <span className="text-lg font-extrabold text-[#7A0026]">VivaahAI</span>
          </Link>

          <div className="w-16 h-16 bg-[#FAF0F3] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#7A0026]" />
          </div>

          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Verify Your Mobile</h1>
          <p className="text-sm text-neutral-500 mb-1">We sent a 6-digit code to</p>
          <p className="text-sm font-bold text-neutral-800 mb-2">{maskedPhone}</p>

          {session?.devOtp && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-xs text-amber-600 font-medium mb-1">Dev Mode — OTP auto-filled</p>
              <p className="text-2xl font-extrabold text-amber-700 tracking-widest">{session.devOtp}</p>
            </div>
          )}

          {/* OTP boxes */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 max-w-xs mx-auto mb-4" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`OTP digit ${i + 1}`}
                className={`aspect-square w-full text-center text-base sm:text-lg font-bold rounded-xl border-2 outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20
                  ${d ? 'border-[#7A0026] bg-[#FAF0F3] text-[#7A0026]' : 'border-neutral-200 bg-neutral-50 text-neutral-900'}
                  ${error ? 'border-red-400 bg-red-50' : ''}
                  focus:border-[#7A0026]`}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading || digits.some((d) => !d)}
            className="w-full py-3 bg-[#7A0026] hover:bg-[#A10035] text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 mb-4"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {loading ? 'Verifying…' : 'Verify Code'}
          </button>

          {/* Resend */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-neutral-500">Didn't receive it?</span>
            {countdown > 0 ? (
              <span className="text-neutral-400 font-medium">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-[#7A0026] font-semibold hover:underline flex items-center gap-1 disabled:opacity-60"
              >
                {resendLoading ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <RefreshCw className="w-3 h-3" />}
                Resend OTP
              </button>
            )}
          </div>

          <Link href="/signup" className="mt-6 flex items-center justify-center gap-1 text-xs text-neutral-400 hover:text-[#7A0026] transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
