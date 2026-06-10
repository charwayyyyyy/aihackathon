'use client';

import InventoryTable from '@/components/admin/InventoryTable';
import { motion } from 'framer-motion';

export default function AdminProductsPage() {
  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-serif">Products</h1>
          <p className="text-sm text-black/50 mt-1">Manage your product inventory and listings.</p>
        </div>
      </motion.div>

      <InventoryTable />
    </div>
  );
}
