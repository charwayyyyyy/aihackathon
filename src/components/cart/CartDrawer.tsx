'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, getTotalPrice } = useCartStore();

  const { data: merchant } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    
    let message = `Hello Mensah, I'd like to order:\n\n`;
    items.forEach(item => {
      message += `- ${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity})\n`;
    });
    message += `\nTotal: GHS ${getTotalPrice().toLocaleString()}`;

    // Fallback number if API is empty
    const phoneNumber = merchant?.whatsapp_number || '+233000000000';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Your Bag</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-black/5 mb-6" />
                  <p className="text-sm text-black/40 mb-8">Your bag is currently empty.</p>
                  <button 
                    onClick={onClose}
                    className="text-xs uppercase tracking-widest border-b border-black pb-1 font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="text-[11px] font-bold uppercase tracking-wider">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id, item.selectedSize)}
                            className="text-black/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-black/40 uppercase tracking-widest mb-4">
                          Size: {item.selectedSize} | Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-serif">GHS {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-[#F9F9F7] border-t border-black/5">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Subtotal</span>
                  <span className="text-xl font-serif">GHS {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <Link 
                    href="/cart"
                    onClick={onClose}
                    className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-luxury transition-all flex items-center justify-center gap-2"
                  >
                    View Shopping Bag
                  </Link>
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Checkout via WhatsApp <ArrowRight size={14} />
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
