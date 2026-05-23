'use client';

import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { resolveImage } from "@/utils/resolveImage";

<Image
  src={resolveImage(product.image) || ""}
  alt={product.name}
  width={400}
  height={400}
/>


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1594932224828-b4b05a83296d?q=80&w=2070&auto=format&fit=crop'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button className="w-full bg-white text-black py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors">
              Quick View
            </button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block">
            {product.category}
          </span>
          <h3 className="text-sm font-medium mb-2 group-hover:text-luxury transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-serif">
            GHS {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
