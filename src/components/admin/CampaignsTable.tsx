import { Campaign } from '@/services/campaignService';
import { Edit2, Trash2, ImageIcon } from 'lucide-react';

interface CampaignsTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export default function CampaignsTable({ campaigns, isLoading, onEdit, onDelete }: CampaignsTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-black/50">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="p-8 text-center text-black/50">No campaigns found. Create one to get started.</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-black/5 bg-neutral-50/50">
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Image</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Title</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Type</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Discount</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider">Date Range</th>
            <th className="p-4 text-xs font-medium text-black/40 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-black/5 hover:bg-neutral-50/50 transition-colors">
              <td className="p-4">
                {campaign.imageData ? (
                  <img 
                    src={campaign.imageData} 
                    alt={campaign.title} 
                    className="w-12 h-12 object-cover rounded-md border border-black/5"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center">
                    <ImageIcon size={16} className="text-black/20" />
                  </div>
                )}
              </td>
              <td className="p-4 font-medium">{campaign.title}</td>
              <td className="p-4 capitalize">{campaign.type}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </td>
              <td className="p-4">{campaign.discountPercentage ? `${campaign.discountPercentage}%` : '-'}</td>
              <td className="p-4 text-xs text-black/60">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(campaign)}
                    className="p-1.5 hover:bg-black/5 rounded-md text-black/40 hover:text-black transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(campaign.id)}
                    className="p-1.5 hover:bg-red-50 rounded-md text-black/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
