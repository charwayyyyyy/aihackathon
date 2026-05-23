'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Campaigns from '@/components/home/Campaigns';

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#F9F9F7]">
      <Navbar />
      <div className="pt-32 pb-16 text-center">
        <span className="text-luxury uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
          Current Season
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A]">
          Collections
        </h1>
      </div>
      <Campaigns />
      <Footer />
    </main>
  );
}
