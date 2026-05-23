'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeritagePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="text-luxury uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-8">
              The Heritage of Mensah
            </h1>
            <p className="text-black/60 max-w-2xl mx-auto leading-relaxed text-lg">
              Born from a passion for exquisite tailoring, Mensah represents the pinnacle of luxury menswear. Every garment tells a story of meticulous craftsmanship, uncompromising quality, and timeless elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] bg-gray-100"
            >
              <Image 
                src="/kaftan3.webp" 
                alt="Ghanaian Craftsmanship" 
                fill 
                className="object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif">The Art of Tailoring</h2>
              <p className="text-black/60 leading-relaxed">
                Our master tailors bring decades of experience to every cut, stitch, and finish. We source only the finest fabrics from world-renowned mills, ensuring that every piece that bears the Mensah name is a testament to sartorial excellence.
              </p>
              <p className="text-black/60 leading-relaxed">
                From the precise drape of a jacket to the perfect break of a trouser, we obsess over the details because true luxury lies in the unseen.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
