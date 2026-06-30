import { TRUST_BADGES, type TrustBadge } from "./constants";

function FeatureCard({ badge }: { badge: TrustBadge }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-8 text-center border border-neutral-200 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-16 h-16 mx-auto rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mb-5 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {badge.icon}
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-3 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {badge.text}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{badge.description}</p>
    </div>
  );
}

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-[#FFF8F4]">
      <div className="container-safe">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-sm font-medium mb-4 transition-all duration-300 hover:bg-[#6B1B3D] hover:text-[#D4AF37] hover:shadow-lg">
            Why Choose VivaahAI
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Trusted by Families Across India
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Experience the future of matchmaking with AI-powered compatibility, verified profiles, and complete privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge) => (
            <FeatureCard key={badge.text} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
