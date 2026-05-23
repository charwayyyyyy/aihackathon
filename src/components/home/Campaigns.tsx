'use client';

import { useQuery } from '@tanstack/react-query';
import { campaignService } from '@/services/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Campaigns() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getCampaigns(),
  });

  const displayCampaigns = campaigns && campaigns.length > 0 ? campaigns : [
    {
      id: 'c1',
      title: 'The Heritage Collection',
      description: 'Rich textures and vibrant Kente accents for the modern gentleman.',
      image_url: 'https://images.unsplash.com/photo-1610444391696-29171f9f2571?q=80&w=2070&auto=format&fit=crop',
      link: '/shop?category=Heritage'
    }
  ];

  if (isLoading && !campaigns) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayCampaigns.map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group h-[500px] overflow-hidden"
            >
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] mb-4">New Campaign</span>
                <h3 className="text-3xl font-serif mb-4">{campaign.title}</h3>
                <p className="text-sm text-white/70 max-w-xs mb-8">{campaign.description}</p>
                <Link 
                  href={campaign.link || '/shop'}
                  className="px-8 py-3 border border-white text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
                >
                  View Campaign
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
