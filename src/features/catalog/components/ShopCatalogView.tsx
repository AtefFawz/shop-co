"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PackageSearch,
  Sparkles,
  LayoutGrid,
  Grid3X3,
  ArrowUpDown,
  RotateCcw,
  X,
  Search,
  Layers,
} from "lucide-react";

import Card from "@/features/catalog/components/ProductCard";
import { CatalogFilterPanel } from "@/features/catalog/components/CatalogFilterPanel";
import { CatalogNavigationTrail } from "@/features/catalog/components/CatalogNavigationTrail";
import MobileCatalogFilterDrawer from "@/features/catalog/components/MobileCatalogFilterDrawer";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import { ProductGridSkeleton } from "@/shared/components/ui/ProductGridSkeleton";

import { useFilterStore } from "@/store/filterStore";
import { Product } from "@/types";
import useData from "@/hooks/getData";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export const ShopCatalogView = () => {
  const { t, direction } = useLocale();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() || "";

  const { data, loading, page, totalPages, goToPage } = useData("/product", {
    params: {
      keyword,
    },
  });

  const {
    currentType,
    currentSection,
    currentStyle,
    resetFilter,
    setInitialProducts,
    filteredProducts: displayProducts,
  } = useFilterStore((state) => state);

  // Interactive Showroom States
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating-desc"
  >("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    const products = data?.data?.Products;
    if (products) {
      setInitialProducts(products);
    }
  }, [data, setInitialProducts]);

  // Client-side Sort on Filtered Products
  const sortedProducts = useMemo(() => {
    const list = [...(displayProducts || [])];
    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "rating-desc") {
      list.sort(
        (a, b) => Number(b.ratingsAverage || 0) - Number(a.ratingsAverage || 0),
      );
    }
    return list;
  }, [displayProducts, sortBy]);

  const hasProducts = sortedProducts.length > 0;
  const hasActiveFilters = Boolean(
    currentType || currentSection || currentStyle || sortBy !== "featured",
  );
  const localizedFilterLabel = (value?: string | null) => {
    if (!value) return "";
    const labels: Record<string, string> = {
      MEN: t("adminProductGenderMen"),
      WOMEN: t("adminProductGenderWomen"),
      KIDS: t("adminGenderKids"),
      UNISEX: t("adminProductGenderUnisex"),
      "T-SHIRT": t("adminSectionTShirt"),
      SHIRT: t("adminSectionShirt"),
      PANTS: t("adminSectionPants"),
      JEANS: t("adminSectionJeans"),
      CASUAL: t("casual"),
      FORMAL: t("formal"),
      PARTY: t("party"),
      GYM: t("gym"),
    };
    return labels[value.toUpperCase()] || value;
  };
  const localizedSortLabel: Record<string, string> = {
    featured: t("catalogSortFeatured"),
    "price-asc": t("catalogSortPriceLow"),
    "price-desc": t("catalogSortPriceHigh"),
    "rating-desc": t("catalogSortRating"),
  };

  return (
    <section
      dir={direction}
      className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-10"
    >
      {/* Subtle Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. ARCHITECTURAL SHOWROOM BANNER & BREADCRUMB                    */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <nav
              aria-label={t("productBreadcrumb")}
              className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                {t("catalogFlagship")}
              </Link>
              <span>/</span>
              <span className="text-primary">
                {localizedFilterLabel(currentType) ||
                  t("catalogAllCollections")}
              </span>
              {currentStyle && (
                <>
                  <span>/</span>
                  <span className="text-primary">
                    {localizedFilterLabel(currentStyle)}
                  </span>
                </>
              )}
              {currentSection && (
                <>
                  <span>/</span>
                  <span className="rounded-md bg-action px-2 py-0.5 text-on-action">
                    {localizedFilterLabel(currentSection)}
                  </span>
                </>
              )}
            </nav>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {localizedFilterLabel(currentSection) ||
                  localizedFilterLabel(currentStyle) ||
                  localizedFilterLabel(currentType) ||
                  t("catalogAllCollections")}
              </h1>
              {!loading && (
                <span className="rounded-full bg-surface-subtle px-3 py-0.5 font-mono text-xs font-black text-secondary">
                  {sortedProducts.length} {t("catalogShowing")}
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: Sort Dropdown & Desktop Column Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            {keyword && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-subtle px-3 py-2 text-xs font-bold text-secondary">
                <Search size={12} className="text-primary" />
                <span>{t("catalogQuery")}</span>
                <strong className="text-primary">
                  &ldquo;{keyword}&rdquo;
                </strong>
              </div>
            )}

            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute start-3 text-muted"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={t("catalogSort")}
                className="cursor-pointer appearance-none rounded-xl border border-border/90 bg-surface-subtle py-2 ps-8 pe-7 text-[11px] font-black uppercase tracking-wider text-primary transition-colors hover:border-border-strong focus:border-primary focus:bg-surface focus:outline-none"
              >
                <option value="featured">{t("catalogSortFeatured")}</option>
                <option value="price-asc">{t("catalogSortPriceLow")}</option>
                <option value="price-desc">{t("catalogSortPriceHigh")}</option>
                <option value="rating-desc">{t("catalogSortRating")}</option>
              </select>
            </div>

            {/* Desktop Grid Density Toggle (3 vs 4 Columns) */}
            <div className="hidden items-center rounded-xl border border-border/90 bg-surface-subtle p-1 xl:inline-flex">
              <button
                type="button"
                onClick={() => setGridCols(3)}
                title={t("catalogThreeColumns")}
                className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                  gridCols === 3
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                title={t("catalogFourColumns")}
                className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                  gridCols === 4
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. ACTIVE FILTER CHIPS RIBBON (VISIBLE WHEN FILTERS APPLIED)     */}
        {/* ================================================================ */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border-subtle bg-surface/80 px-4 py-2.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                {t("catalogActiveFilters")}
              </span>

              {currentType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-action px-3 py-1 text-[10px] font-black uppercase tracking-wider text-on-action">
                  {t("catalogDepartment")} {localizedFilterLabel(currentType)}
                </span>
              )}

              {currentSection && (
                <span className="inline-flex items-center gap-1 rounded-full bg-action px-3 py-1 text-[10px] font-black uppercase tracking-wider text-on-action">
                  {t("catalogType")} {localizedFilterLabel(currentSection)}
                </span>
              )}

              {currentStyle && (
                <span className="inline-flex items-center gap-1 rounded-full bg-action px-3 py-1 text-[10px] font-black uppercase tracking-wider text-on-action">
                  {t("catalogStyle")} {localizedFilterLabel(currentStyle)}
                </span>
              )}

              {sortBy !== "featured" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                  {t("catalogSorted")} {localizedSortLabel[sortBy] || sortBy}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                resetFilter();
                setSortBy("featured");
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-danger hover:underline"
            >
              <RotateCcw size={11} />
              <span>{t("catalogResetAll")}</span>
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. MAIN SHOWROOM STAGE (STICKY SIDEBAR + PRODUCT GRID)           */}
        {/* ================================================================ */}
        <div className="flex items-start gap-5 lg:gap-7">
          {/* Desktop Sidebar */}
          <aside
            aria-label={t("filters")}
            className="sticky top-24 hidden h-fit w-[250px] shrink-0 self-start md:block xl:w-[285px]"
          >
            <CatalogFilterPanel />
          </aside>

          {/* Products Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Filters Bar */}
            <div className="mb-5 md:hidden">
              <MobileCatalogFilterDrawer />
            </div>

            {/* Loading Skeleton Grid */}
            {loading && (
              <div
                aria-label={t("catalogLoading")}
                className={`grid grid-cols-2 gap-1.5 sm:gap-3 lg:grid-cols-3 ${
                  gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                }`}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductGridSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && hasProducts && (
              <div
                className={`grid grid-cols-2 gap-1.5 sm:gap-3 lg:grid-cols-3 ${
                  gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                }`}
              >
                {sortedProducts.map((product: Product) => (
                  <Card key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Luxury Empty State with Instant Reset */}
            {!loading && !hasProducts && (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle text-primary">
                  <PackageSearch size={28} strokeWidth={1.6} />
                </div>

                <h3 className="text-sm font-black uppercase tracking-wider text-primary">
                  {t("productSearchEmptyTitle")}
                </h3>

                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted">
                  {t("productSearchEmptyDescription")}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    resetFilter();
                    setSortBy("featured");
                  }}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-action px-5 py-3 text-xs font-black uppercase tracking-widest text-on-action shadow-md transition-all hover:-translate-y-0.5 hover:bg-action-hover"
                >
                  <RotateCcw size={13} />
                  <span>{t("resetAllFilters")}</span>
                </button>
              </div>
            )}

            {/* Pagination Footer */}
            {!loading && totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface px-6 py-4 shadow-2xs sm:flex-row">
                <div className="flex items-center gap-2 text-xs font-bold text-muted">
                  <Layers size={14} className="text-primary" />
                  <span>
                    {t("catalogPage")}{" "}
                    <strong className="text-primary">{page}</strong>{" "}
                    {t("catalogOf")}{" "}
                    <strong className="text-primary">{totalPages}</strong> (
                    {data?.pagination?.total ?? sortedProducts.length}{" "}
                    {t("catalogTotalItems")})
                  </span>
                </div>

                <ClientPagination
                  page={page}
                  goToPage={goToPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <CatalogNavigationTrail />
    </section>
  );
};
