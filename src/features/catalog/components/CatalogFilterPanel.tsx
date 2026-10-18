"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { ProductCategoryFilter } from "@/features/catalog/components/ProductCategoryFilter";
import PriceRangeFilter from "@/features/catalog/components/PriceRangeFilter";
import { ProductColorFilter } from "@/features/catalog/components/ProductColorFilter";
import { ProductSizeFilter } from "@/features/catalog/components/ProductSizeFilter";
import { StyleFilterSection } from "@/features/catalog/components/StyleFilterSection";

const PRODUCT_CATEGORIES = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];

export const CatalogFilterPanel = () => {
  const { resetFilter, currentSection, currentStyle, currentType } =
    useFilterStore((s) => s);

  const activeCount = [currentSection, currentStyle, currentType].filter(
    Boolean,
  ).length;

  return (
    <nav className="w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)]">
      {/* Studio Filter Header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle/70 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-action text-on-action shadow-2xs">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight text-primary">
                Atelier Filters
              </span>
              {activeCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success font-mono text-[9px] font-black text-on-success">
                  {activeCount}
                </span>
              )}
            </div>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-muted">
              Refine Lookbook
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilter}
          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-border/80 bg-surface px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted transition-all hover:border-border-strong hover:bg-action hover:text-on-action active:scale-95"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Accordions */}
      <div className="divide-y divide-border-subtle px-5">
        <div className="py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted">
              Garment Category
            </p>
            <Sparkles size={11} className="text-subtle" />
          </div>
          <ProductCategoryFilter content={PRODUCT_CATEGORIES} />
        </div>

        <PriceRangeFilter />
        <ProductColorFilter />
        <ProductSizeFilter />
        <StyleFilterSection />
      </div>
    </nav>
  );
};
