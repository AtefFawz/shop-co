import { create } from "zustand";
import { Product } from "@/types";
import { products as allProducts } from "@/data/data";

interface FilterStore {
  products: Product[];
  currentType: string | null;

  filterByType: (type: string) => void; //
  filterBySection: (section: string) => void;
  resetFilter: () => void;
  filterPrice: (maxPrice: number) => void;
  // sec: string | null;
}

export const useFilterStore = create<FilterStore>()((set, get) => ({
  products: allProducts,
  currentType: null,
  filterByType: (type) => {
    set({
      currentType: type,
      products: allProducts.filter((item) => item.type === type),
    });
  },

  filterBySection: (section) => {
    const { currentType } = get();

    let filtered = allProducts;

    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    filtered = filtered.filter((item) => item.section === section);

    set({ products: filtered });
  },

  filterPrice: (maxPrice) => {
    const { currentType } = get();
    let filtered = allProducts;
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    filtered = filtered.filter((item) => item.price <= maxPrice);

    set({ products: filtered });
  },

  resetFilter: () => {
    set({ products: allProducts, currentType: null });
  },
}));
