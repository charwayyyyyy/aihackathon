import axios from 'axios';
import { Product, Merchant, Campaign } from '@/types';

const API_BASE_URL = 'https://api-hackathon.codedematrixtech.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
  },
});

export const merchantService = {
  getMerchant: async (id: string = 'mensah'): Promise<Merchant> => {
    const response = await api.get(`/merchants/${id}`);
    return response.data;
  },
};

export const productService = {
  getProducts: async (merchantId: string = 'mensah'): Promise<Product[]> => {
    // Assuming products are under the merchant
    // If this fails, we might need to adjust based on the actual API structure
    try {
      const response = await api.get(`/merchants/${merchantId}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback or return empty array
      return [];
    }
  },
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

export const campaignService = {
  getCampaigns: async (merchantId: string = 'mensah'): Promise<Campaign[]> => {
    try {
      const response = await api.get(`/merchants/${merchantId}/campaigns`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },
};

export default api;
