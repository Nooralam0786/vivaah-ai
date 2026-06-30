import PersonIcon from "./PersonIcon";

// Pre-computed to 2 decimal places — prevents SSR/client float precision mismatch
const SPOKE_POINTS = [0, 60, 120, 180, 240, 300].map((a) => {
  const rad = (a * Math.PI) / 180;
  return { a, x: parseFloat((40 * Math.cos(rad)).toFixed(2)), y: parseFloat((34 * Math.sin(rad)).toFixed(2)) };
});

export default function MatchmakingVisual() {
  return (
    <div className="relative h-24 w-full flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="-56 -48 112 96">
        {SPOKE_POINTS.map(({ a, x, y }) => (
          <line key={a} x1="0" y1="0" x2={x} y2={y} stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
        ))}
      </svg>
      {SPOKE_POINTS.map(({ a, x, y }) => (
        <div
          key={a}
          className="absolute w-5 h-5 rounded-full bg-[#FFE5E0] border border-[#D4AF37]/50 flex items-center justify-center"
          style={{ transform: `translate(${x}px, ${y}px)` }}
        >
          <PersonIcon className="w-2.5 h-2.5 text-[#6B1B3D]" />
        </div>
      ))}
      <div className="relative z-10 w-9 h-9 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center text-[10px] font-extrabold shadow-md">
        AI
      </div>
    </div>
  );
}
