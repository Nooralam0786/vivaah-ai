import type { ReactNode } from "react";
import type { StepDetail } from "./constants";

function CheckBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-1.5 text-[10.5px] sm:text-[11px] text-neutral-600 leading-snug">
      <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#6B1B3D]" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 00-1.408-1.42l-6.364 6.3-2.228-2.207a1 1 0 00-1.408 1.42l2.932 2.903a1 1 0 001.408 0l7.068-7.004z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

export default function StepDetailCard({ step }: { step: StepDetail }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-[0_12px_32px_rgba(107,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 p-3.5 sm:p-4 flex flex-col">
      <h3 className="text-center text-[11px] sm:text-xs font-bold text-[#6B1B3D] mb-3 leading-snug">
        {step.number}. {step.title}
      </h3>
      <div className="mb-3 flex items-center justify-center">{step.visual}</div>
      <ul className="space-y-1.5 mb-4 flex-1">
        {step.bullets.map((b) => (
          <CheckBullet key={b}>{b}</CheckBullet>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1 self-center px-2.5 py-1 rounded-full bg-[#FFF3F0] text-[9px] sm:text-[10px] font-semibold text-[#6B1B3D] whitespace-nowrap">
        <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {step.badge}
      </span>
    </div>
  );
}
