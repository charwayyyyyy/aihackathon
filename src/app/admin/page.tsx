'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardStats from '@/components/admin/DashboardStats';
import InventoryTable from '@/components/admin/InventoryTable';
import Orders from '@/components/admin/Orders';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
  const { role, logout } = useAuthStore();

  return (
    <RoleGuard allowedRoles={['admin', 'staff', 'viewer']}>
      <main className="min-h-screen bg-[#F9F9F7] flex flex-col">
        <Navbar />
        
        <div className="flex-1 pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-black/10 pb-6 gap-4">
              <div>
                <h1 className="text-4xl font-serif mb-2">Admin Dashboard</h1>
                <p className="text-black/50 text-sm">
                  Logged in as <span className="font-bold text-luxury capitalize">{role}</span>
                </p>
              </div>
              <button 
                onClick={logout}
                className="text-xs uppercase tracking-widest font-bold text-black/50 hover:text-black transition-colors bg-white px-6 py-3 border border-black/10"
              >
                Sign Out
              </button>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <InventoryTable />
              </div>
              <div className="xl:col-span-1 space-y-8">
                <Orders />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </RoleGuard>
  );
}
