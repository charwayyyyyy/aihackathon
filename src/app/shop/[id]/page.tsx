'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Plus, Minus, Info, Check, Truck, RotateCcw, Shield, Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id as string),
  });

  // Fetch related products
  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const relatedProducts = allProducts?.filter(p => p.id !== id)?.slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedSize);
      }
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        openCart();
      }, 1200);
    }
  };

  const inStock = product ? (product.stock ?? 0) > 0 : false;

  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 md:pt-40 container mx-auto px-6 pb-20">
        <div className="skeleton h-3 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-3">
            <div className="aspect-[3/4] skeleton" />
            <div className="flex gap-3">
              {[1, 2, 3].map(i => <div key={i} className="w-20 h-24 skeleton" />)}
            </div>
          </div>
          <div className="space-y-6 pt-4">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-7 w-32" />
            <div className="skeleton h-20 w-full" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-14 h-14 skeleton" />)}
            </div>
            <div className="skeleton h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
          <Info size={24} className="text-black/20" />
        </div>
        <h2 className="text-2xl font-serif mb-3">Product Not Found</h2>
        <p className="text-black/40 mb-8">This product may have been removed or is no longer available.</p>
        <Link href="/shop" className="btn btn-primary">Browse Collection</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 md:pt-36 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-black/60">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <motion.div
                key={selectedImageIdx}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[3/4] bg-neutral-50 overflow-hidden"
              >
                <Image
                  src={product.images[selectedImageIdx] || '/kaftan.webp'}
                  alt={`${product.name} - Image ${selectedImageIdx + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {!inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-black text-white px-6 py-2 label text-[11px]">Sold Out</span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-200 ${
                        selectedImageIdx === idx
                          ? 'ring-2 ring-black ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-28 h-fit">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  {inStock ? (
                    <span className="badge badge-success text-[9px]">In Stock</span>
                  ) : (
                    <span className="badge badge-error text-[9px]">Sold Out</span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-serif mb-3 leading-tight">{product.name}</h1>
                <p className="text-2xl font-serif text-black/70">GHS {product.price.toLocaleString()}</p>
              </div>

              <p className="text-black/50 leading-relaxed text-[15px] mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="label text-[10px]">Select Size</h3>
                  <button className="label text-[10px] text-black/40 hover:text-luxury flex items-center gap-1 transition-colors">
                    <Info size={12} /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!inStock}
                      className={`w-14 h-14 text-xs font-medium flex items-center justify-center transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : inStock
                            ? 'border border-black/15 hover:border-black'
                            : 'border border-black/5 text-black/20 cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && inStock && (
                  <p className="label text-[9px] text-red-500/80 mt-2">Please select a size</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="label text-[10px] mb-3">Quantity</h3>
                <div className="flex items-center w-32 border border-black/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !inStock || addedToCart}
                  className={`w-full py-4 label text-[11px] flex items-center justify-center gap-2 transition-all duration-500 ${
                    addedToCart
                      ? 'bg-green-800 text-white'
                      : !selectedSize || !inStock
                        ? 'bg-black/10 text-black/30 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-luxury'
                  }`}
                >
                  {addedToCart ? (
                    <><Check size={16} /> Added to Bag</>
                  ) : (
                    'Add to Shopping Bag'
                  )}
                </button>
                <button className="w-full py-4 label text-[11px] border border-black/15 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  <Heart size={15} /> Add to Wishlist
                </button>
              </div>

              {/* Shipping Info */}
              <div className="space-y-4 py-8 border-t border-black/5">
                <div className="flex items-center gap-3 text-sm text-black/50">
                  <Truck size={18} className="text-black/30 flex-shrink-0" />
                  <span>Free delivery on orders over GHS 500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black/50">
                  <RotateCcw size={18} className="text-black/30 flex-shrink-0" />
                  <span>14-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black/50">
                  <Shield size={18} className="text-black/30 flex-shrink-0" />
                  <span>Secure checkout via WhatsApp</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-black/5 pt-8">
                <div className="flex gap-6 border-b border-black/5 mb-6">
                  {([
                    { key: 'description', label: 'Description' },
                    { key: 'details', label: 'Details' },
                    { key: 'shipping', label: 'Shipping' },
                  ] as const).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`pb-3 label text-[10px] transition-all ${
                        activeTab === tab.key
                          ? 'text-black border-b-2 border-black -mb-[1px]'
                          : 'text-black/30 hover:text-black/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'description' && (
                      <p className="text-sm text-black/50 leading-relaxed">{product.description}</p>
                    )}
                    {activeTab === 'details' && (
                      <ul className="text-sm text-black/50 space-y-2">
                        {product.details?.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-luxury rounded-full flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-luxury rounded-full flex-shrink-0" />
                          Made in Ghana
                        </li>
                      </ul>
                    )}
                    {activeTab === 'shipping' && (
                      <div className="text-sm text-black/50 space-y-3">
                        <p>Estimated delivery: 3–7 business days within Accra, 7–14 days for other regions.</p>
                        <p>International shipping available. Contact us via WhatsApp for a delivery quote.</p>
                        <p>All orders are carefully packaged in premium Mensah garment bags.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-[var(--surface-muted)]">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
