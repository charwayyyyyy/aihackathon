'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getItemCount } = useCartStore();
  const total = getTotalPrice();
  const itemCount = getItemCount();
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShippingReached = total >= FREE_SHIPPING_THRESHOLD;

  // Close drawer on escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} />
                <h2 className="label text-[11px]">
                  Your Bag <span className="text-black/30">({itemCount})</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-neutral-50 border-b border-black/5">
                {freeShippingReached ? (
                  <p className="text-[11px] text-emerald-700 font-medium text-center">
                    ✓ You&apos;ve unlocked free shipping!
                  </p>
                ) : (
                  <>
                    <p className="text-[11px] text-black/40 text-center mb-2">
                      Add <span className="font-semibold text-black/60">GHS {(FREE_SHIPPING_THRESHOLD - total).toLocaleString()}</span> more for free shipping
                    </p>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        className="h-full bg-luxury rounded-full"
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-5">
                    <ShoppingBag size={24} className="text-black/10" />
                  </div>
                  <p className="text-sm text-black/35 mb-6">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="btn btn-secondary py-2.5 px-6 text-[10px]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4"
                      >
                        <div className="relative w-[76px] h-[95px] bg-neutral-50 flex-shrink-0 rounded-sm overflow-hidden">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="76px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1.5">
                            <h3 className="text-[12px] font-semibold uppercase tracking-wider leading-tight pr-2 truncate">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="text-black/20 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <p className="text-[10px] text-black/30 uppercase tracking-wider mb-3">
                            Size: {item.selectedSize}
                          </p>
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-black/10 rounded-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                className="p-1.5 hover:bg-neutral-50 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="px-3 text-[11px] font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="p-1.5 hover:bg-neutral-50 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <p className="text-[13px] font-serif">
                              GHS {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 bg-[var(--surface-muted)] border-t border-black/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="label text-[10px] text-black/35">Subtotal</span>
                  <span className="text-xl font-serif">GHS {total.toLocaleString()}</span>
                </div>
                <div className="space-y-2.5">
                  <Link
                    href="/orders"
                    onClick={onClose}
                    className="w-full btn btn-primary py-3.5 flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full btn btn-ghost text-[10px] text-black/40 hover:text-black"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
