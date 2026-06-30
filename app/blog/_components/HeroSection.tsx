import Image from "next/image";
import { Petal } from "./shared";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
      <div className="relative min-h-[300px] sm:min-h-[340px] md:min-h-[380px]">
        <div className="absolute inset-0 sm:right-0 sm:left-auto sm:w-3/5 md:w-1/2 lg:w-[55%]">
          <Image
            src="/Images/safety.png"
            alt="Couple reading relationship advice on VivaahAI"
            fill
            priority
            className="object-cover object-[50%_30%]"
            sizes="(max-width: 640px) 100vw, 55vw"
          />
        </div>

        {/* decorative floating petals */}
        <Petal className="w-5 h-5 top-[12%] left-[58%] rotate-12 hidden sm:block" />
        <Petal className="w-4 h-4 top-[24%] left-[68%] -rotate-12 hidden sm:block" />
        <Petal className="w-3 h-3 top-[40%] left-[52%] rotate-45 hidden sm:block" />
        <Petal className="w-4 h-4 top-[18%] left-[40%] rotate-90" />

        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 40%, rgba(255,229,224,0.4) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 28%, transparent 48%)",
          }}
        />

        <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
          <div className="max-w-full sm:max-w-xs md:max-w-md">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-1.5" style={{ color: "#5a1030" }}>
              Blog &amp; Relationship Advice
            </h1>
            <p className="text-neutral-600 text-xs sm:text-sm md:text-base mb-4 max-w-xs leading-relaxed">
              Expert tips, real stories and relationship advice to help you on your journey.
            </p>

            <div className="flex items-center bg-white rounded-xl shadow-md border border-neutral-100 p-1.5 max-w-xs">
              <input
                type="text"
                placeholder="Search blogs..."
                className="flex-1 min-w-0 px-3 py-1.5 text-sm text-neutral-700 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                aria-label="Search"
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#6B1B3D] hover:bg-[#581630] text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
