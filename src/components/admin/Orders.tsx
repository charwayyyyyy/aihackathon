'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function Orders() {
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="bg-white shadow-sm border border-black/5 overflow-hidden">
      <div className="p-6 border-b border-black/5">
        <h2 className="font-serif text-xl">Recent Orders</h2>
      </div>
      <div className="divide-y divide-black/5">
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <ShoppingBag size={48} className="text-black/10 mb-4" />
            <p className="text-black/50">No orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-6 flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold mb-1">{order.id}</h3>
                    <p className="text-xs text-black/50">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="bg-luxury/10 text-luxury px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                    Pending
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 mb-4 text-sm">
                  <p><span className="font-bold">Customer:</span> {order.customer.name}</p>
                  <p><span className="font-bold">Phone:</span> {order.customer.phone}</p>
                  <p><span className="font-bold">Location:</span> {order.customer.location}</p>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-md">
                <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Items</h4>
                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="relative w-10 h-12 bg-gray-200 flex-shrink-0">
                         <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-xs">{item.name}</p>
                        <p className="text-[10px] text-black/50 uppercase">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-serif">GHS {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-black/10 pt-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-black/50">Total</span>
                  <span className="text-xl font-serif text-luxury">GHS {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
