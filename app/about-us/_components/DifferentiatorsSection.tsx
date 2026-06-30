import { SectionHeading } from "./shared";
import { DIFFERENTIATORS, type Differentiator } from "./constants";

function DifferentiatorCard({ item }: { item: Differentiator }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-7 text-center border border-neutral-200 cursor-default transition-all duration-500 hover:-translate-y-2 hover:border-[#6B1B3D] hover:shadow-[0_12px_40px_rgba(107,27,61,0.18)]">
      <div className="absolute top-0 left-0 h-1 w-0 bg-[#6B1B3D] transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />

      <div className="w-14 h-14 mx-auto rounded-full bg-[#6B1B3D] text-white flex items-center justify-center mb-4 shadow-md transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#6B1B3D] group-hover:scale-110">
        {item.icon}
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-2 transition-colors duration-300 group-hover:text-[#6B1B3D]">
        {item.title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
    </div>
  );
}

export default function DifferentiatorsSection() {
  return (
    <section className="py-14 sm:py-16 bg-[#FFF8F4]">
      <div className="container-safe">
        <SectionHeading eyebrow="Our Difference" title="What Makes Us Different" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map((d) => (
            <DifferentiatorCard key={d.title} item={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
