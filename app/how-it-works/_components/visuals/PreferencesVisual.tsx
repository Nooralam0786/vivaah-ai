export default function PreferencesVisual() {
  const rows = [
    { label: "Age", value: "24 - 30" },
    { label: "Height", value: "5'4\" - 5'10\"" },
    { label: "Religion", value: "Any" },
    { label: "Lifestyle", value: "Moderate" },
    { label: "Values", value: "Traditional" },
  ];
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-left shadow-sm space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-2">
          <span className="text-[8.5px] text-neutral-400 whitespace-nowrap">{r.label}</span>
          <span className="text-[8.5px] font-semibold text-[#6B1B3D] bg-[#FFF3F0] px-1.5 py-0.5 rounded whitespace-nowrap">
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
