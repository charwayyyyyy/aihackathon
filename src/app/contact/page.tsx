'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="text-luxury uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-8">
              Contact Us
            </h1>
            <p className="text-black/60 max-w-2xl mx-auto leading-relaxed text-lg">
              Whether you are looking to schedule a fitting, inquire about our bespoke services, or simply say hello, our team is here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-3xl font-serif mb-6">Our Atelier</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-luxury mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                    <p className="text-black/60 leading-relaxed">
                      123 Savile Row<br />
                      London, W1S 3PR<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="text-luxury mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                    <p className="text-black/60">
                      +44 (0) 20 7123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="text-luxury mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <p className="text-black/60">
                      inquiries@mensah.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 md:p-10"
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="button"
                  className="w-full bg-black text-white uppercase tracking-widest text-sm font-bold py-4 hover:bg-luxury transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
