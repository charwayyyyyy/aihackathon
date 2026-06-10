import axios from 'axios';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'discount' | 'collection' | 'hero';
  status: 'draft' | 'active' | 'expired';
  imageData: string; // base64 data URI or external URL
  discountPercentage?: number | null;
  targetProducts: string[];
  startDate: string;
  endDate: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  type: 'banner' | 'discount' | 'collection' | 'hero';
  status: 'draft' | 'active' | 'expired';
  imageData: string;
  discountPercentage?: number | null;
  targetProducts: string[];
  startDate: string;
  endDate: string;
  priority: number;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

// Use internal Next.js API route — works both locally and on Vercel
const api = axios.create({
  baseURL: '/api/campaigns',
});

export const campaignService = {
  // Public: get active campaigns
  getActiveCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/');
    return data;
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    const { data } = await api.get(`/${id}`);
    return data;
  },

  // Admin: get ALL campaigns
  getAllCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/', { params: { all: 'true' } });
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
