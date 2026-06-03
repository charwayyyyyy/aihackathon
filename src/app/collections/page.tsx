'use client';

import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Campaigns from '@/components/home/Campaigns';
import Categories from '@/components/home/Categories';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-muted)]">
      <Navbar />

      <section className="pt-36 md:pt-40 pb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">Collections</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="label text-luxury mb-3 block">Current Season</span>
            <h1 className="text-4xl md:text-6xl font-serif mb-4">Collections</h1>
            <p className="text-black/45 max-w-lg text-[15px]">
              Browse our curated collections and discover pieces designed for every occasion.
            </p>
          </motion.div>
        </div>
      </section>

      <Categories />
      <Campaigns />

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
