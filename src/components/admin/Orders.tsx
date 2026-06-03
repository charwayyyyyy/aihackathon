'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Orders() {
  const orders = useOrderStore((state) => state.orders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
    <div className="bg-white border border-black/5 rounded-sm overflow-hidden">
      <div className="p-5 border-b border-black/5 flex items-center justify-between">
        <h2 className="font-serif text-lg">Recent Orders</h2>
        <span className="badge badge-luxury text-[9px]">{orders.length} total</span>
      </div>

      <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
              <ShoppingBag size={22} className="text-black/15" />
            </div>
            <p className="text-sm text-black/40 mb-1">No orders yet</p>
            <p className="text-[11px] text-black/25">Orders from WhatsApp checkout will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="hover:bg-neutral-50/50 transition-colors">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold">{order.id}</span>
                    <span className="badge badge-warning text-[8px] py-0.5 px-1.5">
                      <Clock size={9} className="mr-0.5" /> Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-black/35">
                    <span>{order.customer.name}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-serif text-luxury font-medium">
                    GHS {order.total.toLocaleString()}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`text-black/20 transition-transform ${
                      expandedOrder === order.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Order Detail (Expandable) */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Customer Info */}
                      <div className="bg-neutral-50 p-3 rounded-sm text-[12px] space-y-1">
                        <p><span className="font-medium text-black/50">Phone:</span> {order.customer.phone}</p>
                        <p><span className="font-medium text-black/50">Location:</span> {order.customer.location}</p>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="relative w-8 h-10 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0">
                              <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="32px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium truncate">{item.name}</p>
                              <p className="text-[10px] text-black/35">Size: {item.selectedSize} × {item.quantity}</p>
                            </div>
                            <span className="text-[12px] font-serif text-black/60">
                              GHS {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
