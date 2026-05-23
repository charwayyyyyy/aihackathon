'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  {
    name: 'Suits',
    image: '/kaftan.webp',
    href: '/shop?category=suits'
  },
  {
    name: 'Shirts',
    image: '/kaftan2.webp',
    href: '/shop?category=shirts'
  },
  {
    name: 'Accessories',
    image: '/kaftan3.webp',
    href: '/shop?category=accessories'
  }
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-serif mb-4">Shop by Category</h2>
            <div className="w-20 h-1 bg-luxury" />
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-luxury hover:border-luxury transition-all">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative h-[600px] overflow-hidden bg-gray-100"
            >
              <Link href={category.href}>
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-serif mb-4">{category.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] border border-white px-6 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Explore
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
