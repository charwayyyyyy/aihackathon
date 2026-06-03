'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';
import { useState, useEffect } from 'react';

export default function Logo() {
  const [imgError, setImgError] = useState(false);

  const { data: merchant } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  useEffect(() => {
    setImgError(false);
  }, [merchant?.logo_url]);

  return (
    <Link href="/" className="group flex flex-col items-center" aria-label="Mensah — Home">
      {merchant?.logo_url && !imgError ? (
        <div className="relative w-32 h-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={merchant.logo_url}
            alt={merchant?.name || 'Mensah'}
            className="object-contain w-full h-full"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <>
          <span className="text-2xl font-serif tracking-[-0.05em] font-bold leading-none">
            {merchant?.name || 'MENSAH'}
          </span>
          <span className="text-[6px] uppercase tracking-[0.5em] text-black/40 group-hover:text-luxury transition-colors duration-300">
            Savile Row Quality
          </span>
        </>
      )}
    </Link>
  );
}
