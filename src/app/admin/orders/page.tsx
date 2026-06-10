'use client';

import Orders from '@/components/admin/Orders';
import { useOrderStore } from '@/store/useOrderStore';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Clock, DollarSign } from 'lucide-react';

export default function AdminOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Pending',
      value: orders.length,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Revenue',
      value: `GHS ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Avg. Value',
      value: `GHS ${Math.round(avgOrderValue).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-serif">Orders</h1>
        <p className="text-sm text-black/50 mt-1">Track and manage customer orders from WhatsApp checkout.</p>
      </motion.div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 border border-black/5 rounded-sm"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={17} />
              </div>
              <p className="label text-[9px] text-black/40 mb-0.5">{stat.label}</p>
              <p className="text-xl font-serif font-medium">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <Orders />
    </div>
  );
}
