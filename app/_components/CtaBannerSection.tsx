import SmartSignupLink from "@/components/site/SmartSignupLink";

export default function CtaBannerSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-3xl px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Ready to find your perfect match?
            </h2>
            <p className="text-white/80 text-sm sm:text-lg">Join thousands of successful stories</p>
          </div>
          <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg">
            Get Started Now
          </SmartSignupLink>
        </div>
      </div>
    </section>
  );
}
