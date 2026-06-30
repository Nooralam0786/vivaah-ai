import Link from "next/link";
import SmartSignupLink from "@/components/site/SmartSignupLink";

export default function CtaBannerSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to Begin Your Journey?</h2>
            <p className="text-white/80 text-lg">Join thousands of successful stories and find your perfect match today.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap">
              Create Profile
            </SmartSignupLink>
            <Link
              href="/discover"
              className="px-8 py-4 border-2 border-white/40 text-white hover:bg-white/10 font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Explore Matches
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
