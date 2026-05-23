'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  // Mock data if API is empty or failing during development
  const mockProducts = [
    {
      id: '1',
      name: 'The Midnight Tuxedo',
      description: 'Hand-tailored from premium Italian wool.',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1594932224828-b4b05a83296d?q=80&w=2070&auto=format&fit=crop'],
      category: 'Suits',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: '2',
      name: 'Oxford Cotton Shirt',
      description: 'A timeless classic for any wardrobe.',
      price: 850,
      images: ['https://images.unsplash.com/photo-1598411037848-9cda9ec7c39f?q=80&w=1000&auto=format&fit=crop'],
      category: 'Shirts',
      sizes: ['M', 'L', 'XL'],
    },
    {
      id: '3',
      name: 'Silk Bow Tie',
      description: 'The perfect finishing touch.',
      price: 350,
      images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop'],
      category: 'Accessories',
      sizes: ['One Size'],
    },
    {
        id: '4',
        name: 'Charcoal Grey Blazer',
        description: 'Modern fit with a soft shoulder construction.',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop'],
        category: 'Suits',
        sizes: ['M', 'L', 'XL'],
      },
  ];

  const displayProducts = products && products.length > 0 ? products : mockProducts;

  const filteredProducts = displayProducts
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default newest
    });

  const categories = ['All', 'Suits', 'Shirts', 'Accessories'];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-40 pb-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-serif mb-4">Shop Collection</h1>
          <p className="text-black/50 uppercase tracking-widest text-xs">Home / Shop</p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-20 z-30 bg-white border-b border-black/5 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold">
                <span>Category: {selectedCategory}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-[#F9F9F7] transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold">
                <span>Sort By: {sortBy}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-[#F9F9F7] transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
            Showing {filteredProducts.length} Results
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl font-serif text-black/50">No products found in this category.</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-6 text-xs uppercase tracking-widest border-b border-black pb-1"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
