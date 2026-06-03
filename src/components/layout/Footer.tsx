'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';


export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Don't render on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif mb-5 tracking-tighter">MENSAH</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Crafting timeless elegance for the modern gentleman.
              Our commitment to excellence is woven into every stitch.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/30 hover:text-luxury transition-colors duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-white/30 hover:text-luxury transition-colors duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-white/30 hover:text-luxury transition-colors duration-300" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label text-white mb-5">Shopping</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="/shop" className="hover:text-luxury transition-colors duration-300">All Products</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-luxury transition-colors duration-300">New Arrivals</Link></li>
              <li><Link href="/collections" className="hover:text-luxury transition-colors duration-300">Collections</Link></li>
              <li><Link href="/campaign" className="hover:text-luxury transition-colors duration-300">Campaigns</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="label text-white mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="/contact" className="hover:text-luxury transition-colors duration-300">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-luxury transition-colors duration-300">About Mensah</Link></li>
              <li><Link href="/privacy" className="hover:text-luxury transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="label text-white mb-5">Stay Connected</h4>
            <p className="text-sm text-white/40 mb-5">
              Join our newsletter for exclusive access to new collections and events.
            </p>
            {subscribed ? (
              <div className="animate-fade-in-up">
                <p className="text-luxury text-sm font-medium">Thank you for subscribing!</p>
                <p className="text-white/30 text-xs mt-1">You&apos;ll hear from us soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="bg-transparent border-b border-white/20 py-2 flex-1 text-sm focus:border-luxury outline-none transition-colors placeholder:text-white/20"
                />
                <button
                  type="submit"
                  className="border-b border-white/20 py-2 px-4 text-[10px] uppercase tracking-[0.15em] font-bold hover:text-luxury hover:border-luxury transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-white/25">
          <p>© {new Date().getFullYear()} Mensah. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
