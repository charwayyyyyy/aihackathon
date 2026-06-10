'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService, Campaign } from '@/services/campaignService';
import CampaignsTable from '@/components/admin/CampaignsTable';
import CampaignFormModal from '@/components/admin/CampaignFormModal';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCampaignsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: campaignService.getAllCampaigns,
  });

  const deleteMutation = useMutation({
    mutationFn: campaignService.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-serif">Campaigns</h1>
          <p className="text-sm text-black/50 mt-1">Manage promotional campaigns, banners, and collections.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-dark flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New Campaign
        </button>
      </motion.div>

      <div className="bg-white border border-black/5 rounded-lg overflow-hidden">
        <CampaignsTable 
          campaigns={campaigns || []} 
          isLoading={isLoading} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={editingCampaign}
      />
    </div>
  );
}
