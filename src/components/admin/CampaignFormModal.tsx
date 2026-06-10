import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ImageIcon, Trash2 } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateCampaignInput>({
    title: '',
    description: '',
    type: 'banner',
    status: 'draft',
    imageData: '',
    discountPercentage: null,
    targetProducts: [],
    startDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59.000Z',
    priority: 0
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        description: campaign.description,
        type: campaign.type,
        status: campaign.status,
        imageData: campaign.imageData,
        discountPercentage: campaign.discountPercentage ?? null,
        targetProducts: campaign.targetProducts,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        priority: campaign.priority
      });
      setImagePreview(campaign.imageData || '');
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'banner',
        status: 'draft',
        imageData: '',
        discountPercentage: null,
        targetProducts: [],
        startDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59.000Z',
        priority: 0
      });
      setImagePreview('');
    }
    setUploadError('');
  }, [campaign, isOpen]);

  const processFile = (file: File) => {
    setUploadError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    // Validate size (max 2MB for data URI storage)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB. Please compress or resize your image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      setImagePreview(dataUri);
      setFormData(prev => ({ ...prev, imageData: dataUri }));
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageData: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const mutation = useMutation({
    mutationFn: (data: CreateCampaignInput) => {
      if (isEditing) {
        return campaignService.updateCampaign(campaign.id, data);
      }
      return campaignService.createCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
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

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1">Campaign Image</label>
                  
                  {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-black/10 bg-neutral-50">
                      <img 
                        src={imagePreview} 
                        alt="Campaign preview" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
                            title="Replace image"
                          >
                            <Upload size={16} className="text-black" />
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                        Image uploaded
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                        ${isDragOver 
                          ? 'border-luxury bg-luxury/5' 
                          : 'border-black/10 hover:border-black/30 hover:bg-neutral-50'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-full ${isDragOver ? 'bg-luxury/10' : 'bg-neutral-100'}`}>
                          <ImageIcon size={24} className={isDragOver ? 'text-luxury' : 'text-black/30'} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black/60">
                            {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-black/30 mt-1">PNG, JPG, WebP up to 2MB</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploadError && (
                    <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                  )}
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
