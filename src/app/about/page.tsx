'use client';

import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Gem, Scissors, Globe, Heart } from 'lucide-react';

const values = [
  {
    icon: Scissors,
    title: 'Master Craftsmanship',
    description: 'Every piece is meticulously handcrafted by our master tailors with decades of experience.',
  },
  {
    icon: Gem,
    title: 'Premium Materials',
    description: 'We source only the finest fabrics from world-renowned mills across the globe.',
  },
  {
    icon: Globe,
    title: 'Cultural Heritage',
    description: 'Blending traditional Ghanaian artistry with contemporary global fashion sensibilities.',
  },
  {
    icon: Heart,
    title: 'Sustainable Practice',
    description: 'Committed to ethical sourcing and sustainable production methods.',
  },
];

export default function AboutPage() {
  const { data: merchant, isLoading } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  const title = merchant?.aboutTitle || 'The Heritage of Mensah';
  const subtitle = merchant?.aboutSubtitle || 'Born from a passion for exquisite tailoring, Mensah represents the pinnacle of luxury menswear.';
  const story = merchant?.aboutStory || 'Our master tailors bring decades of experience to every cut, stitch, and finish. We source only the finest fabrics from world-renowned mills.';
  const quote = merchant?.aboutQuote || 'We don\'t just make clothes. We create confidence, preserve culture, and craft legacy.';

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 md:pt-40 pb-16 bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">About</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="label text-luxury mb-3 block">Our Story</span>
            {isLoading ? (
              <>
                <div className="skeleton h-12 w-3/4 mb-6" />
                <div className="skeleton h-20 w-full" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-serif mb-6">{title}</h1>
                <p className="text-black/50 text-lg leading-relaxed">{subtitle}</p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] bg-neutral-100 overflow-hidden"
            >
              <Image
                src="/kaftan3.webp"
                alt="Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="divider" />
              <h2 className="text-3xl md:text-4xl font-serif">The Art of Tailoring</h2>
              {isLoading ? (
                <div className="skeleton h-24 w-full" />
              ) : (
                <p className="text-black/50 leading-relaxed">{story}</p>
              )}
              <Link href="/shop" className="btn btn-primary inline-flex py-3 px-8 mt-4">
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="label text-luxury mb-3 block">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-serif">What We Stand For</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="text-center p-6"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-luxury/10 flex items-center justify-center">
                    <Icon size={22} className="text-luxury" />
                  </div>
                  <h3 className="font-serif text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-padding bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {isLoading ? (
              <div className="skeleton bg-white/10 h-16 w-full mb-8" />
            ) : (
              <h2 className="text-2xl md:text-4xl font-serif italic leading-relaxed mb-8">
                &ldquo;{quote}&rdquo;
              </h2>
            )}
            <div className="flex justify-center items-center gap-4">
              <div className="w-10 h-[1px] bg-white/20" />
              <span className="label text-white/30">{merchant?.name || 'Mensah'} Founder</span>
              <div className="w-10 h-[1px] bg-white/20" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
      <WhatsAppButton />
    </main>
  );
}
