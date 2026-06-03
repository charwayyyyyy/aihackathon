'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'All';
  const initialSearch = searchParams?.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const displayProducts = products || [];
  const categories = ['All', ...Array.from(new Set(displayProducts.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = displayProducts;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [displayProducts, selectedCategory, debouncedSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Name A–Z', value: 'name' },
  ];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-36 md:pt-40 pb-12 md:pb-16 bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif">Shop Collection</h1>
        </div>
      </section>

      {/* Search Bar */}
      <section className="border-b border-black/5 py-5 bg-white">
        <div className="container mx-auto px-6">
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search products..."
              className="w-full pl-8 pr-4 py-2 text-sm bg-transparent border-none focus:outline-none placeholder:text-black/25"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[52px] md:top-[60px] z-[var(--z-sticky)] bg-white border-b border-black/5 py-3">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Filter Toggle (mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-1.5 label text-[10px]"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {/* Category Filter (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium rounded-full transition-all duration-200 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-black text-white'
                      : 'text-black/50 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 label text-[10px] text-black/60 hover:text-black transition-colors"
              >
                Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                <ChevronDown size={12} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-black/5 shadow-lg z-20 py-1">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] hover:bg-neutral-50 transition-colors ${
                          sortBy === opt.value ? 'text-luxury font-bold' : 'text-black/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 border border-black/10 rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'text-black/30 hover:text-black'}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-black/30 hover:text-black'}`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>

            <span className="label text-[9px] text-black/30">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'}
            </span>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="md:hidden bg-white border-b border-black/5 py-4">
          <div className="container mx-auto px-6 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { handleCategoryChange(cat); setIsFilterOpen(false); }}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium rounded-full transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-black/50 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] skeleton mb-3" />
                  <div className="skeleton h-2.5 w-1/3 mx-auto mb-2" />
                  <div className="skeleton h-3.5 w-2/3 mx-auto mb-2" />
                  <div className="skeleton h-3 w-1/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'
                : 'space-y-6'
            }>
              {paginatedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
                <Search size={24} className="text-black/20" />
              </div>
              <p className="text-xl font-serif text-black/40 mb-2">No products found</p>
              <p className="text-sm text-black/30 mb-8">
                {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Try adjusting your filters'}
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setCurrentPage(1); }}
                className="btn btn-secondary py-3 px-6"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 label text-[10px] border border-black/10 hover:border-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 label text-[11px] flex items-center justify-center transition-colors ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'border border-black/10 hover:border-black'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 label text-[10px] border border-black/10 hover:border-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
