import { beforeEach, describe, expect, it } from "vitest";
import { countActiveFilters, useFilterStore } from "@/store/filterStore";
import type { Product } from "@/types";

const products = [
  { _id: "1", price: 100, discount: 0, colors: ["#000000"], size: ["M", "L"], gender: "MEN" },
  { _id: "2", price: 400, discount: 50, colors: ["red"], size: ["Small"], gender: "MEN" },
  { _id: "3", price: 900, discount: 0, colors: ["black"], size: ["XL"], gender: "WOMEN" },
] as unknown as Product[];

const ids = () => useFilterStore.getState().filteredProducts.map((p) => p._id);

describe("filter store", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilter();
    useFilterStore.getState().setInitialProducts(products);
  });

  it("filters by colour family, including colour words", () => {
    useFilterStore.getState().filterByColor("#000000");
    expect(ids()).toEqual(["1", "3"]);
  });

  it("combines filters and clears with null", () => {
    const s = useFilterStore.getState();
    s.filterByColor("#000000");
    s.filterBySize("M");
    expect(ids()).toEqual(["1"]);
    s.filterBySize(null);
    expect(ids()).toEqual(["1", "3"]);
  });

  it("compares price after discount", () => {
    useFilterStore.getState().filterPrice(250);
    expect(ids()).toEqual(["1", "2"]);
  });

  it("counts active filters and resets", () => {
    const s = useFilterStore.getState();
    s.filterByGender("MEN");
    s.filterBySize("S");
    expect(countActiveFilters(useFilterStore.getState())).toBe(2);
    s.resetFilter();
    expect(countActiveFilters(useFilterStore.getState())).toBe(0);
    expect(ids()).toEqual(["1", "2", "3"]);
  });
});
