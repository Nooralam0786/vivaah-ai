import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./shared";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
      <div className="relative w-full aspect-[1932/814]">
        <Image
          src="/Images/about-us.png"
          alt="Couple matched through VivaahAI"
          fill
          priority
          className="object-contain"
          sizes="100vw"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0.25) 50%, transparent 65%)",
          }}
        />

        <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
          <div className="max-w-full sm:max-w-md md:max-w-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: "#5a1030" }}>
              About VivaahAI
            </h1>
            <p className="text-[#6B1B3D] font-semibold text-base sm:text-lg mb-4">Where Technology Meets Tradition</p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
              We combine artificial intelligence with family values to help people discover meaningful and lifelong
              relationships.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Link
                href="/success-stories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm whitespace-nowrap"
              >
                Our Success Stories
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#D4AF37] text-[#6B1B3D] hover:bg-[#D4AF37]/10 font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
