import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

/** Persisted wishlist, shared by product cards, navigation, and the wishlist page. */
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (product) =>
        set((state) => ({
          items: state.items.some((item) => item._id === product._id)
            ? state.items.filter((item) => item._id !== product._id)
            : [...state.items, product],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "shopco-wishlist",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        const persisted = persistedState as { items?: unknown } | undefined;
        return {
          items: Array.isArray(persisted?.items)
            ? persisted.items.filter(
                (item): item is Product =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof (item as Product)._id === "string",
              )
            : [],
        } as WishlistStore;
      },
    },
  ),
);
