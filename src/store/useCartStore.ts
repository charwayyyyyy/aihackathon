import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
export interface Order {
  id: string;
  date: string;
  status: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    location: string;
  };
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  addItem: (product: Product, selectedSize: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: Order['customer']) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      addItem: (product, selectedSize, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedSize === selectedSize
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, selectedSize, quantity }],
          });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        });
      },
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      placeOrder: (customer) => {
        const { items, getTotalPrice, orders } = get();
        if (items.length === 0) return;
        
        const newOrder: Order = {
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toISOString(),
          status: 'Pending WhatsApp Confirmation',
          items: [...items],
          total: getTotalPrice(),
          customer
        };
        
        set({ 
          orders: [newOrder, ...orders],
          items: [] 
        });
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'mensah-cart-storage',
    }
  )
);
