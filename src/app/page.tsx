'use client';

import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Campaigns from "@/components/home/Campaigns";
import FindYourFit from "@/components/home/FindYourFit";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { motion } from "framer-motion";

import CampaignBanner from "@/components/home/CampaignBanner";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <CampaignBanner />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Featured Collections / Categories */}
      <Categories />

      {/* 3. New Arrivals */}
      <FeaturedProducts />

      {/* 4. Campaign Showcase */}
      <Campaigns />

      {/* 5. Philosophy Quote */}
      <section className="section-padding bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="label text-luxury mb-6 block">The Philosophy</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif italic leading-relaxed text-[#2C2C2C]">
              &ldquo;True luxury lies in the details that only the wearer knows are there.&rdquo;
            </h2>
            <div className="mt-10 flex justify-center items-center gap-4">
              <div className="w-10 h-[1px] bg-black/15" />
              <span className="label text-black/30">Mensah Heritage</span>
              <div className="w-10 h-[1px] bg-black/15" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Find Your Fit (Interactive) */}
      <FindYourFit />

      {/* 7. Campaign Banner */}
      <section className="h-[60vh] md:h-[70vh] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-serif mb-6">
              The Evening Collection
            </h2>
            <a
              href="/collections"
              className="btn btn-white py-4 px-10"
            >
              Discover More
            </a>
          </motion.div>
        </div>
      </section>

      {/* 8. Newsletter */}
      <Newsletter />

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
