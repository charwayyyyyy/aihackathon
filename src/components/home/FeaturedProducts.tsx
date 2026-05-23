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

  const featured = products?.slice(0, 4) || [
    {
      id: '1',
      name: 'The Midnight Tuxedo',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1594932224828-b4b05a83296d?q=80&w=2070&auto=format&fit=crop'],
      category: 'Suits',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: '2',
      name: 'Oxford Cotton Shirt',
      price: 850,
      images: ['https://images.unsplash.com/photo-1598411037848-9cda9ec7c39f?q=80&w=1000&auto=format&fit=crop'],
      category: 'Shirts',
      sizes: ['M', 'L', 'XL'],
    },
    {
        id: '4',
        name: 'Charcoal Grey Blazer',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop'],
        category: 'Suits',
        sizes: ['M', 'L', 'XL'],
      },
      {
        id: '3',
        name: 'Silk Bow Tie',
        price: 350,
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop'],
        category: 'Accessories',
        sizes: ['One Size'],
      },
  ];

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
