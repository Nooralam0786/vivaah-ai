import { SectionHeading } from "./shared";
import { CORE_VALUES, type CoreValue } from "./constants";

function CoreValueItem({ value }: { value: CoreValue }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 text-center border border-neutral-200 cursor-default transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-12 h-12 mx-auto rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center mb-3 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {value.icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {value.title}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed">{value.description}</p>
    </div>
  );
}

export default function CoreValuesSection() {
  return (
    <section className="py-14 sm:py-16 bg-[#FFF8F4]">
      <div className="container-safe">
        <SectionHeading title="Our Core Values" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CORE_VALUES.map((v) => (
            <CoreValueItem key={v.title} value={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
