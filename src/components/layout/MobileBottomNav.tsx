'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { Home, Search, ShoppingBag, Grid3X3, User } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: Grid3X3 },
  { href: '/search', label: 'Search', icon: Search, action: 'search' },
  { href: '/cart', label: 'Bag', icon: ShoppingBag, action: 'cart' },
  { href: '/admin/login', label: 'Account', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCart = useUIStore((state) => state.openCart);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleClick = (item: typeof NAV_ITEMS[0], e: React.MouseEvent) => {
    if (item.action === 'cart') {
      e.preventDefault();
      openCart();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] lg:hidden glass border-t border-black/5"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.label}
              href={item.action === 'cart' ? '#' : item.href}
              onClick={(e) => handleClick(item, e)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors duration-200 ${
                active ? 'text-luxury' : 'text-black/40 hover:text-black/70'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {item.action === 'cart' && isMounted && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-luxury text-white text-[8px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-luxury rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
