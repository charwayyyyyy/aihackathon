import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Order = {
  id: string;
  items: any[];
  total: number;
  customer: {
    name: string;
    phone: string;
    location: string;
  };
  createdAt: string;
};

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: 'order-storage', // Persist orders to localStorage
    }
  )
);
