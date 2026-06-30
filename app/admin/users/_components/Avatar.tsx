'use client';

import { useState } from 'react';

export default function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  if (photo && !err) return <img src={photo} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-xs font-bold">
      {name[0]?.toUpperCase()}
    </div>
  );
}
