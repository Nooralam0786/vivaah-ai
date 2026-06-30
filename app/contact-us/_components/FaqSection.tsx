import { SectionHeading } from "./shared";
import { FAQS_LEFT, FAQS_RIGHT, type Faq } from "./constants";

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        open ? "border-[#6B1B3D]/40 bg-[#FFF8F4]" : "border-neutral-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left"
      >
        <span className={`text-sm font-semibold ${open ? "text-[#6B1B3D]" : "text-neutral-800"}`}>{faq.question}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-neutral-500 transition-transform duration-300 ${open ? "rotate-180 text-[#6B1B3D]" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-4 sm:px-5 pb-4 text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

interface FaqSectionProps {
  openFaq: string | null;
  onToggle: (question: string) => void;
}

export default function FaqSection({ openFaq, onToggle }: FaqSectionProps) {
  return (
    <section className="pb-14 sm:pb-16">
      <div className="container-safe">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {FAQS_LEFT.map((f) => (
              <FaqItem key={f.question} faq={f} open={openFaq === f.question} onToggle={() => onToggle(f.question)} />
            ))}
          </div>
          <div className="space-y-3">
            {FAQS_RIGHT.map((f) => (
              <FaqItem key={f.question} faq={f} open={openFaq === f.question} onToggle={() => onToggle(f.question)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
