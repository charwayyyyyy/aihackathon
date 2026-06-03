'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ShoppingBag, Search, Menu, X, User, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from '@/components/cart/CartDrawer';
import Logo from '@/components/ui/Logo';
import { useDebounce } from '@/hooks/useDebounce';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/new-arrivals', label: 'New Arrivals' },
  { href: '/campaign', label: 'Campaign' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isCartOpen, openCart, closeCart } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const role = useAuthStore((state) => state.role);
  const pathname = usePathname();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Don't render storefront navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(debouncedSearch.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <nav
        id="main-navigation"
        className={`fixed top-0 w-full z-[var(--z-fixed)] transition-all duration-500 ${
          isScrolled
            ? 'glass py-3 shadow-[var(--shadow-md)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 hover:text-luxury transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Navigation Links — Desktop */}
          <div className="hidden lg:flex items-center space-x-7 text-[11px] uppercase tracking-[0.15em] font-medium">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-300 hover:text-luxury ${
                  isActive(link.href) ? 'text-luxury' : ''
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-luxury"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Logo — Center */}
          <Logo />

          {/* Navigation Links — Desktop (right side) */}
          <div className="hidden lg:flex items-center space-x-7 text-[11px] uppercase tracking-[0.15em] font-medium">
            {NAV_LINKS.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-300 hover:text-luxury ${
                  isActive(link.href) ? 'text-luxury' : ''
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator-right"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-luxury"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-luxury transition-colors duration-300"
              aria-label="Toggle search"
            >
              <Search size={19} />
            </button>

            {/* Admin Link — Only visible if admin/staff */}
            {(role === 'admin' || role === 'staff') && (
              <Link
                href="/admin"
                className="hidden md:flex p-2 hover:text-luxury transition-colors duration-300"
                aria-label="Admin dashboard"
              >
                <User size={19} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 group"
              aria-label={`Shopping bag with ${itemCount} items`}
            >
              <ShoppingBag size={19} className="group-hover:text-luxury transition-colors duration-300" />
              {isMounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-luxury text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar — Expandable */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden border-t border-black/5"
            >
              <div className="container mx-auto px-6 py-4">
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, collections..."
                    className="input pl-12 pr-4 py-3 bg-neutral-50 border-neutral-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/30 hover:text-black transition-colors"
                    aria-label="Close search"
                  >
                    <X size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[60] lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-black/5">
                <span className="text-lg font-serif font-bold tracking-tight">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 overflow-y-auto py-4">
                {NAV_LINKS.map((link, idx) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 text-[15px] transition-colors ${
                      isActive(link.href)
                        ? 'text-luxury font-semibold bg-luxury/5'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} className="text-black/20" />
                  </Link>
                ))}

                {/* Admin link in mobile */}
                {(role === 'admin' || role === 'staff') && (
                  <>
                    <div className="mx-6 my-2 border-t border-black/5" />
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-[15px] hover:bg-neutral-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <User size={18} className="text-luxury" />
                        Admin Dashboard
                      </span>
                      <ChevronRight size={16} className="text-black/20" />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-black/5 bg-neutral-50">
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-luxury transition-colors"
                >
                  Store Admin
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
