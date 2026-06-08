import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService, Campaign, CreateCampaignInput } from '@/services/campaignService';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

export default function CampaignFormModal({ isOpen, onClose, campaign }: CampaignFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!campaign;

  const [formData, setFormData] = useState<CreateCampaignInput>({
    title: '',
    description: '',
    type: 'banner',
    status: 'draft',
    imageUrl: '',
    discountPercentage: null,
    targetProducts: [],
    startDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59.000Z',
    priority: 0
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        description: campaign.description,
        type: campaign.type,
        status: campaign.status,
        imageUrl: campaign.imageUrl,
        discountPercentage: campaign.discountPercentage,
        targetProducts: campaign.targetProducts,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        priority: campaign.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'banner',
        status: 'draft',
        imageUrl: '',
        discountPercentage: null,
        targetProducts: [],
        startDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59.000Z',
        priority: 0
      });
    }
  }, [campaign, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: CreateCampaignInput) => {
      if (isEditing) {
        return campaignService.updateCampaign(campaign.id, data);
      }
      return campaignService.createCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' || name === 'priority' ? Number(value) : value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-white rounded-lg z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-serif">{isEditing ? 'Edit Campaign' : 'Create Campaign'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="campaign-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1">Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury">
                      <option value="banner">Banner</option>
                      <option value="hero">Hero</option>
                      <option value="discount">Discount</option>
                      <option value="collection">Collection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury">
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1">Image URL</label>
                  <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://" className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">Discount % (Optional)</label>
                    <input name="discountPercentage" type="number" value={formData.discountPercentage || ''} onChange={handleChange} min="0" max="100" className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">Priority (Higher shows first)</label>
                    <input name="priority" type="number" value={formData.priority} onChange={handleChange} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">Start Date</label>
                    <input name="startDate" type="datetime-local" value={formData.startDate.slice(0, 16)} onChange={(e) => setFormData({...formData, startDate: new Date(e.target.value).toISOString()})} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/60 mb-1">End Date</label>
                    <input name="endDate" type="datetime-local" value={formData.endDate.slice(0, 16)} onChange={(e) => setFormData({...formData, endDate: new Date(e.target.value).toISOString()})} className="w-full border border-black/10 rounded-md p-2 text-sm focus:outline-none focus:border-luxury" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-black/5 bg-neutral-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-black/10 rounded-md text-sm font-medium hover:bg-black/5 transition-colors">
                Cancel
              </button>
              <button type="submit" form="campaign-form" disabled={mutation.isPending} className="btn btn-dark text-sm px-6 py-2">
                {mutation.isPending ? 'Saving...' : 'Save Campaign'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
