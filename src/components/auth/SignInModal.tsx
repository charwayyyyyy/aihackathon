'use client';

import { useState } from 'react';
import { useAuthStore, Role } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const setRole = useAuthStore((state) => state.setRole);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    onClose();
    if (selectedRole === 'admin' || selectedRole === 'staff') {
      router.push('/admin');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[111] shadow-2xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-luxury" />
                <h2 className="text-sm uppercase tracking-[0.3em] font-bold">Admin Access</h2>
              </div>
              <button onClick={onClose} className="text-black/50 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-3">
                  Select Role (Demo)
                </label>
                <div className="space-y-3">
                  {(['admin', 'staff', 'viewer'] as Role[]).map((r) => (
                    <label 
                      key={r} 
                      className={`block p-4 border cursor-pointer transition-all ${
                        selectedRole === r 
                          ? 'border-luxury bg-luxury/5 text-luxury' 
                          : 'border-black/10 hover:border-black/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="role" 
                          value={r}
                          checked={selectedRole === r}
                          onChange={() => setSelectedRole(r)}
                          className="accent-luxury"
                        />
                        <span className="font-bold capitalize">{r}</span>
                      </div>
                      <p className="text-xs text-black/50 ml-6 mt-1">
                        {r === 'admin' && 'Full access to inventory, orders, dashboard.'}
                        {r === 'staff' && 'Manage inventory and view orders.'}
                        {r === 'viewer' && 'Dashboard only (read-only mode).'}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury transition-colors"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
