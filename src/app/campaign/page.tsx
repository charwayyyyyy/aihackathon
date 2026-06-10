'use client';

import { useQuery } from '@tanstack/react-query';
import { campaignService } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CampaignPage() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getCampaigns(),
  });

  const displayCampaigns = campaigns || [];

  return (
    <main className="min-h-screen bg-[var(--surface-muted)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 md:pt-40 pb-16">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">Campaigns</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="label text-luxury mb-3 block">Seasonal</span>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Campaigns</h1>
            <p className="text-black/45 max-w-lg text-[15px]">
              Explore our latest campaigns showcasing the season&apos;s most compelling stories and designs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[16/9] md:aspect-[21/9] skeleton" />
              ))}
            </div>
          ) : displayCampaigns.length > 0 ? (
            <div className="space-y-6">
              {displayCampaigns.map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group overflow-hidden h-[350px] md:h-[500px]"
                >
                  {/* Use <img> for both base64 data URIs and remote URLs */}
                  <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12 text-white">
                    <span className="label text-white/50 mb-2">Campaign {String(idx + 1).padStart(2, '0')}</span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-3">{campaign.title}</h2>
                    <p className="text-white/60 max-w-lg mb-6 text-sm md:text-base leading-relaxed">
                      {campaign.description}
                    </p>
                    <Link
                      href={campaign.link || '/shop'}
                      className="btn border border-white/40 text-white hover:bg-white hover:text-black py-3 px-8"
                    >
                      Shop This Campaign
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white">
              <p className="text-xl font-serif text-black/40 mb-4">No active campaigns</p>
              <Link href="/shop" className="btn btn-secondary py-3 px-8">
                Browse Collection
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
