'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useOrderStore } from '@/store/useOrderStore';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ShoppingBag, Package, DollarSign, Users } from 'lucide-react';
import { useMemo } from 'react';

export default function AdminAnalyticsPage() {
  const orders = useOrderStore((state) => state.orders);
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Derive top-selling products from orders
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const existing = productMap.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Derive unique customer count
  const uniqueCustomers = useMemo(() => {
    const phones = new Set(orders.map((o) => o.customer.phone));
    return phones.size;
  }, [orders]);

  // Revenue by day (last 7 days)
  const revenueByDay = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayRevenue = orders
        .filter((o) => o.createdAt.startsWith(dateStr))
        .reduce((acc, o) => acc + o.total, 0);
      days.push({ label, value: dayRevenue });
    }
    return days;
  }, [orders]);

  const maxRevenue = Math.max(...revenueByDay.map((d) => d.value), 1);

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: `GHS ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      description: 'All time revenue',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600',
      description: `${orders.length} pending`,
    },
    {
      label: 'Avg. Order Value',
      value: `GHS ${Math.round(avgOrderValue).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
      description: 'Per order',
    },
    {
      label: 'Customers',
      value: uniqueCustomers,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      description: 'Unique buyers',
    },
    {
      label: 'Products Listed',
      value: products?.length || 0,
      icon: Package,
      color: 'bg-rose-50 text-rose-600',
      description: 'Active listings',
    },
    {
      label: 'Conversion',
      value: products?.length ? `${Math.round((orders.length / products.length) * 100)}%` : '0%',
      icon: BarChart3,
      color: 'bg-indigo-50 text-indigo-600',
      description: 'Orders / products',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-serif">Analytics</h1>
        <p className="text-sm text-black/50 mt-1">Store performance and insights at a glance.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpiCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 border border-black/5 rounded-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={19} />
              </div>
              <p className="label text-[9px] text-black/40 mb-0.5">{stat.label}</p>
              <p className="text-2xl font-serif font-medium">{stat.value}</p>
              <p className="text-[11px] text-black/30 mt-1">{stat.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart (Bar) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-black/5 rounded-sm p-6"
        >
          <h2 className="font-serif text-lg mb-1">Revenue — Last 7 Days</h2>
          <p className="text-[11px] text-black/30 mb-6">Daily revenue breakdown</p>
          <div className="flex items-end gap-3 h-44">
            {revenueByDay.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-black/50">
                  {day.value > 0 ? `${Math.round(day.value / 1000)}k` : '0'}
                </span>
                <div
                  className="w-full bg-luxury/20 rounded-t-sm transition-all duration-500 hover:bg-luxury/40"
                  style={{
                    height: `${Math.max((day.value / maxRevenue) * 100, 4)}%`,
                    minHeight: '4px',
                  }}
                />
                <span className="text-[10px] text-black/35">{day.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-black/5 rounded-sm p-6"
        >
          <h2 className="font-serif text-lg mb-1">Top Products</h2>
          <p className="text-[11px] text-black/30 mb-6">By revenue from orders</p>

          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-black/25">
              <Package size={32} className="mb-3" />
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, idx) => {
                const barWidth = (product.revenue / topProducts[0].revenue) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-medium truncate max-w-[60%]">{product.name}</span>
                      <span className="text-[12px] font-serif text-luxury">
                        GHS {product.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-50 rounded-full h-2">
                      <div
                        className="bg-luxury/30 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-black/30 mt-0.5">{product.quantity} sold</p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
