'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';

export default function Logo() {
  const { data: merchant } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  return (
    <Link href="/" className="group flex flex-col items-center">
      {merchant?.logo_url ? (
        <div className="relative w-32 h-12">
          <Image 
            src={merchant.logo_url} 
            alt={merchant.name} 
            fill 
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <>
          <span className="text-2xl font-serif tracking-[-0.05em] font-bold leading-none">
            {merchant?.name || 'MENSAH'}
          </span>
          <span className="text-[6px] uppercase tracking-[0.5em] text-black/40 group-hover:text-luxury transition-colors">
            Savile Row Quality
          </span>
        </>
      )}
    </Link>
  );
}
