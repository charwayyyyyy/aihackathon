'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from '@/components/cart/CartDrawer';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCartOpen, openCart, closeCart } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex space-x-8 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-luxury transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-luxury transition-colors">Collections</Link>
          <Link href="/heritage" className="hover:text-luxury transition-colors">Heritage</Link>
          <Link href="/orders" className="hover:text-luxury transition-colors">Orders</Link>
        </div>

        {/* Logo */}
        <Logo />

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <button className="hidden md:block hover:text-luxury transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={openCart}
            className="relative group"
          >
            <ShoppingBag size={20} className="group-hover:text-luxury transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col p-8"
          >
            <button 
              className="self-end mb-12"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-8 text-2xl font-serif">
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
              <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
              <Link href="/heritage" onClick={() => setIsMobileMenuOpen(false)}>Our Heritage</Link>
              <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders & Cart</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
