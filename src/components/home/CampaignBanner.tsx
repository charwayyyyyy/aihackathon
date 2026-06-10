'use client';

import { useQuery } from '@tanstack/react-query';
import { campaignService } from '@/services/campaignService';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CampaignBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: campaignService.getActiveCampaigns,
  });

  // Filter for top banner campaign
  const bannerCampaign = campaigns?.find(c => c.type === 'banner');
  // Filter for hero campaign
  const heroCampaign = campaigns?.find(c => c.type === 'hero');

  if (isLoading || !campaigns?.length) return null;

  return (
    <>
      <AnimatePresence>
        {bannerCampaign && isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-luxury text-white relative z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
              <div className="flex-1 flex justify-center items-center text-xs md:text-sm font-medium">
                <span className="mr-2">✨</span>
                {bannerCampaign.title}
                {bannerCampaign.discountPercentage && (
                  <span className="ml-2 font-bold text-[#FFD700]">
                    Save {bannerCampaign.discountPercentage}%
                  </span>
                )}
                <Link href={`/collections`} className="ml-4 underline underline-offset-2 hover:text-[#FFD700] transition-colors inline-flex items-center">
                  Shop Now <ChevronRight size={14} className="ml-0.5" />
                </Link>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Dismiss banner"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional Hero Campaign block - could be rendered somewhere else or below the navbar */}
      {heroCampaign && (
        <section className="relative w-full h-[60vh] min-h-[400px] bg-neutral-100 overflow-hidden">
          {heroCampaign.imageData && (
            <img 
              src={heroCampaign.imageData} 
              alt={heroCampaign.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-3xl text-white">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif font-bold mb-4"
              >
                {heroCampaign.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl mb-8 opacity-90"
              >
                {heroCampaign.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  href="/collections" 
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-100 transition-colors uppercase tracking-wide text-sm"
                >
                  Explore Campaign <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
