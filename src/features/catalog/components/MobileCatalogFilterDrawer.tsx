"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { SlidersHorizontal, X, RotateCcw, Sparkles } from "lucide-react";
import { ProductCategoryFilter } from "@/features/catalog/components/ProductCategoryFilter";
import { ProductStyleFilter } from "@/features/catalog/components/ProductStyleFilter";
import PriceRangeFilter from "@/features/catalog/components/PriceRangeFilter";
import { ProductColorFilter } from "@/features/catalog/components/ProductColorFilter";
import { ProductSizeFilter } from "@/features/catalog/components/ProductSizeFilter";
import { useFilterStore } from "@/store/filterStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const CATEGORIES = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

export default function MobileCatalogFilterDrawer() {
  const { t, direction } = useLocale();
  const reset = useFilterStore((e) => e.resetFilter);
  const products = useFilterStore((e) => e.filteredProducts);
  const { currentSection, currentType, currentStyle } = useFilterStore();
  const [open, setOpen] = React.useState(false);

  const activeCount = [currentSection, currentType, currentStyle].filter(
    Boolean,
  ).length;
  const filterLabels: Record<string, string> = {
    "T-SHIRT": t("adminSectionTShirt"),
    SHIRT: t("adminSectionShirt"),
    PANTS: t("adminSectionPants"),
    JEANS: t("adminSectionJeans"),
    Casual: t("casual"),
    Formal: t("formal"),
    Party: t("party"),
    Gym: t("gym"),
  };
  const activeFilterLabel = [currentSection, currentStyle, currentType]
    .filter(Boolean)
    .map((value) => filterLabels[String(value)] || String(value))[0] || t("catalogAllCollections");

  return (
    <div dir={direction} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-2xs">
      {/* Left Mobile Telemetry */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-black uppercase tracking-wider text-primary">
          {activeFilterLabel}
        </p>
        <p className="text-[10px] font-semibold text-muted">
          {products.length} {t("products")}
        </p>
      </div>

      {/* Right Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-action px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-action shadow-xs active:scale-95"
      >
        <SlidersHorizontal size={13} />
        <span>{t("filters")}</span>
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success font-mono text-[9px] font-black text-on-success">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "28px 28px 0 0",
            maxHeight: "88vh",
            backgroundColor: "var(--surface-raised)",
            color: "var(--text-primary)",
          },
        }}
      >
        <div className="overflow-y-auto px-5 pb-8 pt-3">
          {/* Drag Handle */}
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-surface-hover" />

          {/* Drawer Header */}
          <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-action text-on-action">
                <SlidersHorizontal size={14} />
              </span>
              <div>
                <span className="block text-sm font-black uppercase tracking-tight text-primary">
                  {t("catalogFiltersTitle")}
                </span>
                <span className="block text-[10px] font-semibold text-muted">
                  {products.length} {t("products")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary"
              >
                <RotateCcw size={11} />
                <span>{t("reset")}</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted text-secondary"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="divide-y divide-border-subtle">
            <div className="pb-4">
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                {t("catalogCategory")}
              </p>
              <ProductCategoryFilter content={CATEGORIES} />
            </div>

            <PriceRangeFilter />
            <ProductColorFilter />
            <ProductSizeFilter />

            <div className="pt-4">
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                {t("dressAesthetic")}
              </p>
              <ProductStyleFilter content={DRESS_STYLES} />
            </div>
          </div>

          {/* Sticky Apply Button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-lg active:scale-98"
          >
            <Sparkles size={13} />
            <span>{t("exploreProducts")} · {products.length}</span>
          </button>
        </div>
      </Drawer>
    </div>
  );
}
