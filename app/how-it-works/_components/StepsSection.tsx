import StepDetailCard from "./StepDetailCard";
import { STEP_DETAILS } from "./constants";

export default function StepsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-safe">
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className="h-px w-10 bg-[#D4AF37]/50" />
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.15em] text-[#D4AF37] uppercase whitespace-nowrap">
            A Closer Look at Each Step
          </h2>
          <span className="h-px w-10 bg-[#D4AF37]/50" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {STEP_DETAILS.map((step) => (
            <StepDetailCard key={step.title} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
