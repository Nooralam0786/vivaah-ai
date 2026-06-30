import SmartSignupLink from "@/components/site/SmartSignupLink";

export default function CtaBannerSection() {
  return (
    <section className="pb-20 bg-white">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-3xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to start your journey?
            </h2>
            <p className="text-white/80 text-base md:text-lg">Join thousands of successful stories.</p>
          </div>
          <SmartSignupLink className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] font-bold rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap">
            Create Your Profile
          </SmartSignupLink>
        </div>
      </div>
    </section>
  );
}
