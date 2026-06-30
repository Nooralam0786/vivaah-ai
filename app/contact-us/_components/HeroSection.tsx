import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "./shared";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#FFF3F0] to-[#FFE5E0]">
      <div className="relative">
        <div className="ml-auto w-full sm:w-3/5 md:w-1/2 lg:w-[55%]">
          <div className="relative w-full aspect-[1622/970]">
            <Image
              src="/Images/safety.png"
              alt="Couple connecting with VivaahAI support"
              fill
              priority
              className="object-contain object-right"
              sizes="(max-width: 640px) 100vw, 55vw"
            />
            <HeartIcon className="absolute w-4 h-4 text-[#E89A8A]/70 top-[14%] left-[58%] hidden sm:block" />
            <HeartIcon className="absolute w-3 h-3 text-[#E89A8A]/60 top-[30%] left-[68%] hidden sm:block" />
          </div>
        </div>

        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 45%, rgba(255,229,224,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background: "linear-gradient(to right, #FFE5E0 0%, rgba(255,243,240,0.55) 30%, transparent 50%)",
          }}
        />

        <div className="container-safe absolute inset-0 z-10 flex flex-col justify-center">
          <div className="max-w-full sm:max-w-sm md:max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-xs font-semibold mb-4 w-fit">
              <HeartIcon className="w-3.5 h-3.5" />
              We&rsquo;re Here to Help
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: "#5a1030" }}>
              Contact Us
            </h1>
            <p className="text-neutral-700 font-semibold text-base sm:text-lg mb-3">We&rsquo;re just a message away.</p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
              Have questions or need assistance? Our support team is here to help you on your journey to find
              meaningful connections.
            </p>
            <Link
              href="#contact-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm whitespace-nowrap w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Send Us a Message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
