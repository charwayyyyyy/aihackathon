'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="group flex flex-col items-center">
      <span className="text-2xl font-serif tracking-[-0.05em] font-bold leading-none">
        MENSAH
      </span>
      <span className="text-[6px] uppercase tracking-[0.5em] text-black/40 group-hover:text-luxury transition-colors">
        Savile Row Quality
      </span>
    </Link>
  );
}
