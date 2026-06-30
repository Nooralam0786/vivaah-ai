import PersonIcon from "./PersonIcon";

export default function MatchesVisual() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
      <div className="relative h-14 bg-gradient-to-br from-[#D4AF37]/30 to-[#6B1B3D]/20 flex items-center justify-center">
        <PersonIcon className="w-7 h-7 text-white/90" />
        <span className="absolute top-1 right-1 bg-[#6B1B3D] text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
          92% Match
        </span>
      </div>
      <div className="flex gap-1 p-1.5 bg-white">
        <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#FFF3F0] text-[#6B1B3D] whitespace-nowrap">Education</span>
        <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#FFF3F0] text-[#6B1B3D] whitespace-nowrap">Lifestyle</span>
      </div>
    </div>
  );
}
