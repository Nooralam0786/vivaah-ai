import Link from "next/link";
import { HeartIcon } from "./shared";

export default function StillNeedHelpSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-2xl px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <HeartIcon className="w-6 h-6 text-[#D4AF37]" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Still need help?</h2>
              <p className="text-sm text-white/70 mt-0.5">Our support team is available 24/7 to assist you on your journey.</p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg text-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Live Chat
            </Link>
            <span className="text-xs text-white/60">Available: 9 AM – 9 PM (IST)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
