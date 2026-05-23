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

  if (!products || products.length === 0) return null;
  const featured = products.slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-luxury uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Selection</span>
          <h2 className="text-4xl font-serif">Featured Collection</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {featured.map((product, idx) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/shop"
            className="inline-block border-b border-black pb-1 text-xs uppercase tracking-widest font-bold hover:text-luxury hover:border-luxury transition-all"
          >
            Explore Entire Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
