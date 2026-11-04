import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

type CompareState = { items: Product[]; toggle: (product: Product) => void; remove: (id: string) => void; clear: () => void };
export const useCompareStore = create<CompareState>()(persist((set) => ({
  items: [],
  toggle: (product) => set((state) => state.items.some((item) => item._id === product._id)
    ? { items: state.items.filter((item) => item._id !== product._id) }
    : state.items.length >= 4 ? state : { items: [...state.items, product] }),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
  clear: () => set({ items: [] }),
}), { name: "shopco-compare", storage: createJSONStorage(() => localStorage), version: 1 }));
