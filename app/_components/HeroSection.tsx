import Image from "next/image";
import SmartSignupLink from "@/components/site/SmartSignupLink";
import { TRUST_BADGES, STATS } from "./constants";

export default function HeroSection() {
  return (
    <section className="relative overflow-visible pb-16">
      <div className="relative overflow-hidden lg:min-h-[580px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/Images/hero.png"
            alt="VivaahAI couple"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, transparent 100%)" }}
        />

        <div className="container-safe relative z-10 py-12 sm:py-20 md:py-28">
          <div className="max-w-lg">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-5" style={{ color: "#5a1030" }}>
              AI-Powered Matches,{" "}
              Meaningful Connections
            </h1>

            <p className="text-neutral-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
              VivaahAI combines advanced AI technology with Indian values to help you find your life partner.
            </p>

            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-8 gap-y-2.5 sm:gap-y-3 mb-8 sm:mb-10">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-accent-500 flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{badge.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-neutral-800 leading-tight">{badge.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <SmartSignupLink className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base">
                Find Your Match
              </SmartSignupLink>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 border-2 border-accent-500 text-accent-600 hover:bg-accent-50 font-semibold rounded-lg transition-colors text-sm sm:text-base bg-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar — overlaps the hero's bottom edge at every breakpoint */}
      <div className="relative z-20 px-3 sm:px-6 -mt-8 sm:-mt-12 md:-mt-14">
        <div className="mx-auto max-w-6xl animate-rise-in">
          <div className="bg-white rounded-2xl shadow-xl px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-9 transition-shadow duration-300 hover:shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                  className={`group flex items-center gap-2.5 sm:gap-4 cursor-default animate-fade-in-up ${i !== 0 ? "lg:border-l lg:border-neutral-200 lg:pl-8" : ""}`}
                >
                  <div className="flex-shrink-0 text-primary-700 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-10 sm:[&>svg]:h-10 lg:[&>svg]:w-12 lg:[&>svg]:h-12">
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-700 leading-tight transition-colors duration-300 group-hover:text-secondary-500">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
