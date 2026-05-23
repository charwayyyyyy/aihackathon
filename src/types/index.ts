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
  brand_colors: string[];
  whatsapp_number: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link?: string;
  is_active: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}
