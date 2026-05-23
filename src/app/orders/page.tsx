'use client';

import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { ShoppingBag, Package, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function OrdersPage() {
  const { items, orders, getTotalPrice, removeItem } = useCartStore();
  const openCart = useUIStore((state) => state.openCart);
  const [activeTab, setActiveTab] = useState<'cart' | 'tracking'>('cart');

  return (
    <main className="min-h-screen bg-[#F9F9F7] flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl font-serif mb-12">Your Account</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-black/10 mb-12">
            <button
              onClick={() => setActiveTab('cart')}
              className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'cart' 
                  ? 'border-b-2 border-black text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Shopping Bag ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'tracking' 
                  ? 'border-b-2 border-black text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              Order Tracking ({orders.length})
            </button>
          </div>

          {/* Cart View */}
          {activeTab === 'cart' && (
            <div className="bg-white p-8 md:p-12 shadow-sm border border-black/5">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag size={48} className="mx-auto text-black/10 mb-6" />
                  <p className="text-black/50 mb-8">Your shopping bag is empty.</p>
                  <a href="/shop" className="text-xs uppercase tracking-widest border-b border-black font-bold pb-1">
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col sm:flex-row gap-6 border-b border-black/5 pb-8">
                      <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-serif">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="text-black/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-xs text-black/60 uppercase tracking-widest mb-2">
                            Size: <span className="font-bold text-black">{item.selectedSize}</span>
                          </p>
                          <p className="text-xs text-black/60 uppercase tracking-widest">
                            Quantity: <span className="font-bold text-black">{item.quantity}</span>
                          </p>
                        </div>
                        <p className="text-lg font-serif mt-4">GHS {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col items-end pt-4">
                    <p className="text-xs uppercase tracking-widest text-black/50 mb-2">Subtotal</p>
                    <p className="text-3xl font-serif mb-8 text-luxury">GHS {getTotalPrice().toLocaleString()}</p>
                    <button 
                      onClick={openCart}
                      className="bg-black text-white px-12 py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury transition-all flex items-center gap-3"
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tracking View */}
          {activeTab === 'tracking' && (
            <div className="space-y-8">
              {orders.length === 0 ? (
                <div className="bg-white p-20 text-center shadow-sm border border-black/5">
                  <Package size={48} className="mx-auto text-black/10 mb-6" />
                  <p className="text-black/50">You have no pending orders.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white p-8 shadow-sm border border-black/5">
                    <div className="flex flex-col md:flex-row justify-between border-b border-black/10 pb-6 mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Order Number</p>
                        <p className="text-lg font-serif">{order.id}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Date</p>
                        <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Status</p>
                        <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-luxury text-xs font-bold uppercase tracking-wider rounded-full">
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Total</p>
                        <p className="text-lg font-serif">GHS {order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="w-12 h-16 bg-gray-100 relative">
                              <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-serif">{item.name}</p>
                              <p className="text-[10px] text-black/50 uppercase tracking-widest">
                                Size: {item.selectedSize} | Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
