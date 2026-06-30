import Link from "next/link";
import Image from "next/image";
import { TESTIMONIALS } from "./constants";

export default function SuccessStoriesSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#FFF8F4]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: "#6B1B3D", filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: "#D4AF37", filter: "blur(90px)" }} />

      <div className="container-safe relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-sm font-semibold mb-4 tracking-wide uppercase transition-all duration-300 hover:bg-[#6B1B3D] hover:text-[#D4AF37] hover:shadow-lg cursor-default">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Real People, Real Connections
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto text-base leading-relaxed">
            Thousands of couples found their perfect match through VivaahAI. Here are some of their beautiful stories.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(107,27,61,0.75) 100%)" }}
                />
                {/* Heart badge */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 fill-[#6B1B3D]" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                {/* Name overlay */}
                <div className="absolute bottom-4 left-5">
                  <p className="text-white font-bold text-lg leading-tight drop-shadow">{t.name}</p>
                  <p className="text-white/75 text-xs mt-0.5">{t.date}</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pt-5 pb-6 relative">
                {/* Decorative large quote */}
                <span className="pointer-events-none select-none absolute -top-4 right-5 text-8xl font-serif text-[#D4AF37] opacity-20 leading-none">&ldquo;</span>
                <p className="text-neutral-600 text-sm leading-relaxed italic relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-[#6B1B3D] font-semibold bg-[#6B1B3D]/10 px-3 py-1 rounded-full">
                    Verified Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#6B1B3D] text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm"
          >
            Read More Stories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
