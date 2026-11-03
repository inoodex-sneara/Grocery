import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartCurrency = "USD" | "BDT";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit?: string;
  currency: CartCurrency;
}

export interface CartState {
  items: CartItem[];
  lastAddedItem: { eventId: number; image: string } | null;
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      lastAddedItem: null,
      isDrawerOpen: false,

      addItem: (item) =>
        set((state) => {
          const index = state.items.findIndex((existing) => existing.id === item.id);
          return {
            items:
              index < 0
                ? [...state.items, { ...item, quantity: item.quantity ?? 1 }]
                : state.items.map((existing, i) =>
                    i === index
                      ? {
                          ...existing,
                          quantity: existing.quantity + (item.quantity ?? 1),
                        }
                      : existing,
                  ),
            lastAddedItem: {
              eventId: (state.lastAddedItem?.eventId ?? 0) + 1,
              image: item.image,
            },
          };
        }),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    }),
    {
      name: "groca-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
