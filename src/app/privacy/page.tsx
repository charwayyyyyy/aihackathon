'use client';

import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-36 md:pt-40 pb-16 bg-[var(--surface-muted)]">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/35 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black/70">Privacy Policy</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Privacy Policy</h1>
            <p className="text-black/40 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-neutral prose-sm max-w-none space-y-10 text-black/60 leading-relaxed">
            <div>
              <h2 className="text-xl font-serif text-black mb-4">1. Information We Collect</h2>
              <p>
                At Mensah, we are committed to protecting your privacy. When you interact with our platform, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and delivery address provided during checkout or contact.</li>
                <li><strong>Order Information:</strong> Products purchased, sizes selected, order values, and transaction history.</li>
                <li><strong>Device Information:</strong> Browser type, device type, IP address, and browsing behavior on our website.</li>
                <li><strong>Communication Data:</strong> Messages exchanged via our WhatsApp checkout channel.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">2. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Processing and fulfilling your orders</li>
                <li>Communicating order updates and delivery information</li>
                <li>Providing personalized product recommendations</li>
                <li>Sending newsletters and promotional content (with your consent)</li>
                <li>Improving our website experience and product offerings</li>
                <li>Preventing fraud and ensuring platform security</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">3. Data Storage & Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal data. Your information is stored securely
                and we use encryption for data transmission. We retain your data only for as long as necessary to fulfill the purposes
                outlined in this policy or as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">4. Third-Party Services</h2>
              <p>We may share your information with trusted third parties who assist in operating our business:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>WhatsApp (Meta):</strong> Used for order processing and customer communication</li>
                <li><strong>Delivery Services:</strong> Shipping partners for order fulfillment</li>
                <li><strong>Analytics:</strong> Website analytics to improve user experience</li>
              </ul>
              <p className="mt-3">We do not sell your personal information to any third parties.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">5. Cookies</h2>
              <p>
                Our website uses cookies and local storage to enhance your browsing experience. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Essential Cookies:</strong> Required for cart functionality and site operation</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">7. Children&apos;s Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 16. We do not knowingly collect personal
                information from children. If we become aware that we have collected data from a child, we will take steps
                to delete that information promptly.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any significant changes by
                posting the updated policy on this page with a revised &quot;Last updated&quot; date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-black mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-1 mt-3">
                <li>Email: <a href="mailto:inquiries@mensah.com" className="text-luxury hover:underline">inquiries@mensah.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/233592696949" className="text-luxury hover:underline">+233 592 696 949</a></li>
                <li>Visit: <Link href="/contact" className="text-luxury hover:underline">Contact Page</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
