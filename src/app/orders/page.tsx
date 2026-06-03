'use client';

import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';
import { formatWhatsAppMessage } from '@/utils/checkout';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Image from 'next/image';
import { ShoppingBag, Package, Trash2, ArrowRight, Loader2, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function OrdersPage() {
  const { items, getTotalPrice, removeItem, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const [activeTab, setActiveTab] = useState<'cart' | 'tracking'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', location: '' });

  const { data: merchant } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  const handleCheckoutClick = () => {
    setShowCustomerForm(true);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant?.whatsapp_number) return;
    setIsCheckingOut(true);
    
    // Save to order store
    addOrder({
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...items],
      total: getTotalPrice(),
      customer: customerData,
      createdAt: new Date().toISOString()
    });

    const whatsappUrl = formatWhatsAppMessage(
      items, 
      getTotalPrice(), 
      merchant.whatsapp_number
    );
    
    setShowCustomerForm(false);
    
    // Smooth transition delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsCheckingOut(false);
      clearCart();
      setActiveTab('tracking');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--surface-muted)] flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">Checkout</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-serif mb-12">Your Account</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-black/10 mb-12">
            <button
              onClick={() => setActiveTab('cart')}
              className={`pb-4 px-6 label transition-all ${
                activeTab === 'cart' 
                  ? 'border-b-2 border-black text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Shopping Bag ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`pb-4 px-6 label transition-all ${
                activeTab === 'tracking' 
                  ? 'border-b-2 border-black text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Order Tracking
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {activeTab === 'cart' && (
                <div className="bg-white p-6 md:p-10 shadow-sm">
                  {items.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 mx-auto rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                        <ShoppingBag size={24} className="text-black/20" />
                      </div>
                      <p className="text-black/50 mb-8 font-serif text-lg">Your shopping bag is empty.</p>
                      <Link href="/shop" className="btn btn-secondary py-3 px-8">
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            key={`${item.id}-${item.selectedSize}`}
                            className="flex flex-col sm:flex-row gap-6 border-b border-black/5 pb-8 last:border-0 last:pb-0"
                          >
                            <div className="relative w-24 h-32 bg-neutral-100 flex-shrink-0">
                              <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="96px" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <h3 className="text-lg font-serif">{item.name}</h3>
                                  <button 
                                    onClick={() => removeItem(item.id, item.selectedSize)}
                                    className="text-black/30 hover:text-red-500 transition-colors p-1"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <p className="label text-[10px] text-black/50 mb-1.5">
                                  Size: <span className="font-bold text-black">{item.selectedSize}</span>
                                </p>
                                <p className="label text-[10px] text-black/50">
                                  Qty: <span className="font-bold text-black">{item.quantity}</span>
                                </p>
                              </div>
                              <p className="text-lg font-serif mt-4">GHS {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tracking' && (
                <div className="bg-white p-12 md:p-20 text-center shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                    <Package size={24} className="text-black/20" />
                  </div>
                  <h2 className="text-2xl font-serif mb-3">Track Your Orders</h2>
                  <p className="text-black/50 mb-6">You currently have no pending orders.</p>
                  <p className="text-[10px] uppercase tracking-widest text-black/30 max-w-xs mx-auto leading-relaxed">
                    Orders placed via WhatsApp will appear here once processed by our team.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar (Order Summary) */}
            {activeTab === 'cart' && items.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white p-8 shadow-sm lg:sticky lg:top-32">
                  <h3 className="font-serif text-xl mb-6 pb-4 border-b border-black/5">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between text-black/60">
                      <span>Subtotal</span>
                      <span>GHS {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-black/60">
                      <span>Shipping</span>
                      <span>Calculated next</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-black/5 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-serif text-luxury">GHS {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-black/40 mt-1 text-right text-balance">
                      Tax included. Shipping calculated via WhatsApp.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleCheckoutClick}
                    disabled={isCheckingOut}
                    className="w-full btn btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <>Processing... <Loader2 className="animate-spin" size={16} /></>
                    ) : (
                      <>Checkout via WhatsApp <ArrowRight size={14} /></>
                    )}
                  </button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-black/50">
                      <Check size={14} className="text-emerald-600" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/50">
                      <Check size={14} className="text-emerald-600" />
                      <span>Free returns within 14 days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Checkout Modal */}
      <AnimatePresence>
        {showCustomerForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 max-w-md w-full shadow-2xl relative"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-serif mb-2">Delivery Details</h2>
                  <p className="text-sm text-black/50">Where should we send your order?</p>
                </div>
                
                <form onSubmit={handleConfirmCheckout} className="space-y-5">
                  <div>
                    <label className="label text-[10px] text-black/50 mb-2 block">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Enter your full name"
                      className="input" 
                      value={customerData.name} 
                      onChange={e => setCustomerData({...customerData, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="label text-[10px] text-black/50 mb-2 block">Phone Number</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="e.g. +233 50 123 4567"
                      className="input" 
                      value={customerData.phone} 
                      onChange={e => setCustomerData({...customerData, phone: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="label text-[10px] text-black/50 mb-2 block">Delivery Address</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Full street address and city"
                      className="input" 
                      value={customerData.location} 
                      onChange={e => setCustomerData({...customerData, location: e.target.value})} 
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setShowCustomerForm(false)} 
                      className="flex-1 btn btn-secondary py-3.5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isCheckingOut} 
                      className="flex-1 btn btn-primary py-3.5 disabled:opacity-50"
                    >
                      {isCheckingOut ? 'Processing...' : 'Confirm'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
