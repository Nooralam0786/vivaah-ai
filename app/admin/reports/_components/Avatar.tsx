'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return photo && !err
    ? (
      <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
        <Image src={photo} alt={name} onError={() => setErr(true)} fill sizes="36px" className="object-cover" />
      </div>
    )
    : (
      <div className="w-9 h-9 rounded-full bg-[#6B1B3D]/10 flex items-center justify-center text-[#6B1B3D] text-xs font-semibold flex-shrink-0">
        {initials}
      </div>
    );
}
