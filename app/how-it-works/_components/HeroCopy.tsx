export default function HeroCopy() {
  return (
    <div className="max-w-full sm:max-w-sm md:max-w-lg">
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] text-xs font-semibold tracking-wide mb-4 w-fit">
        <svg className="w-3.5 h-3.5 fill-[#6B1B3D]" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        SIMPLE &bull; SMART &bull; MEANINGFUL
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#5a1030" }}>
        How VivaahAI
        <br />
        Works
      </h1>

      <div className="flex items-center gap-2 my-4">
        <span className="h-px w-10 bg-[#D4AF37]/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>

      <p className="text-neutral-700 font-medium text-sm sm:text-base md:text-lg mb-2">
        Find your perfect partner in 4 simple steps
      </p>
      <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-sm">
        Our AI-powered platform makes meaningful connections effortless, secure, and personalized for you.
      </p>
    </div>
  );
}
