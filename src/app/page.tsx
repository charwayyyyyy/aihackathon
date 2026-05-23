'use client';

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Campaigns from "@/components/home/Campaigns";
import FindYourFit from "@/components/home/FindYourFit";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <Hero />
      
      {/* Featured Quote Section */}
      <section className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-luxury uppercase tracking-[0.3em] text-xs mb-8 block font-bold">The Philosophy</span>
            <h2 className="text-3xl md:text-5xl font-serif italic leading-relaxed text-[#2C2C2C]">
              "True luxury lies in the details that only the wearer knows are there."
            </h2>
            <div className="mt-12 flex justify-center items-center gap-4">
              <div className="w-12 h-[1px] bg-black/20" />
              <span className="text-xs uppercase tracking-widest text-black/50">Mensah Heritage</span>
              <div className="w-12 h-[1px] bg-black/20" />
            </div>
          </motion.div>
        </div>
      </section>

      <FindYourFit />
      
      <FeaturedProducts />

      <Campaigns />

      <Categories />

      {/* Campaign Banner Section */}
      <section className="h-[70vh] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-fixed bg-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white text-4xl md:text-6xl font-serif mb-8">The Evening Collection</h2>
            <button className="px-12 py-4 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-luxury hover:text-white transition-all">
              Discover More
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
