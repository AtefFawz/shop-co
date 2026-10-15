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

import Card from "@/components/common/Card";
import { Menu } from "./menu/Menu";
import { ShopPaths } from "./Paths";
import MobileFilterDrawer from "./MenuPhone/MeuPhone";
import { Pagination } from "@/components/common/Pagination.client";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";

import { useFilterStore } from "@/store/filterStore";
import { Product } from "@/types/index";
import useData from "@/hooks/getData";

export const Shop = () => {
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

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-10">
      {/* Subtle Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. ARCHITECTURAL SHOWROOM BANNER & BREADCRUMB                    */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400"
            >
              <Link href="/" className="hover:text-[#111111] transition-colors">
                Flagship
              </Link>
              <span>/</span>
              <span className="text-[#111111]">
                {currentType || "All Collections"}
              </span>
              {currentStyle && (
                <>
                  <span>/</span>
                  <span className="text-[#111111]">{currentStyle}</span>
                </>
              )}
              {currentSection && (
                <>
                  <span>/</span>
                  <span className="rounded-md bg-[#111111] px-2 py-0.5 text-white">
                    {currentSection}
                  </span>
                </>
              )}
            </nav>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                {currentSection || currentStyle || currentType || "The Archive"}
              </h1>
              {!loading && (
                <span className="rounded-full bg-[#F4F3F4] px-3 py-0.5 font-mono text-xs font-black text-neutral-600">
                  {sortedProducts.length} Showing
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: Sort Dropdown & Desktop Column Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            {keyword && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-[#F8F8F8] px-3 py-2 text-xs font-bold text-neutral-600">
                <Search size={12} className="text-[#111111]" />
                <span>Query:</span>
                <strong className="text-[#111111]">
                  &ldquo;{keyword}&rdquo;
                </strong>
              </div>
            )}

            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute left-3 text-neutral-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort showroom products"
                className="cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-8 pr-7 text-[11px] font-black uppercase tracking-wider text-[#111111] transition-colors hover:border-black focus:border-black focus:bg-white focus:outline-none"
              >
                <option value="featured">Sort: Featured Edit</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>

            {/* Desktop Grid Density Toggle (3 vs 4 Columns) */}
            <div className="hidden items-center rounded-xl border border-neutral-200/90 bg-[#F8F8F8] p-1 xl:inline-flex">
              <button
                type="button"
                onClick={() => setGridCols(3)}
                title="3-Column Editorial View"
                className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                  gridCols === 3
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-400 hover:text-black"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                title="4-Column Compact View"
                className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                  gridCols === 4
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-400 hover:text-black"
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
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Active Filters:
              </span>

              {currentType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Dept: {currentType}
                </span>
              )}

              {currentSection && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Type: {currentSection}
                </span>
              )}

              {currentStyle && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Style: {currentStyle}
                </span>
              )}

              {sortBy !== "featured" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#111111]">
                  Sorted: {sortBy}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                resetFilter();
                setSortBy("featured");
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:underline"
            >
              <RotateCcw size={11} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. MAIN SHOWROOM STAGE (STICKY SIDEBAR + PRODUCT GRID)           */}
        {/* ================================================================ */}
        <div className="flex items-start gap-5 lg:gap-7">
          {/* Desktop Sidebar */}
          <aside
            aria-label="Product filters"
            className="sticky top-24 hidden h-fit w-[250px] shrink-0 self-start md:block xl:w-[285px]"
          >
            <Menu />
          </aside>

          {/* Products Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Filters Bar */}
            <div className="mb-5 md:hidden">
              <MobileFilterDrawer />
            </div>

            {/* Loading Skeleton Grid */}
            {loading && (
              <div
                aria-label="Loading products"
                className={`grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 ${
                  gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                }`}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && hasProducts && (
              <div
                className={`grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 ${
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
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-white/90 bg-white px-6 py-16 text-center shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] text-[#111111]">
                  <PackageSearch size={28} strokeWidth={1.6} />
                </div>

                <h3 className="text-sm font-black uppercase tracking-wider text-[#111111]">
                  No Matching Garments Found
                </h3>

                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-neutral-400">
                  No pieces in our current archive match your selected filter
                  combination.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    resetFilter();
                    setSortBy("featured");
                  }}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  <RotateCcw size={13} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Pagination Footer */}
            {!loading && totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white px-6 py-4 shadow-2xs sm:flex-row">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                  <Layers size={14} className="text-[#111111]" />
                  <span>
                    Page <strong className="text-[#111111]">{page}</strong> of{" "}
                    <strong className="text-[#111111]">{totalPages}</strong> (
                    {data?.pagination?.total ?? sortedProducts.length} total
                    items)
                  </span>
                </div>

                <Pagination
                  page={page}
                  goToPage={goToPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <ShopPaths />
    </section>
  );
};
