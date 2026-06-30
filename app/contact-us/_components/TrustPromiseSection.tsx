import { TRUST_STATS, RESPONSE_PROMISES } from "./constants";

export default function TrustPromiseSection() {
  return (
    <section className="pb-14 sm:pb-16">
      <div className="container-safe grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">Your Trust is Our Priority</h2>
              <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                We are committed to providing a safe, secure, and respectful experience for everyone.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-neutral-100">
            {TRUST_STATS.map((s) => (
              <div key={s.title}>
                <div className="w-7 h-7 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center mb-2">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-neutral-900">{s.title}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{s.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#FFF3F0] rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-7">
          <svg className="pointer-events-none absolute -bottom-4 -right-2 w-28 h-28 text-[#D4AF37]/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 relative z-10">Our Response Promise</h2>
          <ul className="relative z-10 space-y-3">
            {RESPONSE_PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-neutral-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.364 6.3-2.228-2.207a1 1 0 00-1.408 1.42l2.932 2.903a1 1 0 001.408 0l7.068-7.004z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
