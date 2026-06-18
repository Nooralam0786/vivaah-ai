'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* ─── Icons ─────────────────────────────────────────────── */
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <circle cx="10" cy="14" r="5" /><path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
  </svg>
);

const FemaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <circle cx="12" cy="8" r="5" /><path d="M12 13v8M9 18h6" />
  </svg>
);

const CheckCircleIcon = ({ valid }: { valid: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className={`w-4 h-4 flex-shrink-0 ${valid ? 'text-green-500' : 'text-neutral-300'}`}>
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-neutral-400">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const HeartAccentIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const HeartFeatureIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

/* ─── Feature cards (right overlay) ──────────────────────── */
const features = [
  { icon: <ShieldIcon />, iconBg: 'bg-rose-50 text-rose-500', title: 'Safe & Secure', desc: 'Your information is protected with top-level security' },
  { icon: <PeopleIcon />, iconBg: 'bg-rose-50 text-rose-500', title: 'Genuine Connections', desc: 'Connect with verified and serious individuals' },
  { icon: <HeartFeatureIcon />, iconBg: 'bg-rose-50 text-rose-500', title: 'Meaningful Matches', desc: 'AI-powered matches based on your preferences' },
];

/* ─── Password rules ─────────────────────────────────────── */
const passwordRules = (pw: string) => [
  { label: 'At least 8 characters', valid: pw.length >= 8 },
  { label: 'Includes special character', valid: /[^A-Za-z0-9]/.test(pw) },
  { label: 'Includes number', valid: /\d/.test(pw) },
];

/* ─── Main Component ─────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ gender: 'Male', fullName: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = passwordRules(form.password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.password) errs.password = 'Password is required';
    else if (!rules.every((r) => r.valid)) errs.password = 'Password does not meet requirements';
    if (!agreedToTerms) errs.terms = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FCEEF1] flex items-center justify-center p-2 lg:p-3">
      <div className="w-full max-w-4xl bg-white rounded-[1.25rem] shadow-[0_10px_60px_rgba(122,0,38,0.12)] overflow-hidden flex flex-col lg:flex-row">

        {/* ══════════ LEFT: FORM ══════════ */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col justify-center">
          {/* Heading */}
          <div className="mb-2.5">
            <h1 className="text-lg lg:text-[22px] font-extrabold text-[#7A0026] inline-flex items-start gap-1">
              Create Your Account
              <span className="text-rose-400 mt-0.5"><HeartAccentIcon /></span>
            </h1>
            <p className="text-neutral-500 text-[11px] mt-0.5">Let&apos;s get started on your journey to meaningful connections.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-0.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Male', 'Female'] as const).map((g) => {
                  const active = form.gender === g;
                  return (
                    <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                      className={`flex items-center justify-center gap-2 py-1.5 rounded-xl border text-sm font-medium transition-all ${active
                        ? 'border-[#7A0026] bg-[#7A0026]/5 text-[#7A0026]'
                        : 'border-[#EDE7E9] text-neutral-600 hover:border-neutral-300'}`}>
                      {g === 'Male' ? <MaleIcon /> : <FemaleIcon />} {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-0.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><UserIcon /></span>
                <input type="text" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-1.5 rounded-xl border text-sm bg-[#FAF7F8] transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.fullName ? 'border-red-400' : 'border-[#EDE7E9]'}`} />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-0.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><MailIcon /></span>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-1.5 rounded-xl border text-sm bg-[#FAF7F8] transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.email ? 'border-red-400' : 'border-[#EDE7E9]'}`} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-0.5">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 rounded-xl border border-[#EDE7E9] bg-[#FAF7F8] text-sm text-neutral-700 flex-shrink-0">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-medium">+91</span>
                  <ChevronDownIcon />
                </div>
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="Enter your phone number"
                  className={`flex-1 px-4 py-1.5 rounded-xl border text-sm bg-[#FAF7F8] transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.phone ? 'border-red-400' : 'border-[#EDE7E9]'}`} />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-0.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><LockIcon /></span>
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-11 py-1.5 rounded-xl border text-sm bg-[#FAF7F8] transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.password ? 'border-red-400' : 'border-[#EDE7E9]'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <EyeIcon show={showPassword} />
                </button>
              </div>

              {/* Password rules — 2 column grid */}
              <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                {rules.map((r) => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <CheckCircleIcon valid={r.valid} />
                    <span className={`text-xs ${r.valid ? 'text-green-600' : 'text-neutral-500'}`}>{r.label}</span>
                  </div>
                ))}
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Create Account button */}
            <button type="submit" disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-[#7A0026] to-[#A10035] hover:opacity-95 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (<>Create Account <ArrowRightIcon /></>)}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#EDE7E9]" />
            <span className="text-xs text-neutral-400">or continue with</span>
            <div className="flex-1 h-px bg-[#EDE7E9]" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-1.5 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <GoogleIcon /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-1.5 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <FacebookIcon /> Facebook
            </button>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 mt-2 cursor-pointer select-none">
            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#EDE7E9] accent-[#7A0026] flex-shrink-0" />
            <span className="text-xs text-neutral-500 leading-relaxed">
              I agree to VivaahAI&apos;s{' '}
              <Link href="/terms" className="text-[#7A0026] underline hover:text-[#A10035]">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#7A0026] underline hover:text-[#A10035]">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}

          {/* Login link */}
          <p className="text-center text-sm text-neutral-600 mt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#7A0026] hover:text-[#A10035] transition-colors">Log In</Link>
          </p>
        </div>

        {/* ══════════ RIGHT: IMAGE ══════════ */}
        <div className="hidden lg:block lg:w-1/2 p-3">
          <div className="relative h-full w-full rounded-[1.4rem] overflow-hidden">
            <Image src="/Images/sign.png" alt="Happy couple" fill priority className="object-cover object-center" />
            {/* Soft top wash for the headline */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-transparent" />

            {/* Top headline */}
            <div className="absolute top-0 left-0 right-0 p-6">
              <p className="text-lg font-semibold text-neutral-700">Find more than a match.</p>
              <p className="text-2xl font-extrabold text-neutral-800">
                Find <span className="text-[#A10035]">your person.</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-0.5 w-10 bg-[#A10035]/60 rounded-full" />
                <span className="text-[#A10035]"><HeartAccentIcon /></span>
              </div>
            </div>

            {/* Bottom feature cards */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5">
              {features.map((f) => (
                <div key={f.title} className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${f.iconBg}`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800 leading-tight">{f.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
