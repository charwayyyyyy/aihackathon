'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const ITEMS_PER_PAGE = 5;

export default function InventoryTable() {
  const { role } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const canEdit = role === 'admin' || role === 'staff';

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    const q = debouncedSearch.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, debouncedSearch]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginated.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginated.map(p => p.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-black/5 rounded-sm p-8">
        <div className="skeleton h-6 w-48 mb-6" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton h-16 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/5 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-serif text-lg">Inventory</h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search inventory..."
              className="pl-9 pr-3 py-2 text-[12px] border border-black/10 rounded-sm w-full md:w-56 focus:outline-none focus:border-luxury transition-colors"
            />
          </div>
          {canEdit && (
            <button className="btn btn-primary py-2 px-4 text-[10px] whitespace-nowrap">
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && canEdit && (
        <div className="px-5 py-3 bg-luxury/5 border-b border-luxury/10 flex items-center justify-between">
          <span className="text-[12px] text-luxury font-medium">{selectedItems.size} item(s) selected</span>
          <button className="label text-[10px] text-red-500 hover:text-red-700 transition-colors">
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-neutral-50 border-b border-black/5">
            <tr>
              {canEdit && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedItems.size === paginated.length}
                    onChange={toggleSelectAll}
                    className="accent-[var(--accent)] rounded"
                  />
                </th>
              )}
              <th className="p-4 label text-[9px] text-black/40 font-medium">Product</th>
              <th className="p-4 label text-[9px] text-black/40 font-medium">Category</th>
              <th className="p-4 label text-[9px] text-black/40 font-medium">Price</th>
              <th className="p-4 label text-[9px] text-black/40 font-medium">Status</th>
              {canEdit && <th className="p-4 label text-[9px] text-black/40 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {paginated.map((product) => {
              const isLowStock = product.price > 1000;
              return (
                <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                  {canEdit && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="accent-[var(--accent)] rounded"
                      />
                    </td>
                  )}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-neutral-100 flex-shrink-0 rounded-sm overflow-hidden">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <span className="font-medium text-[13px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[13px] capitalize text-black/50">{product.category}</td>
                  <td className="p-4 text-[13px] font-serif">GHS {product.price.toLocaleString()}</td>
                  <td className="p-4">
                    {isLowStock ? (
                      <span className="badge badge-warning text-[9px]">Low Stock</span>
                    ) : (
                      <span className="badge badge-success text-[9px]">In Stock</span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-black/25 hover:text-luxury transition-colors rounded-sm hover:bg-luxury/5" aria-label="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 text-black/25 hover:text-red-500 transition-colors rounded-sm hover:bg-red-50" aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 6 : 4} className="p-10 text-center text-black/30 text-sm">
                  {debouncedSearch ? `No results for "${debouncedSearch}"` : 'No products found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-black/5 flex items-center justify-between">
          <span className="text-[11px] text-black/30">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-black/10 rounded-sm disabled:opacity-20 hover:border-black transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-[11px] rounded-sm font-medium transition-colors ${
                  currentPage === page ? 'bg-black text-white' : 'hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-black/10 rounded-sm disabled:opacity-20 hover:border-black transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
