import { create } from "zustand";
import { data } from "@/lib/api";
import { Product } from "@/types";

interface FilterStore {
  products: Product[];
  filterBySection: (section: string) => void;
  resetFilter: () => void;
  filterPrice?: (maxPrice: number) => void;
}
export const useFilterStore = create<FilterStore>()((set) => ({
  products: data,
  filterBySection: (section) => {
    set({ products: data.filter((item) => item.section === section) });
  },
  resetFilter: () => {
    set({ products: data });
  },
  filterPrice: (newValue: number) => {
    set({
      products: data.filter((item) => item.price <= newValue),
    });
  },
}));
