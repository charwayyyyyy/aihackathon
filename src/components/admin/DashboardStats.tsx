'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';

export default function DashboardStats() {
  const orders = useOrderStore((state) => state.orders);
  
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 shadow-sm border border-black/5 flex items-center gap-6">
        <div className="h-12 w-12 bg-gray-50 flex items-center justify-center rounded-full">
          <Package className="text-luxury" size={24} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Total Products</p>
          <p className="text-2xl font-serif">{products?.length || 0}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 shadow-sm border border-black/5 flex items-center gap-6">
        <div className="h-12 w-12 bg-gray-50 flex items-center justify-center rounded-full">
          <ShoppingBag className="text-luxury" size={24} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Total Orders</p>
          <p className="text-2xl font-serif">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-sm border border-black/5 flex items-center gap-6">
        <div className="h-12 w-12 bg-gray-50 flex items-center justify-center rounded-full">
          <TrendingUp className="text-luxury" size={24} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Total Revenue</p>
          <p className="text-2xl font-serif">GHS {totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
