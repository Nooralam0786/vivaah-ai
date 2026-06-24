import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M11 15.5c0-1.933 1.567-3.5 3.5-3.5 1.08 0 2.046.491 2.7 1.263L18 14.4l.8-.637A3.496 3.496 0 0125 15.5c0 3.5-3.667 6.167-7 8.5-3.333-2.333-7-5-7-8.5z"
          fill="#D4AF37"
          opacity="0.85"
        />
        <path
          d="M14.5 20c0-1.381 1.119-2.5 2.5-2.5.773 0 1.462.351 1.929.903L20 18.857l.571-.454A2.497 2.497 0 0125 20c0 2.5-2.619 4.405-5 6-2.381-1.667-5-3.5-5-6z"
          fill="#6B1B3D"
          opacity="0.7"
        />
      </svg>
      <span className="text-xl font-bold text-[#6B1B3D]">VivaahAI</span>
    </Link>
  );
}
