'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { data: merchant, isLoading } = useQuery({
    queryKey: ['merchant'],
    queryFn: () => merchantService.getMerchant('mensah'),
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const title = merchant?.contactTitle || 'Contact Us';
  const subtitle = merchant?.contactSubtitle || 'Whether you are looking to schedule a fitting, inquire about our bespoke services, or simply say hello, our team is here to assist you.';

  const handleSendMessage = () => {
    if (!formData.name || !formData.message) {
      alert('Please provide at least your name and a message.');
      return;
    }

    const whatsappNumber = merchant?.whatsapp_number || '233592696949';
    
    const message = `*New Inquiry via Mensah Storefront*
----------------------------------------
*Name:* ${formData.name}
*Email:* ${formData.email || 'Not provided'}
*Message:*
${formData.message}
----------------------------------------
_Sent from Contact Page_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="text-luxury uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
              Get in Touch
            </span>
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="skeleton h-12 w-64 mb-6" />
                <div className="skeleton h-16 w-full max-w-2xl" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-8">
                  {title}
                </h1>
                <p className="text-black/60 max-w-2xl mx-auto leading-relaxed text-lg">
                  {subtitle}
                </p>
              </>
            )}
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
              
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="skeleton w-6 h-6 rounded-full" />
                      <div className="space-y-2">
                        <div className="skeleton h-5 w-24" />
                        <div className="skeleton h-4 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-luxury mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                      <p className="text-black/60 leading-relaxed whitespace-pre-line">
                        {merchant?.location || '123 Savile Row\nLondon, W1S 3PR\nUnited Kingdom'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="text-luxury mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Call Us</h3>
                      <p className="text-black/60">
                        {merchant?.whatsapp_number ? `+${merchant.whatsapp_number}` : '+44 (0) 20 7123 4567'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="text-luxury mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email Us</h3>
                      <p className="text-black/60">
                        {merchant?.email || 'inquiries@mensah.com'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 md:p-10"
            >
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury transition-colors resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <button 
                  type="button"
                  onClick={handleSendMessage}
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
