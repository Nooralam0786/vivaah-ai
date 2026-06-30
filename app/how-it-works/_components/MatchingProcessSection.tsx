import ProcessArrow from "./ProcessArrow";
import { PROCESS_NODES } from "./constants";

export default function MatchingProcessSection() {
  return (
    <section className="pb-20 bg-white">
      <div className="container-safe">
        <div className="bg-[#FFF8F4] border border-neutral-100 rounded-3xl px-8 py-10 md:px-12">
          <h2 className="text-center text-xl md:text-2xl font-bold text-neutral-900 mb-10">
            Our Matching Process
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-2">
            {PROCESS_NODES.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2 sm:gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#D4AF37] text-[#6B1B3D] flex items-center justify-center shadow-sm mb-3">
                    {node.icon}
                  </div>
                  <span className="text-sm font-semibold text-neutral-800 whitespace-nowrap">{node.label}</span>
                </div>
                {i < PROCESS_NODES.length - 1 && <ProcessArrow />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
