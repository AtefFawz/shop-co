import { Product } from "@/types";
import { create } from "zustand";

interface FilterStore {
  allProducts: Product[];
  filteredProducts: Product[];
  currentType: string | null;
  currentSection: string | null;
  currentStyle: string | null;
  currentPrice: number | null;

  // Actions
  setInitialProducts: (data: Product[]) => void;
  filterByGender: (gender: string) => void;
  filterBySection: (section: string) => void;
  filterByStyle: (style: string) => void;
  filterPrice: (maxPrice: number) => void;
  resetFilter: () => void;
}

// A pure function that applies all active filters together without conflict
const applyAllFilters = (
  products: Product[],
  gender: string | null,
  section: string | null,
  style: string | null,
  maxPrice: number | null,
) => {
  return products.filter((item: any) => {
    // 1. Filter by Type (Gender)
    if (gender && item.gender?.toUpperCase() !== gender.toUpperCase()) {
      return false;
    }

    // 2. Filter by Section / Subcategory
    if (section && item.section?.toUpperCase() !== section.toUpperCase()) {
      return false;
    }

    // 3. Filter by Style
    if (style && item.style?.toLowerCase() !== style.toLowerCase()) {
      return false;
    }

    // 4. Filter by Price
    if (maxPrice !== null && item.price > maxPrice) {
      return false;
    }

    return true;
  });
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  currentType: null,
  currentSection: null,
  currentStyle: null,
  currentPrice: null,

  setInitialProducts: (data) => {
    const { currentType, currentSection, currentStyle, currentPrice } = get();
    set({
      allProducts: data,
      filteredProducts: applyAllFilters(
        data,
        currentType,
        currentSection,
        currentStyle,
        currentPrice,
      ),
    });
  },

  filterByGender: (gender) => {
    const { allProducts, currentSection, currentStyle, currentPrice } = get();
    set({
      currentType: gender,
      filteredProducts: applyAllFilters(
        allProducts,
        gender,
        currentSection,
        currentStyle,
        currentPrice,
      ),
    });
  },

  filterBySection: (section) => {
    const { allProducts, currentType, currentStyle, currentPrice } = get();
    set({
      currentSection: section,
      filteredProducts: applyAllFilters(
        allProducts,
        currentType,
        section,
        currentStyle,
        currentPrice,
      ),
    });
  },

  filterByStyle: (style) => {
    const { allProducts, currentType, currentSection, currentPrice } = get();
    set({
      currentStyle: style,
      filteredProducts: applyAllFilters(
        allProducts,
        currentType,
        currentSection,
        style,
        currentPrice,
      ),
    });
  },

  filterPrice: (maxPrice) => {
    const { allProducts, currentType, currentSection, currentStyle } = get();
    set({
      currentPrice: maxPrice,
      filteredProducts: applyAllFilters(
        allProducts,
        currentType,
        currentSection,
        currentStyle,
        maxPrice,
      ),
    });
  },

  resetFilter: () => {
    const { allProducts } = get();
    set({
      filteredProducts: allProducts,
      currentType: null,
      currentSection: null,
      currentStyle: null,
      currentPrice: null,
    });
  },
}));
