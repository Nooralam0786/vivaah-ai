'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Phone, Mail, ChevronRight, Shield, Heart, Star, Users } from 'lucide-react';

const STEPS = ['Account', 'Verify', 'Password', 'Profile', 'Photos'];

const TRUST_BADGES = [
  { icon: Shield, text: 'Verified Profiles', sub: '100% authentic' },
  { icon: Heart, text: 'AI Matching', sub: 'Smart compatibility' },
  { icon: Users, text: '5 Lakh+ Members', sub: 'And growing' },
  { icon: Star, text: '4.8 / 5 Rating', sub: 'Trusted platform' },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
type Gender = (typeof GENDER_OPTIONS)[number];

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const [refCode, setRefCode] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', gender: '' as Gender | '' });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setRefCode(ref);
  }, [searchParams]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Enter your full name (min 2 characters)';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.gender) e.gender = 'Please select your gender';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName.trim(), phone: form.phone, email: form.email || undefined, gender: form.gender, referralCode: refCode || undefined }),
      });
      const json = await res.json();
      if (!json.success) { setErrors({ form: json.error?.message || 'Something went wrong' }); return; }
      // Store userId + phone (+ dev OTP) in sessionStorage for the next steps
      sessionStorage.setItem('vivaah_onb', JSON.stringify({
        userId: json.data.userId,
        phone: json.data.phone,
        ...(json.data.devOtp ? { devOtp: json.data.devOtp } : {}),
      }));
      router.push('/verify-otp');
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex flex-col items-center ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 0 ? 'bg-[#7A0026] border-[#7A0026] text-white' : 'border-neutral-300 text-neutral-400 bg-white'}`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${i === 0 ? 'text-[#7A0026]' : 'text-neutral-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-10 sm:w-16 h-0.5 mb-4 mx-1 ${i === 0 ? 'bg-[#7A0026]/30' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 overflow-hidden flex flex-col lg:flex-row">

          {/* ─── LEFT: branding panel ─── */}
          <div className="lg:w-5/12 bg-primary-gradient p-8 lg:p-10 flex flex-col text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5" />

            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-8 hover:opacity-90 transition-opacity">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#D4A017] fill-[#D4A017]" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">VivaahAI</span>
              </Link>

              <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight mb-3">
                Find Your Perfect<br />Life Partner
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-8">
                India's most trusted AI-powered matrimonial platform. Join lakhs of verified profiles and find meaningful connections.
              </p>

              <div className="space-y-4">
                {TRUST_BADGES.map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{text}</p>
                      <p className="text-white/60 text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-xs text-white/80 italic leading-relaxed">
                  "VivaahAI understood exactly what I was looking for. Found my husband within 3 months!"
                </p>
                <p className="text-white/60 text-xs mt-2 font-medium">— Priya M., Mumbai</p>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: form ─── */}
          <div className="lg:w-7/12 p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-1">Create Your Account</h2>
              <p className="text-sm text-neutral-500 mb-7">
                Already have an account?{' '}
                <Link href="/login" className="text-[#7A0026] font-semibold hover:underline">Log in</Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => set('fullName')(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:bg-white'}`}
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-neutral-500">+91</span>
                      <div className="w-px h-4 bg-neutral-300" />
                    </div>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-14 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.phone ? 'border-red-400 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:bg-white'}`}
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email')(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.email ? 'border-red-400 bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:bg-white'}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">I am a <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g} type="button"
                        onClick={() => set('gender')(g)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.gender === g ? 'bg-[#7A0026] border-[#7A0026] text-white' : 'border-neutral-200 text-neutral-600 hover:border-[#7A0026]/40 bg-white'}`}
                      >
                        {g === 'Male' ? '👨 ' : g === 'Female' ? '👩 ' : '🧑 '}{g}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                </div>

                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{errors.form}</div>
                )}

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
                  {loading ? 'Creating account…' : 'Continue — Verify Mobile'}
                  {!loading && <ChevronRight className="w-4 h-4" />}
                </button>
              </form>

              <p className="text-xs text-neutral-400 text-center mt-5 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-[#7A0026] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#7A0026] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
