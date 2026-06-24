'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Heart, ChevronLeft, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const STEPS = ['Account', 'Verify', 'Password', 'Profile', 'Photos'];

interface Rule { label: string; test: (p: string) => boolean }
const RULES: Rule[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function strength(pw: string): { score: number; label: string; color: string } {
  const score = RULES.filter((r) => r.test(pw)).length;
  if (pw.length === 0) return { score: 0, label: '', color: '' };
  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-400' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-orange-400' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-400' };
  return { score: 4, label: 'Strong', color: 'bg-green-500' };
}

export default function CreatePasswordPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [session, setSession] = useState<{ userId: string; phone: string; verifyToken: string } | null>(null);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('vivaah_onb');
    if (!raw) { router.replace('/signup'); return; }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.verifyToken) { router.replace('/verify-otp'); return; }
      setSession(parsed);
    } catch { router.replace('/signup'); }
  }, [router]);

  const pwStrength = useMemo(() => strength(form.password), [form.password]);
  const rulesStatus = useMemo(() => RULES.map((r) => r.test(form.password)), [form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!rulesStatus.every(Boolean)) { setError('Please meet all password requirements'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.verifyToken}` },
        body: JSON.stringify({ password: form.password }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message || 'Failed to set password'); return; }
      // Log the user in immediately
      await login({ token: json.data.token, refreshToken: json.data.refreshToken, userId: json.data.userId, expiresIn: json.data.expiresIn });
      sessionStorage.removeItem('vivaah_onb');
      router.push('/profile-wizard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex flex-col items-center ${i === 2 ? 'opacity-100' : i < 2 ? 'opacity-60' : 'opacity-35'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 2 ? 'bg-[#7A0026] border-[#7A0026] text-white' : i < 2 ? 'bg-[#7A0026]/20 border-[#7A0026]/40 text-[#7A0026]' : 'border-neutral-300 text-neutral-400 bg-white'}`}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${i === 2 ? 'text-[#7A0026]' : 'text-neutral-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-10 sm:w-16 h-0.5 mb-4 mx-1 ${i < 2 ? 'bg-[#7A0026]/50' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 p-8">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 bg-[#7A0026] rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#D4A017] fill-[#D4A017]" />
              </div>
              <span className="text-lg font-extrabold text-[#7A0026]">VivaahAI</span>
            </Link>
          </div>

          <div className="w-14 h-14 bg-[#FAF0F3] rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-[#7A0026]" />
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-1">Create Password</h1>
          <p className="text-sm text-neutral-500 mb-6">Set a strong password to secure your account</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={show.password ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026]"
                />
                <button type="button" onClick={() => setShow((s) => ({ ...s, password: !s.password }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {show.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${n <= pwStrength.score ? pwStrength.color : 'bg-neutral-200'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${pwStrength.score <= 1 ? 'text-red-500' : pwStrength.score === 2 ? 'text-orange-500' : pwStrength.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {pwStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-2 gap-1.5">
              {RULES.map((r, i) => (
                <div key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${form.password.length > 0 ? (rulesStatus[i] ? 'text-green-600' : 'text-neutral-400') : 'text-neutral-400'}`}>
                  {rulesStatus[i] ? <Check className="w-3 h-3 text-green-600 flex-shrink-0" /> : <X className="w-3 h-3 text-neutral-300 flex-shrink-0" />}
                  {r.label}
                </div>
              ))}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={show.confirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${form.confirm && form.password !== form.confirm ? 'border-red-400 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:bg-white'}`}
                />
                <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#7A0026] hover:bg-[#A10035] text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {loading ? 'Setting up your account…' : 'Set Password & Continue'}
            </button>
          </form>

          <Link href="/verify-otp" className="mt-5 flex items-center justify-center gap-1 text-xs text-neutral-400 hover:text-[#7A0026] transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back to OTP Verification
          </Link>
        </div>
      </div>
    </div>
  );
}
