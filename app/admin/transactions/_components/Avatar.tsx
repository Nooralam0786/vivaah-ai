'use client';

import { useState } from 'react';

export default function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return photo && !err
    ? <img src={photo} alt={name} onError={() => setErr(true)} className="w-8 h-8 rounded-full object-cover" />
    : (
      <div className="w-8 h-8 rounded-full bg-[#6B1B3D]/10 flex items-center justify-center text-[#6B1B3D] text-xs font-semibold">
        {initials}
      </div>
    );
}
