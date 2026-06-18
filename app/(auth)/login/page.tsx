'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* ─── Icons ─────────────────────────────────────────────── */
const HeartLogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
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

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2l1.6 4.8L18 8.4l-4.4 1.6L12 15l-1.6-4.8L6 8.4l4.4-1.6L12 2z" />
    <path d="M19 14l.8 2.4L22 17l-2.2.8L19 20l-.8-2.4L16 17l2.2-.8L19 14z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const FamilyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const UserStatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartStatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ShieldCheckIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-neutral-700">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

/* ─── Data ──────────────────────────────────────────────── */
const features = [
  { icon: <SparkleIcon />, title: 'AI-Powered Matching', desc: 'Smart algorithms that understand you better' },
  { icon: <ShieldIcon />, title: 'Trust & Safety First', desc: 'Verified profiles and 100% secure platform' },
  { icon: <FamilyIcon />, title: 'Family Involved', desc: 'Connect with your family throughout your journey' },
];

const stats = [
  { icon: <UserStatIcon />, value: '500K+', label: 'Registered Users' },
  { icon: <HeartStatIcon />, value: '50K+', label: 'Happy Matches' },
  { icon: <ShieldCheckIcon />, value: '100%', label: 'Verified Profiles' },
  { icon: <StarIcon />, value: '4.8/5', label: 'User Rating' },
];

/* ─── Main Component ─────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.identifier) errs.identifier = 'Email or mobile is required';
    if (!form.password) errs.password = 'Password is required';
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
    <div className="min-h-screen bg-[#FAF7F8] flex items-center justify-center p-3 sm:p-4 lg:p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col lg:flex-row">

        {/* ══════════ LEFT PANEL ══════════ */}
        <div className="relative lg:w-1/2 min-h-[340px] overflow-hidden">
          {/* Background image */}
          <Image src="/Images/sign.png" alt="Happy couple" fill priority className="object-cover object-center" />
          {/* Light wash so the maroon text stays readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F8]/95 via-[#FAF7F8]/55 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-5 lg:p-6">
            {/* Logo (links to home) */}
            <Link href="/" className="flex items-center gap-2 text-[#7A0026] w-fit hover:opacity-80 transition-opacity">
              <span className="text-[#D4A017]"><HeartLogoIcon /></span>
              <span className="text-lg font-extrabold">VivaahAI</span>
            </Link>

            {/* Headline */}
            <div className="mt-4 max-w-sm">
              <h1 className="text-xl lg:text-[26px] font-extrabold text-[#7A0026] leading-tight">
                Meaningful Matches, Lasting Connections
              </h1>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed max-w-[300px]">
                VivaahAI uses advanced AI technology and traditional values to help you find your perfect life partner.
              </p>

              {/* Features */}
              <div className="mt-3 space-y-2.5">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-[#7A0026] flex-shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900 leading-tight">{f.title}</p>
                      <p className="text-xs text-neutral-600 leading-snug max-w-[230px]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-auto pt-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md px-4 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <span className="text-[#7A0026]/70">{s.icon}</span>
                    <div className="leading-tight">
                      <p className="text-base font-extrabold text-neutral-900">{s.value}</p>
                      <p className="text-[10px] text-neutral-500">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT PANEL ══════════ */}
        <div className="lg:w-1/2 flex items-center justify-center p-5 lg:p-7 bg-white">
          <div className="w-full max-w-sm">

            {/* Form box */}
            <div className="border border-[#EDE7E9] rounded-2xl p-5">
              {/* Heading */}
              <div className="text-center mb-3">
                <h2 className="text-xl font-extrabold text-[#7A0026]">Welcome Back 👋</h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Login to continue your journey towards finding your perfect match.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Email / Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-1">Email ID / Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><UserIcon /></span>
                    <input
                      type="text"
                      value={form.identifier}
                      onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                      placeholder="Enter your email or mobile number"
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.identifier ? 'border-red-400' : 'border-[#EDE7E9]'}`}
                    />
                  </div>
                  {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><LockIcon /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-11 py-2 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.password ? 'border-red-400' : 'border-[#EDE7E9]'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#7A0026] hover:text-[#A10035] transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login button */}
                <button type="submit" disabled={loading}
                  className="w-full py-2 bg-[#7A0026] hover:bg-[#A10035] text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Logging in...
                    </>
                  ) : 'Login'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2.5">
                <div className="flex-1 h-px bg-[#EDE7E9]" />
                <span className="text-xs text-neutral-400 font-semibold">OR</span>
                <div className="flex-1 h-px bg-[#EDE7E9]" />
              </div>

              {/* Social logins */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-3 py-2 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                  <GoogleIcon /> Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-2 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                  <PhoneIcon /> Continue with Mobile Number
                </button>
              </div>

              {/* Sign up */}
              <p className="text-center text-sm text-neutral-600 mt-3">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-bold text-[#7A0026] hover:text-[#A10035] transition-colors">Sign Up</Link>
              </p>

              {/* Back to Home */}
              <div className="text-center mt-2">
                <Link href="/" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#7A0026] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Privacy note box */}
            <div className="mt-3 bg-[#FAF7F8] border border-[#EDE7E9] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-neutral-400">
              <ShieldCheckIcon className="w-4 h-4" />
              <p className="text-[11px] leading-snug text-center">
                Your data is safe and secure with us. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
