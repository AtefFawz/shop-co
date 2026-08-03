import { Product } from "@/types";
import { create } from "zustand";

interface FilterStore {
  allProducts: Product[];
  filteredProducts: Product[];
  currentType: string | null;
  currentSection: string | null;

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
  currentSection: null,

  setInitialProducts: (data) => {
    const { currentType, currentSection } = get();
    let initialFiltered = data;

    if (currentType) {
      initialFiltered = data.filter((item) => item.type === currentType);
    }

    if (currentSection) {
      initialFiltered = initialFiltered.filter(
        (item) => item.section === currentSection,
      );
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

    // If a type is selected, filter by that type first
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    // Then filter by section if provided
    if (section) {
      filtered = filtered.filter((item) => item.section === section);
    }

    set({
      filteredProducts: filtered,
      currentSection: section,
    });
  },

  filterPrice: (maxPrice) => {
    const { allProducts, currentType, currentSection } = get();
    let filtered = allProducts;

    // If a type is selected, filter by that type first
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    // If a section is selected, filter by that section
    if (currentSection) {
      filtered = filtered.filter((item) => item.section === currentSection);
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
