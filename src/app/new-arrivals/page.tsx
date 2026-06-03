'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function NewArrivalsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const newArrivals = products || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 md:pt-40 pb-16 bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">New Arrivals</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="label text-luxury mb-3 block">Just In</span>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">New Arrivals</h1>
            <p className="text-black/45 max-w-lg text-[15px]">
              Discover the latest additions to our collection. Fresh designs, timeless craftsmanship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i}>
                  <div className="aspect-[3/4] skeleton mb-3" />
                  <div className="skeleton h-3 w-1/3 mx-auto mb-2" />
                  <div className="skeleton h-4 w-2/3 mx-auto mb-2" />
                  <div className="skeleton h-3 w-1/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <ProductCard product={product} badge="New" />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && newArrivals.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl font-serif text-black/40 mb-4">No new arrivals yet</p>
              <Link href="/shop" className="btn btn-secondary py-3 px-8">
                Browse All Products
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
