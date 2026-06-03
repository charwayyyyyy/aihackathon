'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getProducts(),
  });

  const featured = products?.slice(0, 4) || [];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4"
        >
          <div>
            <span className="label text-luxury mb-3 block">New Arrivals</span>
            <h2 className="text-3xl md:text-4xl font-serif">Just Landed</h2>
          </div>
          <Link
            href="/new-arrivals"
            className="label text-black/50 hover:text-luxury border-b border-black/20 hover:border-luxury pb-1 transition-all duration-300"
          >
            View All New Arrivals
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="aspect-[3/4] skeleton mb-4" />
                <div className="skeleton h-3 w-1/3 mx-auto mb-2" />
                <div className="skeleton h-4 w-2/3 mx-auto mb-2" />
                <div className="skeleton h-3 w-1/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {featured.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} badge="New" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
