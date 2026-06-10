'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { motion } from 'framer-motion';
import { Users, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';

interface CustomerInfo {
  name: string;
  phone: string;
  location: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const orders = useOrderStore((state) => state.orders);

  // Derive unique customers from orders
  const customers = useMemo(() => {
    const customerMap = new Map<string, CustomerInfo>();

    orders.forEach((order) => {
      const key = order.customer.phone;
      const existing = customerMap.get(key);

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.createdAt;
        }
      } else {
        customerMap.set(key, {
          name: order.customer.name,
          phone: order.customer.phone,
          location: order.customer.location,
          orderCount: 1,
          totalSpent: order.total,
          lastOrder: order.createdAt,
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-serif">Customers</h1>
          <p className="text-sm text-black/50 mt-1">View customers derived from order history.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-black/40">
          <Users size={16} />
          <span>{customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
        </div>
      </motion.div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
              <Users size={28} className="text-black/15" />
            </div>
            <p className="text-sm text-black/40 mb-1">No customers yet</p>
            <p className="text-[11px] text-black/25">Customers will appear here once orders are placed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-neutral-50 border-b border-black/5">
                <tr>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Customer</th>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Phone</th>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Location</th>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Orders</th>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Total Spent</th>
                  <th className="p-4 label text-[9px] text-black/40 font-medium">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {customers.map((customer, idx) => (
                  <motion.tr
                    key={customer.phone}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-luxury/10 flex items-center justify-center text-luxury font-serif text-sm font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-black/50">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-black/25" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-black/50">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-black/25" />
                        {customer.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[13px]">
                        <ShoppingBag size={12} className="text-black/25" />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] font-serif text-luxury font-medium">
                      GHS {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="p-4 text-[12px] text-black/40">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
