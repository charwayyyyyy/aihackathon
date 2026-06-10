'use client';

import { useQuery } from '@tanstack/react-query';
import { campaignService } from '@/services/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Campaigns() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getCampaigns(),
  });

  const displayCampaigns = campaigns || [];

  if (isLoading && !campaigns) {
    return (
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
            <div>
              <div className="skeleton h-3 w-20 mb-3" />
              <div className="skeleton h-8 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayCampaigns.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4"
        >
          <div>
            <span className="label text-luxury mb-3 block">Campaigns</span>
            <h2 className="text-3xl md:text-4xl font-serif">Current Season</h2>
          </div>
          <Link
            href="/campaign"
            className="label text-black/50 hover:text-luxury border-b border-black/20 hover:border-luxury pb-1 transition-all duration-300"
          >
            View All Campaigns
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayCampaigns.slice(0, 4).map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative group overflow-hidden ${
                idx === 0 && displayCampaigns.length > 2
                  ? 'md:col-span-2 h-[400px] md:h-[550px]'
                  : 'h-[350px] md:h-[450px]'
              }`}
            >
              {/* Use <img> for both base64 data URIs and remote URLs */}
              <img
                src={campaign.image_url}
                alt={campaign.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-10 text-white">
                <span className="label text-white/50 mb-2">Campaign</span>
                <h3 className={`font-serif mb-3 ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
                  {campaign.title}
                </h3>
                <p className="text-sm text-white/60 max-w-md mb-6 line-clamp-2">
                  {campaign.description}
                </p>
                <Link
                  href={campaign.link || '/shop'}
                  className="btn text-[10px] border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 py-3 px-6"
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
