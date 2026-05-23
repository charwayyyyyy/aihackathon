'use client';

import { useCartStore } from '@/store/useCartStore';
import { formatWhatsAppMessage } from '@/utils/checkout';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const whatsappUrl = formatWhatsAppMessage(items, getTotalPrice());
    
    // Simulate a brief delay for "processing" feel
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-40 pb-20 container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag size={48} className="mx-auto mb-8 text-black/10" />
            <h1 className="text-3xl font-serif mb-4">Your Shopping Bag is Empty</h1>
            <p className="text-black/50 mb-12 text-sm">
              Discover our latest collections and find something exceptional.
            </p>
            <Link 
              href="/shop"
              className="inline-block bg-black text-white px-12 py-4 text-xs uppercase tracking-widest font-bold hover:bg-luxury transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Items List */}
            <div className="lg:col-span-8">
              <div className="border-t border-black/5">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-6 py-8 border-b border-black/5"
                    >
                      <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-black/40">
                              Size: {item.selectedSize}
                            </p>
                          </div>
                          <p className="text-sm font-serif">GHS {item.price.toLocaleString()}</p>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-black/5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id, item.selectedSize)}
                            className="text-[10px] uppercase tracking-widest text-black/40 hover:text-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#F9F9F7] p-8 sticky top-32">
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-8">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Subtotal</span>
                    <span>GHS {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Shipping</span>
                    <span className="text-[10px] uppercase tracking-widest text-luxury">Calculated at Checkout</span>
                  </div>
                  <div className="border-t border-black/5 pt-4 flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span>GHS {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-black text-white py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury transition-all flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Proceed to WhatsApp Checkout <ArrowRight size={14} />
                    </>
                  )}
                </button>
                
                <p className="mt-6 text-[10px] text-center text-black/40 leading-relaxed">
                  By proceeding, you will be redirected to WhatsApp to finalize your order with our personal shopping team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
