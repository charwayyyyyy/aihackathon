import axios from 'axios';
import { Product, Merchant, Campaign } from '@/types';

const API_BASE_URL = 'https://api-hackathon.codedematrixtech.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
  },
});

const mapImageUrls = (urls: string[] | undefined | null) => {
  if (!urls || urls.length === 0) return ['/kaftan.webp'];
  return urls.map(url => url.startsWith('/') ? `${API_BASE_URL}${url}` : url);
};

const mapCampaignImageUrl = (urls: string[] | undefined | null) => {
  if (!urls || urls.length === 0) return '/kaftan2.webp';
  const url = urls[0];
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
};

export const merchantService = {
  getMerchant: async (id: string = 'mensah'): Promise<Merchant> => {
    try {
      const [externalResult, settingsResult] = await Promise.allSettled([
        api.get(`/merchants/${id}`),
        axios.get('/api/settings')
      ]);

      let data: any = {};
      if (externalResult.status === 'fulfilled') {
        data = externalResult.value.data;
      }

      // Map logo_url if it's relative
      if (data.logo_url && data.logo_url.startsWith('/')) {
        data.logo_url = `${API_BASE_URL}${data.logo_url}`;
      }

      // Override with local settings if available
      if (settingsResult.status === 'fulfilled') {
        const settings = settingsResult.value.data;
        // Strip any formatting from whatsapp (like '+' or spaces) to make it an ID/number
        const rawWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');
        data.whatsapp_number = rawWhatsApp || '233592696949';
        
        // Also we can pass other settings via merchant object if needed by frontend
        data.name = settings.storeName;
        data.description = settings.tagline;
        data.currency = settings.currency;
        data.email = settings.email;
        data.location = settings.location;

        // Pass through page content fields
        data.aboutTitle = settings.aboutTitle;
        data.aboutSubtitle = settings.aboutSubtitle;
        data.aboutStory = settings.aboutStory;
        data.aboutQuote = settings.aboutQuote;
        
        data.contactTitle = settings.contactTitle;
        data.contactSubtitle = settings.contactSubtitle;
      } else {
        if (!data.whatsapp_number || data.whatsapp_number.trim() === "") {
          data.whatsapp_number = "233592696949";
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching merchant:', error);
      return {
        id: id,
        name: 'Mensah',
        description: 'Luxury Tailored Menswear',
        currency: 'GHS',
        logo_url: '/mensah.png',
        brand_colors: ['#000000', '#ffffff'],
        whatsapp_number: '233592696949',
      } as Merchant;
    }
  },
};

export const productService = {
  getProducts: async (merchantId: string = 'mensah'): Promise<Product[]> => {
    try {
      const response = await api.get(`/merchants/${merchantId}/items`);
      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || 'Premium tailored menswear crafted with excellence.',
        price: item.price_minor / 100, // Convert minor units to major
        images: mapImageUrls(item.image_urls),
        category: 'Apparel',
        sizes: ['40R', '42R', '44R', '46R'],
        details: [
          'Premium Fabric',
          'Hand-finished details',
          'Tailored fit',
        ],
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
      description: item.description || 'Premium tailored menswear crafted with excellence.',
      price: item.price_minor / 100, // Convert minor units to major
      images: mapImageUrls(item.image_urls),
      category: 'Apparel',
      sizes: ['40R', '42R', '44R', '46R'],
      details: [
        'Premium Fabric',
        'Hand-finished details',
        'Tailored fit',
      ],
      stock: item.in_stock ? 10 : 0
    };
  },
};

export const campaignService = {
  getCampaigns: async (merchantId: string = 'mensah'): Promise<Campaign[]> => {
    try {
      // Fetch from both sources in parallel
      const [externalResult, internalResult] = await Promise.allSettled([
        api.get(`/merchants/${merchantId}/campaigns`),
        axios.get('/api/campaigns')
      ]);

      const campaigns: Campaign[] = [];

      // Process external API campaigns
      if (externalResult.status === 'fulfilled') {
        const externalCampaigns = externalResult.value.data.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.copy_text || 'Experience the new collection.',
          image_url: mapCampaignImageUrl(campaign.image_urls),
          is_active: true
        }));
        campaigns.push(...externalCampaigns);
      }

      // Process internal API (admin-created) campaigns
      if (internalResult.status === 'fulfilled') {
        const internalCampaigns = internalResult.value.data.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description || 'Experience the new collection.',
          image_url: campaign.imageData || '/kaftan2.webp',
          link: '/shop',
          is_active: campaign.status === 'active',
          // Carry through extra fields for the banner/hero components
          type: campaign.type,
          discountPercentage: campaign.discountPercentage,
          priority: campaign.priority || 0,
        }));
        campaigns.push(...internalCampaigns);
      }

      // Sort by priority (higher first) — campaigns without priority default to 0
      campaigns.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));

      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },
};

export default api;
