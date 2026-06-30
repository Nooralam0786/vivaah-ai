import PersonIcon from "./PersonIcon";

export default function ProfileVisual() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-left shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-neutral-700">Basic Info</span>
        <div className="w-6 h-6 rounded-md bg-[#FFF3F0] flex items-center justify-center">
          <PersonIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
      </div>
      {["Education", "Profession", "Location"].map((f) => (
        <div key={f} className="flex items-center justify-between py-1 border-t border-neutral-100">
          <span className="text-[8.5px] text-neutral-400">{f}</span>
          <span className="w-9 h-1.5 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}
