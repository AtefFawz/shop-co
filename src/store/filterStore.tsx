import { create } from "zustand";
// import { data } from "@/lib/api";
import { Product } from "@/types";
import { products } from "@/data/data";
interface FilterStore {
  products: Product[];
  filterBySection: (section: string) => void;
  resetFilter: () => void;
  filterPrice?: (maxPrice: number) => void;
}
export const useFilterStore = create<FilterStore>()((set) => ({
  products: products,
  filterBySection: (section) => {
    set({ products: products.filter((item) => item.section === section) });
  },
  resetFilter: () => {
    set({ products: products });
  },
  filterPrice: (newValue: number) => {
    set({
      products: products.filter((item) => item.price <= newValue),
    });
  },
}));
