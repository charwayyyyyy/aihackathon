export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors?: string[];
  details?: string[];
  stock?: number;
}

export interface Merchant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  whatsapp_number: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutStory?: string;
  aboutQuote?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  email?: string;
  location?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link?: string;
  is_active: boolean;
  type?: string;
  discountPercentage?: number | null;
  priority?: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}
