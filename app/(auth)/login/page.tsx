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

const ShieldCheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
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
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2l1.6 4.8L18 8.4l-4.4 1.6L12 15l-1.6-4.8L6 8.4l4.4-1.6L12 2z" />
    <path d="M19 14l.8 2.4L22 17l-2.2.8L19 20l-.8-2.4L16 17l2.2-.8L19 14z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FamilyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const UserStatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartStatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
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

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#7A0026]">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" />
  </svg>
);

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M15 18l-6-6 6-6" /></svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 18l6-6-6-6" /></svg>
);

/* ─── Data ──────────────────────────────────────────────── */
const features = [
  { icon: <SparkleIcon />, title: 'AI-Powered Matching', desc: 'Smart algorithms find the right match for you.' },
  { icon: <ShieldIcon />, title: 'Privacy & Safety First', desc: '100% verified profiles and secure platform.' },
  { icon: <FamilyIcon />, title: 'Family Involved', desc: 'Because the best journeys include your loved ones.' },
];

const stats = [
  { icon: <UserStatIcon />, value: '500K+', label: 'Registered Users' },
  { icon: <HeartStatIcon />, value: '50K+', label: 'Happy Matches' },
  { icon: <ShieldCheckIcon className="w-6 h-6" />, value: '100%', label: 'Verified Profiles' },
  { icon: <StarIcon />, value: '4.8/5', label: 'User Rating' },
];

const testimonials = [
  {
    quote: 'VivaahAI helped us find each other when we least expected. The AI matches were surprisingly accurate and our families loved the transparency.',
    names: 'Priya & Arjun',
    date: 'Married in Feb 2024',
    photo: '/Images/sucess story.png',
  },
  {
    quote: 'We connected over shared values and the platform made it easy for both our families to be involved from day one. Truly grateful!',
    names: 'Sneha & Rohan',
    date: 'Married in Nov 2023',
    photo: '/Images/sucess story2.png',
  },
  {
    quote: 'The verification gave us complete peace of mind. Within weeks we found a genuine connection that turned into a lifelong bond.',
    names: 'Ananya & Vikram',
    date: 'Married in Mar 2024',
    photo: '/Images/sucess story 3.png',
  },
];

/* ─── Main Component ─────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'secure'>('login');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const t = testimonials[testimonialIdx];

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF7F8]">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="relative lg:w-1/2 min-h-[340px] lg:h-screen overflow-hidden">
        {/* Background image */}
        <Image src="/Images/sign.png" alt="Happy couple" fill priority className="object-cover object-center" />
        {/* Light wash overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F8]/85 via-[#FAF7F8]/55 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-5 lg:p-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 text-[#7A0026]">
            <HeartLogoIcon />
            <div className="leading-tight">
              <p className="text-lg font-extrabold">VivaahAI</p>
              <p className="text-[11px] font-medium text-neutral-600">Meaningful Matches, Lasting Connections</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-4 max-w-md">
            <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#7A0026] leading-tight">
              Where Technology Understands Hearts.
            </h1>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-sm">
              VivaahAI combines advanced AI technology with Indian values to help you find your life partner.
            </p>

            {/* Features */}
            <div className="mt-3 space-y-2.5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A0026] flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 leading-tight">{f.title}</p>
                    <p className="text-xs text-neutral-600 leading-snug max-w-[240px]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom cards */}
          <div className="mt-auto pt-4 space-y-2.5">
            {/* Stats bar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="text-[#7A0026]/80">{s.icon}</span>
                  <div className="leading-tight">
                    <p className="text-base font-extrabold text-neutral-900">{s.value}</p>
                    <p className="text-[11px] text-neutral-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
              <button onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="text-[#7A0026] hover:bg-[#7A0026]/10 rounded-full p-1 transition-colors flex-shrink-0">
                <ChevronLeft />
              </button>
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow">
                <Image src={t.photo} alt={t.names} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-600 italic leading-snug line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm font-semibold text-neutral-900 mt-1">– {t.names}</p>
                <p className="text-[11px] text-neutral-500">{t.date}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {testimonials.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIdx ? 'bg-[#7A0026]' : 'bg-neutral-300'}`} />
                  ))}
                </div>
              </div>
              <button onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                className="text-[#7A0026] hover:bg-[#7A0026]/10 rounded-full p-1 transition-colors flex-shrink-0">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div className="lg:w-1/2 lg:h-screen flex items-center justify-center lg:justify-start p-5 lg:py-6 lg:pl-8 lg:pr-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] p-6 lg:px-8 lg:py-6">

          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-extrabold text-[#7A0026]">Welcome Back! 👋</h2>
            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
              Login to continue your journey towards finding your perfect match.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#EDE7E9] mb-4">
            <button onClick={() => setActiveTab('login')}
              className={`flex-1 flex items-center justify-center gap-2 pb-2.5 text-sm font-semibold transition-colors relative ${activeTab === 'login' ? 'text-[#7A0026]' : 'text-neutral-400 hover:text-neutral-600'}`}>
              <UserIcon /> Login
              {activeTab === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7A0026] rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('secure')}
              className={`flex-1 flex items-center justify-center gap-2 pb-2.5 text-sm font-semibold transition-colors relative ${activeTab === 'secure' ? 'text-[#7A0026]' : 'text-neutral-400 hover:text-neutral-600'}`}>
              <ShieldCheckIcon /> Secure Login
              {activeTab === 'secure' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7A0026] rounded-full" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email / Mobile */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Email ID / Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><UserIcon /></span>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="Enter your email or mobile number"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.identifier ? 'border-red-400' : 'border-[#EDE7E9]'}`}
                />
              </div>
              {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><LockIcon /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] ${errors.password ? 'border-red-400' : 'border-[#EDE7E9]'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-[#EDE7E9] accent-[#7A0026]" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#7A0026] hover:text-[#A10035] transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#7A0026] hover:bg-[#A10035] text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
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
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-[#EDE7E9]" />
            <span className="text-xs text-neutral-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-[#EDE7E9]" />
          </div>

          {/* Social / alt logins */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-3 py-2 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <GoogleIcon /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <PhoneIcon /> Continue with Mobile Number
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2 border border-[#EDE7E9] rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
              <MailIcon /> Login with Email Link
            </button>
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-neutral-600 mt-3">
            New to VivaahAI?{' '}
            <Link href="/signup" className="font-bold text-[#7A0026] hover:text-[#A10035] transition-colors">Sign Up</Link>
          </p>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-[#EDE7E9] text-neutral-400">
            <ShieldCheckIcon className="w-4 h-4" />
            <p className="text-[11px] leading-snug text-center">
              Your data is safe and secure with us. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
