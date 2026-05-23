'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';

export default function InventoryTable() {
  const { role } = useAuthStore();
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const canEdit = role === 'admin' || role === 'staff';

  if (isLoading) {
    return <div className="p-8 text-center text-black/50">Loading inventory...</div>;
  }

  return (
    <div className="bg-white shadow-sm border border-black/5 overflow-hidden">
      <div className="p-6 border-b border-black/5 flex justify-between items-center">
        <h2 className="font-serif text-xl">Inventory Management</h2>
        {canEdit && (
          <button className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-luxury transition-colors">
            Add Product
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-black/5 text-xs uppercase tracking-widest text-black/50">
            <tr>
              <th className="p-6 font-medium">Product</th>
              <th className="p-6 font-medium">Category</th>
              <th className="p-6 font-medium">Price</th>
              <th className="p-6 font-medium">Stock</th>
              {canEdit && <th className="p-6 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products?.map((product) => {
              // Simulating low stock logically since api might not have it
              const isLowStock = product.price > 1000;
              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 flex items-center gap-4">
                    <div className="relative w-12 h-16 bg-gray-100 flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold">{product.name}</span>
                  </td>
                  <td className="p-6 capitalize text-black/70">{product.category}</td>
                  <td className="p-6 font-serif">GHS {product.price.toLocaleString()}</td>
                  <td className="p-6">
                    {isLowStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 uppercase tracking-wider">
                        Low Stock (3)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 uppercase tracking-wider">
                        In Stock (12)
                      </span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="text-black/40 hover:text-luxury transition-colors"><Edit2 size={16} /></button>
                        <button className="text-black/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-black/50">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
