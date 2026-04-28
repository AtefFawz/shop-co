import { Product } from "@/types";
import { create } from "zustand";

interface FilterStore {
  allProducts: Product[];
  filteredProducts: Product[];
  currentType: string | null;

  // Actions
  setInitialProducts: (data: Product[]) => void;
  filterByType: (type: string) => void;
  filterBySection: (section: string) => void;
  filterPrice: (maxPrice: number) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  currentType: null,

  setInitialProducts: (data) => {
    const { currentType } = get();

    let initialFiltered = data;

    if (currentType) {
      initialFiltered = data.filter((item) => item.type === currentType);
    }
    set({
      allProducts: data,
      filteredProducts: initialFiltered,
    });
  },

  filterByType: (type) => {
    const { allProducts } = get();
    set({
      currentType: type,
      filteredProducts: allProducts.filter(
        (item) => item.type?.toUpperCase() === type.toUpperCase(),
      ),
    });
  },

  filterBySection: (section) => {
    const { allProducts, currentType } = get();
    let filtered = allProducts;
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }
    set({
      filteredProducts: filtered.filter((item) => item.section === section),
    });
  },

  filterPrice: (maxPrice) => {
    const { allProducts, currentType } = get();
    let filtered = allProducts;
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }
    set({
      filteredProducts: filtered.filter((item) => item.price <= maxPrice),
    });
  },

  resetFilter: () => {
    const { allProducts } = get();
    set({ filteredProducts: allProducts, currentType: null });
  },
}));
