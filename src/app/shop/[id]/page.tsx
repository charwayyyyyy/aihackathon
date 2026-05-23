'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight, Plus, Minus, Info } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id as string),
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    if (product) {
      addItem(product, selectedSize);
      openCart();
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-40 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="aspect-[3/4] bg-black/5 animate-pulse" />
          <div className="space-y-8">
            <div className="h-4 bg-black/5 w-1/4 animate-pulse" />
            <div className="h-12 bg-black/5 w-3/4 animate-pulse" />
            <div className="h-6 bg-black/5 w-1/2 animate-pulse" />
            <div className="h-32 bg-black/5 w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-black/40 mb-12">
            <Link href="/shop" className="hover:text-black">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-black">{product.category}</span>
            <ChevronRight size={10} />
            <span className="text-black">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Gallery */}
            <div className="space-y-4">
              {product.images.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative aspect-[3/4] bg-gray-50 overflow-hidden"
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="mb-10">
                <span className="text-luxury uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
                  Limited Edition
                </span>
                <h1 className="text-4xl font-serif mb-4 leading-tight">{product.name}</h1>
                <p className="text-2xl font-serif mb-8">GHS {product.price.toLocaleString()}</p>
                <p className="text-black/60 leading-relaxed text-sm max-w-md">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold">Select Size</h3>
                  <button className="text-[10px] uppercase tracking-widest border-b border-black flex items-center gap-1">
                    <Info size={12} /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 border text-xs flex items-center justify-center transition-all duration-300 ${
                        selectedSize === size 
                          ? 'bg-black text-white border-black' 
                          : 'border-black/10 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-[10px] text-red-500 mt-2 uppercase tracking-widest">Please select a size</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4">Quantity</h3>
                <div className="flex items-center w-32 border border-black/10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury transition-all duration-500"
                >
                  Add to Shopping Bag
                </button>
                <button className="w-full border border-black py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all duration-500">
                  Tailor to Measure
                </button>
              </div>

              {/* Details Accordion (Simplified) */}
              <div className="mt-16 border-t border-black/5 pt-8 space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Tailoring Details</h4>
                  <ul className="text-xs text-black/60 space-y-2 list-disc pl-4">
                    {product.details?.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <section className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-serif mb-12 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* We could reuse ProductCard here with filtered products */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Simple Link helper since it was missing in imports
import Link from 'next/link';
