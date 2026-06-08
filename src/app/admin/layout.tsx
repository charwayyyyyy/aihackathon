'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Settings, ChevronLeft, ChevronRight, LogOut, Menu, X, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin#products', label: 'Products', icon: Package },
  { href: '/admin#orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin#customers', label: 'Customers', icon: Users },
  { href: '/admin#analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Tag },
  { href: '/admin#settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !['admin', 'staff', 'viewer'].includes(role)) {
      router.push('/admin/login');
    }
  }, [role, router, isMounted]);

  if (!isMounted) return null;

  if (!['admin', 'staff', 'viewer'].includes(role)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1A1A1A] text-white transition-all duration-300 fixed inset-y-0 left-0 z-30 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo */}
        <div className={`p-5 border-b border-white/5 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <Link href="/" className="text-xl font-serif font-bold tracking-tight">MENSAH</Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md transition-all duration-200 ${
                  active
                    ? 'bg-luxury/20 text-luxury'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                } ${sidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
                title={sidebarCollapsed ? link.label : undefined}
              >
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-[13px] font-medium">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={`p-4 border-t border-white/5 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed && (
            <div className="mb-3 px-1">
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-medium capitalize text-luxury">{role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full text-white/30 hover:text-red-400 transition-colors rounded-md py-2 ${
              sidebarCollapsed ? 'justify-center px-0' : 'px-1'
            }`}
            title="Sign Out"
          >
            <LogOut size={17} />
            {!sidebarCollapsed && <span className="text-[12px] font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-lg font-serif font-bold">MENSAH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="label text-[9px] text-luxury capitalize">{role}</span>
          <button onClick={handleLogout} className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-red-400 transition-colors">
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-[#1A1A1A] text-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <span className="text-xl font-serif font-bold">MENSAH</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 py-4 overflow-y-auto">
                {SIDEBAR_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md transition-all ${
                        active ? 'bg-luxury/20 text-luxury' : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={19} />
                      <span className="text-[13px] font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/5">
                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[12px]"
                >
                  ← Back to Store
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
      }`}>
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
