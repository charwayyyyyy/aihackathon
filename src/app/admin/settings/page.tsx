'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Settings, Shield, Globe, Bell, Palette, Store, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

// Fetch settings
const fetchSettings = async () => {
  const { data } = await axios.get('/api/settings');
  return data;
};

// Update settings
const updateSettings = async (updates: any) => {
  const { data } = await axios.put('/api/settings', updates);
  return data;
};

export default function AdminSettingsPage() {
  const { role } = useAuthStore();
  const canEdit = role === 'admin';
  const queryClient = useQueryClient();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      // Invalidate merchant cache to update frontend everywhere
      queryClient.invalidateQueries({ queryKey: ['merchant'] }); 
      setEditingKey(null);
    },
  });

  const handleEditClick = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleSaveClick = (key: string) => {
    mutation.mutate({ [key]: editValue });
  };

  const handleCancelClick = () => {
    setEditingKey(null);
    setEditValue('');
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="skeleton h-8 w-48 mb-8" />
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton h-40 w-full" />
        ))}
      </div>
    );
  }

  // Fallback to defaults if settings are undefined for some reason
  const s = settings || {};

  const settingSections = [
    {
      icon: Store,
      title: 'Store Information',
      description: 'Manage your store name, description, and branding.',
      items: [
        { label: 'Store Name', key: 'storeName', value: s.storeName || 'Mensah' },
        { label: 'Tagline', key: 'tagline', value: s.tagline || 'Luxury Tailored Menswear' },
        { label: 'Currency', key: 'currency', value: s.currency || 'GHS (Ghanaian Cedi)' },
      ],
    },
    {
      icon: Globe,
      title: 'Contact & Social',
      description: 'Update contact details and social media links.',
      items: [
        { label: 'WhatsApp', key: 'whatsapp', value: s.whatsapp || '+233 59 269 6949' },
        { label: 'Email', key: 'email', value: s.email || 'info@mensah.com' },
        { label: 'Location', key: 'location', value: s.location || 'Accra, Ghana' },
      ],
    },
    {
      icon: Shield,
      title: 'Access Control',
      description: 'Manage roles and permissions.',
      items: [
        { label: 'Your Role', key: 'role_ro', value: role.charAt(0).toUpperCase() + role.slice(1), readonly: true },
        { label: 'Available Roles', key: 'roles_ro', value: 'Admin, Staff, Viewer', readonly: true },
        { label: 'Login Method', key: 'login_ro', value: 'Logo Click → Role Select', readonly: true },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure order and campaign alerts.',
      items: [
        { label: 'New Order Alerts', key: 'newOrderAlerts', value: s.newOrderAlerts || 'WhatsApp redirect' },
        { label: 'Campaign Expiry', key: 'campaignExpiry', value: s.campaignExpiry || 'Auto-status update' },
        { label: 'Low Stock Alerts', key: 'lowStockAlerts', value: s.lowStockAlerts || 'Dashboard indicator' },
      ],
    },
    {
      icon: Palette,
      title: 'Theme & Appearance',
      description: 'Customize the look and feel of your storefront.',
      items: [
        { label: 'Brand Color', key: 'brandColor', value: s.brandColor || '#B8860B (Luxury Gold)' },
        { label: 'Font', key: 'font', value: s.font || 'Playfair Display / Inter' },
        { label: 'Style', key: 'style', value: s.style || 'Luxury Minimalist' },
      ],
    },
    {
      icon: Store,
      title: 'About Page Content',
      description: 'Edit the content displayed on the About Us page.',
      items: [
        { label: 'Title', key: 'aboutTitle', value: s.aboutTitle || 'The Heritage of Mensah' },
        { label: 'Subtitle', key: 'aboutSubtitle', value: s.aboutSubtitle || 'Born from a passion...' },
        { label: 'Story', key: 'aboutStory', value: s.aboutStory || 'Our master tailors...' },
        { label: 'Quote', key: 'aboutQuote', value: s.aboutQuote || 'We don\'t just make clothes...' },
      ],
    },
    {
      icon: Globe,
      title: 'Contact Page Content',
      description: 'Edit the headings displayed on the Contact Us page.',
      items: [
        { label: 'Title', key: 'contactTitle', value: s.contactTitle || 'Contact Us' },
        { label: 'Subtitle', key: 'contactSubtitle', value: s.contactSubtitle || 'Whether you are looking...' },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-serif">Settings</h1>
          <p className="text-sm text-black/50 mt-1">Configure your store preferences and account.</p>
        </div>
        <Link
          href="/"
          className="label text-[10px] text-black/30 hover:text-luxury border border-black/10 px-4 py-2 rounded-sm hover:border-luxury transition-all"
        >
          View Store →
        </Link>
      </motion.div>

      <div className="space-y-6">
        {settingSections.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.05 }}
              className="bg-white border border-black/5 rounded-sm overflow-hidden"
            >
              <div className="p-5 border-b border-black/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center">
                  <Icon size={18} className="text-black/40" />
                </div>
                <div>
                  <h2 className="font-serif text-[15px]">{section.title}</h2>
                  <p className="text-[11px] text-black/35">{section.description}</p>
                </div>
              </div>
              <div className="divide-y divide-black/5">
                {section.items.map((item) => (
                  <div key={item.key} className="px-5 py-4 flex items-center justify-between group">
                    <span className="text-[13px] text-black/50 w-1/3">{item.label}</span>
                    
                    <div className="flex-1 flex justify-end">
                      {editingKey === item.key ? (
                        <div className="flex items-center gap-2 w-full max-w-sm">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-[13px] border border-black/20 rounded-sm focus:outline-none focus:border-luxury transition-colors"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveClick(item.key);
                              if (e.key === 'Escape') handleCancelClick();
                            }}
                          />
                          <button
                            onClick={() => handleSaveClick(item.key)}
                            disabled={mutation.isPending}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-sm transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            disabled={mutation.isPending}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <span className="text-[13px] font-medium text-right">{item.value}</span>
                          {canEdit && !('readonly' in item && item.readonly) && (
                            <button
                              onClick={() => handleEditClick(item.key, item.value)}
                              className="text-[10px] label text-luxury opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 hover:bg-luxury/5 rounded-sm"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {!canEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-amber-50 border border-amber-200/50 rounded-sm p-4 flex items-start gap-3"
        >
          <Settings size={18} className="text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Read-only access</p>
            <p className="text-[12px] text-amber-600/80">You need Admin role to modify settings. Contact your store administrator.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
