'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  {
    name: 'Suits & Blazers',
    description: 'Impeccably tailored for every occasion',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop',
    href: '/shop?category=suits',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    name: 'Formal Shirts',
    description: 'Refined details, perfect fit',
    image: 'https://images.unsplash.com/photo-1598411037848-9cda9ec7c39f?q=80&w=1000&auto=format&fit=crop',
    href: '/shop?category=shirts',
    span: '',
  },
  {
    name: 'Accessories',
    description: 'Complete the look',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop',
    href: '/shop?category=accessories',
    span: '',
  },
];

export default function Categories() {
  return (
    <section className="section-padding bg-[var(--surface-muted)]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4"
        >
          <div>
            <span className="label text-luxury mb-3 block">Browse</span>
            <h2 className="text-3xl md:text-4xl font-serif">Shop by Category</h2>
          </div>
          <Link
            href="/shop"
            className="label text-black/50 hover:text-luxury border-b border-black/20 hover:border-luxury pb-1 transition-all duration-300"
          >
            View All
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden bg-neutral-200 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2 h-[400px] md:h-[500px] lg:h-auto' : 'h-[280px] md:h-[320px]'
              }`}
            >
              <Link href={category.href} className="block absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8 text-white">
                  <span className="label text-white/60 mb-2">{category.description}</span>
                  <h3 className={`font-serif mb-3 ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                    {category.name}
                  </h3>
                  <span className="label text-white/70 border-b border-white/30 pb-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    Explore →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
