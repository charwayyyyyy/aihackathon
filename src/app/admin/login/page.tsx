'use client';

import { useState } from 'react';
import { useAuthStore, Role } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const setRole = useAuthStore((state) => state.setRole);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== 'admin123') {
      alert('Invalid password. Please use admin123');
      return;
    }
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setRole(selectedRole);
      router.push('/admin');
    }, 800);
  };

  const roles: { value: Role; label: string; description: string }[] = [
    { value: 'admin', label: 'Administrator', description: 'Full access to inventory, orders, and dashboard settings.' },
    { value: 'staff', label: 'Staff', description: 'Manage inventory and view orders.' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to dashboard data.' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <span className="text-3xl font-serif text-white tracking-tight font-bold">MENSAH</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={18} className="text-luxury" />
            <h1 className="label text-white text-[11px]">Store Administration</h1>
          </div>
          <p className="text-white/30 text-sm">Sign in to manage your store</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className="label text-[10px] text-black/50 mb-3 block">Select Role</label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`block p-4 border cursor-pointer transition-all duration-200 ${
                      selectedRole === r.value
                        ? 'border-luxury bg-luxury/5'
                        : 'border-black/8 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={selectedRole === r.value}
                        onChange={() => setSelectedRole(r.value)}
                        className="accent-[var(--accent)]"
                      />
                      <div>
                        <span className="font-semibold text-sm">{r.label}</span>
                        <p className="text-[11px] text-black/40 mt-0.5">{r.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Password Field (visual) */}
            <div>
              <label className="label text-[10px] text-black/50 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin123"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-black/25 mt-1.5">Please use admin123 to login</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="label text-[10px] text-white/25 hover:text-white/50 transition-colors">
            ← Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
