import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'discount' | 'collection' | 'hero';
  status: 'draft' | 'active' | 'expired';
  imageUrl: string;
  discountPercentage?: number | null;
  targetProducts: string[];
  startDate: string;
  endDate: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateCampaignInput = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCampaignInput = Partial<CreateCampaignInput>;

const api = axios.create({
  baseURL: `${API_URL}/campaigns`,
});

export const campaignService = {
  // Public
  getActiveCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/');
    return data;
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    const { data } = await api.get(`/${id}`);
    return data;
  },

  // Admin
  getAllCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/admin/all');
    return data;
  },

  createCampaign: async (campaignData: CreateCampaignInput): Promise<Campaign> => {
    const { data } = await api.post('/', campaignData);
    return data;
  },

  updateCampaign: async (id: string, campaignData: UpdateCampaignInput): Promise<Campaign> => {
    const { data } = await api.put(`/${id}`, campaignData);
    return data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  }
};
