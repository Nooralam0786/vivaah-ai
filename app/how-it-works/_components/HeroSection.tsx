import Image from "next/image";
import HeroCopy from "./HeroCopy";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
      {/* Mobile: image on top, copy stacked below in normal flow */}
      <div className="sm:hidden">
        <div className="relative w-full aspect-[1213/791]">
          <Image
            src="/Images/how-it-works-hero.png"
            alt="Couple who found each other through VivaahAI"
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
        <div className="container-safe py-8">
          <HeroCopy />
        </div>
      </div>

      {/* sm and up: image fills the right side, copy overlays on the left */}
      <div className="hidden sm:block relative">
        {/* Image box: width-driven aspect-ratio matching the pre-cropped hero photo, so the couple + heart always show fully framed with zero leftover gap */}
        <div className="ml-auto w-3/5 md:w-1/2 lg:w-[55%]">
          <div className="relative w-full aspect-[1213/791]">
            <Image
              src="/Images/how-it-works-hero.png"
              alt="Couple who found each other through VivaahAI"
              fill
              priority
              className="object-contain object-right"
              sizes="55vw"
            />
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 30%, transparent 50%)" }}
        />

        <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}
