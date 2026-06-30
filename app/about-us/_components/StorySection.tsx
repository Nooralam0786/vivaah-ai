import Image from "next/image";
import { STORY_HIGHLIGHTS } from "./constants";

export default function StorySection() {
  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container-safe grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 items-center">
        <div className="relative pb-8 pl-4">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md group">
            <Image
              src="/Images/wedding.png"
              alt="Family celebrating together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-1 -left-1 sm:left-2 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900">Safe &amp; Secure</div>
              <div className="text-xs text-neutral-500">100% Verified Profiles</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#6B1B3D" }}>
            Our Story
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4">
            VivaahAI was founded with a simple yet powerful idea — that finding the right life partner should be a
            joyful, trustworthy, and seamless experience.
          </p>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
            We noticed that traditional matchmaking lacked transparency and efficiency, while modern dating
            platforms often missed the essence of cultural values. VivaahAI bridges this gap by combining advanced
            AI technology with family involvement and trust.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {STORY_HIGHLIGHTS.map((h) => (
              <div key={h.title} className="group cursor-default transition-transform duration-300 hover:-translate-y-1.5">
                <div className="w-10 h-10 rounded-full bg-[#FFF3F0] text-[#D4AF37] flex items-center justify-center mb-2 shadow-sm transition-all duration-300 group-hover:bg-[#6B1B3D] group-hover:text-white group-hover:scale-110">
                  {h.icon}
                </div>
                <h4 className="text-sm font-bold text-[#6B1B3D] mb-1">{h.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
