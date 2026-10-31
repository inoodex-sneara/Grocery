import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartCurrency } from "./cartStore";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
  currency: CartCurrency;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((existing) => existing.id === item.id)
            ? state.items.map((existing) =>
                existing.id === item.id ? item : existing,
              )
            : [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleItem: (item) =>
        set((state) => ({
          items: state.items.some((existing) => existing.id === item.id)
            ? state.items.filter((existing) => existing.id !== item.id)
            : [...state.items, item],
        })),
    }),
    {
      name: "groca-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
