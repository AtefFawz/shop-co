import { Product } from "@/types";
import { create } from "zustand";
import { productHasColor, productHasSize } from "@/lib/variantMatch";

interface Filters {
  currentType: string | null;
  currentSection: string | null;
  currentStyle: string | null;
  currentPrice: number | null;
  currentColor: string | null;
  currentSize: string | null;
  currentIsSale: boolean;
  currentInStock: boolean;
}

interface FilterStore extends Filters {
  allProducts: Product[];
  filteredProducts: Product[];

  // Actions. Passing null (or the active value again, in the UI) clears a filter.
  setInitialProducts: (data: Product[]) => void;
  filterByGender: (gender: string | null) => void;
  filterBySection: (section: string | null) => void;
  filterByStyle: (style: string | null) => void;
  filterPrice: (maxPrice: number | null) => void;
  filterByColor: (color: string | null) => void;
  filterBySize: (size: string | null) => void;
  filterBySale: (enabled: boolean) => void;
  filterInStock: (enabled: boolean) => void;
  /** Hydrate URL filters in a single state transition to avoid request waterfalls. */
  hydrateFilters: (filters: Partial<Filters>) => void;
  resetFilter: () => void;
}

const EMPTY_FILTERS: Filters = {
  currentType: null,
  currentSection: null,
  currentStyle: null,
  currentPrice: null,
  currentColor: null,
  currentSize: null,
  currentIsSale: false,
  currentInStock: false,
};

/** Number of active filters (used for the badge in the filter panel/drawer). */
export const countActiveFilters = (f: Filters) =>
  [
    f.currentType,
    f.currentSection,
    f.currentStyle,
    f.currentPrice,
    f.currentColor,
    f.currentSize,
    f.currentIsSale ? true : null,
    f.currentInStock ? true : null,
  ].filter((v) => v !== null && v !== "").length;

// A pure function that applies all active filters together without conflict
const applyAllFilters = (products: Product[], f: Filters) => {
  return products.filter((item: Product) => {
    if (f.currentType && item.gender?.toUpperCase() !== f.currentType.toUpperCase()) {
      return false;
    }
    if (f.currentSection && item.section?.toUpperCase() !== f.currentSection.toUpperCase()) {
      return false;
    }
    if (f.currentStyle && item.style?.toLowerCase() !== f.currentStyle.toLowerCase()) {
      return false;
    }
    if (f.currentPrice !== null) {
      // Compare the price the shopper actually pays (after discount).
      const discount = Number(item.discount) || 0;
      const effective = Number(item.price) * (1 - Math.min(100, Math.max(0, discount)) / 100);
      if (effective > f.currentPrice) return false;
    }
    if (f.currentColor && !productHasColor(item, f.currentColor)) {
      return false;
    }
    if (f.currentSize && !productHasSize(item, f.currentSize)) {
      return false;
    }
    if (f.currentIsSale && !item.isSale) return false;
    if (f.currentInStock && Number(item.countInStock ?? 0) <= 0) return false;
    return true;
  });
};

export const useFilterStore = create<FilterStore>((set, get) => {
  /** Merge a patch into the filters and recompute the visible list once. */
  const update = (patch: Partial<Filters>) => {
    const state = get();
    const next: Filters = {
      currentType: state.currentType,
      currentSection: state.currentSection,
      currentStyle: state.currentStyle,
      currentPrice: state.currentPrice,
      currentColor: state.currentColor,
      currentSize: state.currentSize,
      currentIsSale: state.currentIsSale,
      currentInStock: state.currentInStock,
      ...patch,
    };
    set({ ...next, filteredProducts: applyAllFilters(state.allProducts, next) });
  };

  return {
    ...EMPTY_FILTERS,
    allProducts: [],
    filteredProducts: [],

    setInitialProducts: (data) => {
      const state = get();
      set({
        allProducts: data,
        filteredProducts: applyAllFilters(data, state),
      });
    },

    filterByGender: (gender) => update({ currentType: gender }),
    filterBySection: (section) => update({ currentSection: section }),
    filterByStyle: (style) => update({ currentStyle: style }),
    filterPrice: (maxPrice) => update({ currentPrice: maxPrice }),
    filterByColor: (color) => update({ currentColor: color }),
    filterBySize: (size) => update({ currentSize: size }),
    filterBySale: (enabled) => update({ currentIsSale: enabled }),
    filterInStock: (enabled) => update({ currentInStock: enabled }),
    hydrateFilters: (filters) => update(filters),

    resetFilter: () => {
      const { allProducts } = get();
      set({ ...EMPTY_FILTERS, filteredProducts: allProducts });
    },
  };
});
