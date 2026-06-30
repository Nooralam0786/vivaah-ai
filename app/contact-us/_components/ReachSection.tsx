import Link from "next/link";
import { SectionHeading } from "./shared";
import { REACH_OPTIONS, type ReachOption } from "./constants";

function ReachCard({ option }: { option: ReachOption }) {
  return (
    <div className="group flex flex-col items-center text-center px-2 py-4 cursor-default transition-transform duration-300 hover:-translate-y-1.5">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF3F0] text-[#6B1B3D] flex items-center justify-center mb-4 shadow-sm transition-all duration-300 group-hover:bg-[#6B1B3D] group-hover:text-white group-hover:scale-110">
        {option.icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1.5">{option.title}</h3>
      <p className="text-xs text-neutral-500 leading-relaxed mb-4 max-w-[160px]">{option.description}</p>
      {option.variant === "button" ? (
        <Link
          href={option.actionHref}
          className="text-xs font-semibold border border-neutral-200 text-neutral-700 hover:border-[#6B1B3D] hover:text-[#6B1B3D] px-4 py-2 rounded-lg transition-colors"
        >
          {option.actionLabel}
        </Link>
      ) : (
        <Link href={option.actionHref} className="text-xs font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors">
          {option.actionLabel}
        </Link>
      )}
    </div>
  );
}

export default function ReachSection() {
  return (
    <section className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-14 md:-mt-16 pb-14 sm:pb-16">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 sm:p-8">
        <SectionHeading title="Ways to Reach Us" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          {REACH_OPTIONS.map((o) => (
            <ReachCard key={o.title} option={o} />
          ))}
        </div>
      </div>
    </section>
  );
}
