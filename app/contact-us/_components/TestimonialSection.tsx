import Image from "next/image";
import { ArrowIcon } from "./shared";
import { CONTACT_TESTIMONIALS } from "./constants";

interface TestimonialSectionProps {
  testimonialIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}

export default function TestimonialSection({ testimonialIndex, onPrev, onNext, onSelect }: TestimonialSectionProps) {
  const testimonial = CONTACT_TESTIMONIALS[testimonialIndex];

  return (
    <section className="pb-14 sm:pb-16">
      <div className="container-safe">
        <div className="relative mx-auto max-w-3xl bg-[#FFF8F4] rounded-2xl px-6 sm:px-14 py-8 sm:py-10 text-center">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous testimonial"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white transition-colors"
          >
            <ArrowIcon className="w-4 h-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next testimonial"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B1B3D] hover:bg-[#6B1B3D] hover:text-white transition-colors"
          >
            <ArrowIcon className="w-4 h-4" />
          </button>

          <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-white shadow-md">
            <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
          </div>
          <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed max-w-xl mx-auto mb-4">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="text-sm font-bold text-[#6B1B3D]">— {testimonial.name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{testimonial.date}</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {CONTACT_TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => onSelect(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === testimonialIndex ? "w-6 bg-[#6B1B3D]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
