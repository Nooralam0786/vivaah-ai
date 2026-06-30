import PersonIcon from "./PersonIcon";

export default function RelationshipVisual() {
  return (
    <div className="h-24 w-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#FFE5E0] border-2 border-white shadow flex items-center justify-center -mr-3">
        <PersonIcon className="w-6 h-6 text-[#6B1B3D]" />
      </div>
      <div className="relative z-10 w-7 h-7 rounded-full bg-[#6B1B3D] text-white flex items-center justify-center shadow-md">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div className="w-12 h-12 rounded-full bg-[#FFF3F0] border-2 border-white shadow flex items-center justify-center -ml-3">
        <PersonIcon className="w-6 h-6 text-[#D4AF37]" />
      </div>
    </div>
  );
}
