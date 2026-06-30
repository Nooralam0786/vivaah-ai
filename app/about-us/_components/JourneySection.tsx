import { MILESTONES } from "./constants";

export default function JourneySection() {
  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container-safe">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-10">
          Our Journey
          <span className="block w-10 h-0.5 bg-[#D4AF37] mt-2" />
        </h2>

        <div className="relative grid grid-cols-3 sm:grid-cols-5 gap-y-8">
          <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] border-t-2 border-dashed border-[#D4AF37]/50" />
          {MILESTONES.map((m) => (
            <div
              key={m.label}
              className="group relative z-10 flex flex-col items-center text-center px-1 cursor-default transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFF3F0] text-[#6B1B3D] flex items-center justify-center mb-3 shadow-md transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(212,175,55,0.45)]">
                {m.icon}
              </div>
              <div className="text-base font-bold text-[#6B1B3D] transition-colors duration-300">{m.value}</div>
              <div className="text-xs text-neutral-500 mt-0.5 max-w-[110px] transition-colors duration-300 group-hover:text-neutral-700">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
