import { create } from 'zustand';

export type Role = "admin" | "staff" | "viewer";

interface AuthState {
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "viewer", // Starts as viewer, admin unlocks via Logo
  setRole: (role) => set({ role }),
  logout: () => set({ role: "viewer" }),
}));
