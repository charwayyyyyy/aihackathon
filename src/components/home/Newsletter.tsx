'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="section-padding bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-8">
              <Mail size={22} className="text-luxury" />
            </div>

            <h2 className="text-3xl md:text-4xl font-serif mb-4">Stay in the Loop</h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto text-[15px] leading-relaxed">
              Be the first to discover new collections, exclusive events, and behind-the-scenes content from Mensah.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-luxury/20 flex items-center justify-center">
                  <Check size={24} className="text-luxury" />
                </div>
                <p className="text-luxury font-medium">Welcome to the Mensah family.</p>
                <p className="text-white/30 text-sm">You&apos;ll receive our next update in your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-luxury/50 transition-colors rounded-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-white flex items-center justify-center gap-2 py-4 px-8 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            <p className="text-white/15 text-[10px] mt-6 uppercase tracking-widest">
              No spam, ever. Read our{' '}
              <a href="/privacy" className="underline hover:text-white/30 transition-colors">privacy policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
