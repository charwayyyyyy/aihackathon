'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
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
  const { items, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');

  const { data: merchant } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    if (!customerName || !customerPhone || !deliveryLocation) {
      alert("Please fill in all details");
      return;
    }
    
    let message = `Hello Mensah, I'd like to place an order:\n\n`;
    message += `*CUSTOMER DETAILS*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    message += `Location: ${deliveryLocation}\n\n`;
    message += `*ORDER SUMMARY*\n`;
    
    items.forEach(item => {
      message += `- ${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity})\n`;
    });
    
    message += `\n*Total: GHS ${getTotalPrice().toLocaleString()}*`;

    const phoneNumber = merchant?.whatsapp_number;
    if (!phoneNumber) {
      alert("Merchant WhatsApp number is currently unavailable. Please try again later.");
      return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Track order in localStorage
    useCartStore.getState().placeOrder({
      name: customerName,
      phone: customerPhone,
      location: deliveryLocation
    });
    
    setIsCheckoutMode(false);
    onClose();
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Reset mode when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsCheckoutMode(false), 300);
    }
  }, [isOpen]);

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
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#F9F9F7]">
              <div className="flex items-center gap-3">
                {isCheckoutMode ? (
                  <button onClick={() => setIsCheckoutMode(false)} className="hover:text-luxury transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                ) : (
                  <ShoppingBag size={20} />
                )}
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">
                  {isCheckoutMode ? 'Delivery Details' : 'Your Bag'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
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
              ) : isCheckoutMode ? (
                <div className="space-y-6 font-sans">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-black/50 font-bold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full border-b border-black/20 pb-2 focus:border-luxury focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-black/50 font-bold mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 054 000 0000"
                      className="w-full border-b border-black/20 pb-2 focus:border-luxury focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-black/50 font-bold mb-2">Delivery Location / Address</label>
                    <textarea 
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. East Legon, Accra"
                      rows={3}
                      className="w-full border-b border-black/20 pb-2 focus:border-luxury focus:outline-none transition-colors text-sm resize-none"
                    />
                  </div>
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
                  <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Total</span>
                  <span className="text-xl font-serif text-luxury">GHS {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {isCheckoutMode ? (
                     <button 
                       onClick={handleWhatsAppCheckout}
                       className="w-full bg-[#25D366] text-white py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-lg"
                     >
                       Complete Order on WhatsApp <ArrowRight size={14} />
                     </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsCheckoutMode(true)}
                        className="w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        Proceed to Checkout <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
