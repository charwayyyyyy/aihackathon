'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
      {/* Background Image Placeholder/Overlay */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        {/* You would typically have a high-res image here */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1594932224828-b4b05a83296d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4 block">
            The Art of Tailoring
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tight leading-tight">
            Elegance <br /> Reimagined
          </h1>
          <p className="text-white/70 max-w-lg mx-auto mb-10 text-lg font-light leading-relaxed">
            Discover our meticulously crafted collection where tradition meets modern sophistication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/shop"
              className="px-10 py-4 bg-white text-black uppercase tracking-widest text-xs font-bold hover:bg-luxury hover:text-white transition-all duration-300"
            >
              Shop Collection
            </Link>
            <Link 
              href="/collections"
              className="px-10 py-4 border border-white text-white uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Campaigns
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
