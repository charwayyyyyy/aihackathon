'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { motion } from 'framer-motion';

export default function DashboardStats() {
  const orders = useOrderStore((state) => state.orders);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const stats = [
    {
      label: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      trend: '+3 this week',
      trendUp: true,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      trend: orders.length > 0 ? `${orders.length} pending` : 'No orders',
      trendUp: orders.length > 0,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Total Revenue',
      value: `GHS ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: totalRevenue > 0 ? '+12% vs last month' : 'No revenue yet',
      trendUp: totalRevenue > 0,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Avg. Order Value',
      value: `GHS ${Math.round(avgOrderValue).toLocaleString()}`,
      icon: Users,
      trend: avgOrderValue > 0 ? 'Per order' : 'N/A',
      trendUp: avgOrderValue > 0,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="bg-white p-5 border border-black/5 rounded-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Icon size={19} />
              </div>
            </div>
            <p className="label text-[9px] text-black/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-serif font-medium">{stat.value}</p>
            <p className={`text-[11px] mt-2 ${stat.trendUp ? 'text-emerald-600' : 'text-black/30'}`}>
              {stat.trend}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
