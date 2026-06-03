'use client';

import DashboardStats from '@/components/admin/DashboardStats';
import InventoryTable from '@/components/admin/InventoryTable';
import Orders from '@/components/admin/Orders';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-black/5 px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-serif mb-1">Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-black/35">
                <CalendarDays size={14} />
                <span>{today}</span>
              </div>
            </div>
            <a
              href="/"
              className="label text-[10px] text-black/30 hover:text-luxury border border-black/10 px-4 py-2 rounded-sm hover:border-luxury transition-all"
            >
              View Store →
            </a>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <DashboardStats />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div className="xl:col-span-2">
              <InventoryTable />
            </div>
            <div className="xl:col-span-1">
              <Orders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
