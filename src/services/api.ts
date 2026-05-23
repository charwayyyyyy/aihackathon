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
    try {
      const response = await api.get(`/merchants/${merchantId}/items`);
      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price_minor, 
        images: item.image_urls || ['/kaftan.webp'],
        category: 'Apparel',
        sizes: ['40R', '42R', '44R'],
        stock: item.in_stock ? 10 : 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/items/${id}`);
    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price_minor,
      images: item.image_urls || ['/kaftan.webp'],
      category: 'Apparel',
      sizes: ['40R', '42R', '44R'],
      stock: item.in_stock ? 10 : 0
    };
  },
};

export const campaignService = {
  getCampaigns: async (merchantId: string = 'mensah'): Promise<Campaign[]> => {
    try {
      const response = await api.get(`/merchants/${merchantId}/campaigns`);
      return response.data.map((campaign: any) => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.copy_text || '',
        image_url: (campaign.image_urls && campaign.image_urls.length > 0) 
            ? campaign.image_urls[0] 
            : '/kaftan2.webp',
        is_active: true
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },
};

export default api;
