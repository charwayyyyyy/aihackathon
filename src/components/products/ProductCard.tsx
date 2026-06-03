'use client';

import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export default function ProductCard({ product, badge }: ProductCardProps) {
  const inStock = (product.stock ?? 0) > 0;
  const lowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 3;

  return (
    <div className="group">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          <Image
            src={product.images[0] || '/kaftan.webp'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Secondary image on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className="badge badge-luxury text-[9px] py-1 px-2.5">
                {badge}
              </span>
            )}
            {lowStock && (
              <span className="badge badge-warning text-[9px] py-1 px-2.5">
                Low Stock
              </span>
            )}
            {!inStock && (
              <span className="badge badge-error text-[9px] py-1 px-2.5">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.preventDefault(); }}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-luxury hover:text-white transition-colors duration-200"
              aria-label="Add to wishlist"
            >
              <Heart size={15} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); }}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-luxury hover:text-white transition-colors duration-200"
              aria-label="Quick view"
            >
              <Eye size={15} />
            </button>
          </div>

          {/* Quick View Bar */}
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-full group-hover:translate-y-0">
            <div className="bg-white/95 backdrop-blur-sm text-center py-3">
              <span className="label text-[10px] text-black/70">Quick View</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center px-1">
          <span className="label text-[9px] text-black/35 mb-1 block tracking-[0.2em]">
            {product.category}
          </span>
          <h3 className="text-[13px] font-medium mb-1.5 group-hover:text-luxury transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm font-serif text-black/70">
            GHS {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
