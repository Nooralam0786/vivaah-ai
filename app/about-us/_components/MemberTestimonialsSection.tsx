import Image from "next/image";
import { SectionHeading } from "./shared";
import { MEMBER_TESTIMONIALS, type MemberTestimonial } from "./constants";

function StarRating({ rating, animated }: { rating: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            i < rating ? "text-[#D4AF37]" : "text-neutral-200"
          } ${animated ? "group-hover:scale-125" : ""}`}
          style={animated ? { transitionDelay: `${i * 60}ms` } : undefined}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function MemberTestimonialCard({ t }: { t: MemberTestimonial }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_16px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <svg
        className="absolute top-5 right-5 w-12 h-12 text-[#6B1B3D]/[0.06] transition-colors duration-300 group-hover:text-[#D4AF37]/20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.17 17q-1.4 0-2.285-.957Q4 15.086 4 13.65q0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2T10.5 5.5l.625 1.3q-1.45.65-2.45 1.8T7.05 11q.4-.225.825-.3T8.7 10.6q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q9.8 17 7.17 17Zm9.5 0q-1.4 0-2.285-.957-.885-.958-.885-2.393 0-1.275.5-2.5t1.375-2.325q.875-1.1 2.1-2t2.525-1.325l.625 1.3q-1.45.65-2.45 1.8T16.55 11q.4-.225.825-.3t.825-.075q1.275 0 2.137.9.863.9.863 2.2 0 1.35-.95 2.325Q19.3 17 16.67 17Z" />
      </svg>

      <div className="relative z-10 flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FFF3F0] transition-all duration-300 group-hover:ring-[#D4AF37]/50">
          <Image
            src={t.image}
            alt={t.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-[#6B1B3D]">
            {t.name}
          </h4>
          <StarRating rating={t.rating} animated />
        </div>
      </div>
      <p className="relative z-10 text-sm text-neutral-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
    </div>
  );
}

export default function MemberTestimonialsSection() {
  return (
    <section className="relative py-14 sm:py-16 bg-[#FFF8F4] overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-[0.07]"
        style={{ background: "#6B1B3D", filter: "blur(90px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-[0.07]"
        style={{ background: "#D4AF37", filter: "blur(90px)" }}
      />

      <div className="container-safe relative z-10">
        <SectionHeading eyebrow="Real Stories" title="What Our Members Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBER_TESTIMONIALS.map((t) => (
            <MemberTestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
