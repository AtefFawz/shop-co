"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Crown,
  ArrowLeft,
  ArrowUpDown,
  Search,
  LayoutGrid,
  Grid3X3,
  RotateCcw,
  Layers,
  Tag,
  PackageSearch,
} from "lucide-react";

import Card from "@/features/catalog/components/ProductCard";
import Heading from "@/shared/components/ui/SectionHeading";
import { Product } from "@/types";
import { ProductGridSkeleton } from "@/shared/components/ui/ProductGridSkeleton";
import useData from "@/hooks/getData";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const EMPTY_PRODUCTS: Product[] = [];

export default function BestSellingProductsPage() {
  const { t, locale, direction } = useLocale();
  const { data, loading, page, goToPage, totalPages } = useData("/product");
  const rawProducts: Product[] = data?.data?.Products ?? EMPTY_PRODUCTS;

  // Interactive Showroom Controls
  const [activeTab, setActiveTab] = useState<"sale" | "all" | "under150">(
    "sale",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating-desc"
  >("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    document.title = `${t("topSelling")} | SHOP.CO™`;
  }, [locale, t]);

  // Live Telemetry from current products batch
  const telemetry = useMemo(() => {
    const saleItems = rawProducts.filter(
      (p: Product) => p.isSale === true || Number(p.discount) > 0,
    );
    const prices = rawProducts
      .map((p) => Number(p.price) || 0)
      .filter((v) => v > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const ratings = rawProducts
      .map((p) => Number(p.ratingsAverage) || 0)
      .filter((v) => v > 0);
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "4.9";

    return {
      totalBatch: rawProducts.length,
      saleCount: saleItems.length,
      minPrice,
      avgRating,
    };
  }, [rawProducts]);

  // Auto-switch to "all" if current page has 0 sale items so page never looks broken
  useEffect(() => {
    if (!loading && rawProducts.length > 0 && telemetry.saleCount === 0) {
      // Reset a stale filter when refreshed data no longer contains sale products.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("all");
    }
  }, [loading, rawProducts.length, telemetry.saleCount]);

  // Filtered & Sorted Products
  const displayedProducts = useMemo(() => {
    const list = [...rawProducts].filter((item: Product) => {
      if (activeTab === "sale") {
        const isPromo = item.isSale === true || Number(item.discount) > 0;
        if (!isPromo) return false;
      } else if (activeTab === "under150") {
        if (Number(item.price || 0) > 150) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (item.name || "").toLowerCase().includes(q);
        const catMatch = (item.category || item.section || "")
          .toLowerCase()
          .includes(q);
        return nameMatch || catMatch;
      }

      return true;
    });

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
  }, [rawProducts, activeTab, searchQuery, sortBy]);

  return (
    <section
      dir={direction}
      className="relative isolate min-h-screen overflow-hidden bg-surface-subtle  text-primary  "
    >
      {/* GPU 3D Pedestal Hover Styles */}
      <style>{`
        .selling-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .selling-3d-card:hover {
            transform: translateY(-6px) rotateX(2.5deg) rotateY(-2.5deg);
          }
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. TOP NAVIGATION & CAMPAIGN HEADER                              */}
        {/* ================================================================ */}
        <div className="flex flex-col justify-between gap-5 rounded-[2.2rem] border border-border bg-surface/90 p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-7 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>{t("sellingFlagship")}</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
                <Crown size={11} className="text-rating" />
                {t("sellingHighDemandArchive")}
              </span>
            </div>

            <div className="pt-1">
              <Heading title={t("topSelling")} styling="text-start !my-0" />
            </div>

            <p className="max-w-xl text-xs font-medium leading-relaxed text-muted">
              {t("sellingDescription")}
            </p>
          </div>

          {/* Right Dark Telemetry Card */}
          <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-action px-5 py-4 text-on-action shadow-lg sm:gap-7">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                {t("sellingActivePromos")}
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-success">
                {telemetry.saleCount} {t("sellingDrops")}
              </span>
            </div>

            <span className="h-7 w-px bg-white/15" />

            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                {t("sellingStartingAt")}
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-on-action">
                {formatCurrency(telemetry.minPrice, locale)}
              </span>
            </div>

            <span className="h-7 w-px bg-white/15" />

            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                {t("sellingAvgRating")}
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-rating">
                {telemetry.avgRating} ★
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. INTERACTIVE FILTER, SEARCH & SORT STUDIO BAR                  */}
        {/* ================================================================ */}
        <div className="flex flex-col justify-between gap-3.5 rounded-3xl border border-border bg-surface p-4 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Filter Mode Pills + Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex flex-wrap rounded-xl border border-border/90 bg-surface-subtle p-1">
              <button
                type="button"
                onClick={() => setActiveTab("sale")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "sale"
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                <Tag size={11} />
                <span>
                  {t("navSale")} ({telemetry.saleCount})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "all"
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                {t("sellingAllBestSellers")} ({rawProducts.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("under150")}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "under150"
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                {t("sellingUnder150")}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:w-56 sm:flex-initial">
              <Search
                size={13}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("sellingSearchPlaceholder")}
                className="w-full rounded-xl border border-border/90 bg-surface-subtle py-2 ps-9 pe-3 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Sort Dropdown + Grid Density Switcher */}
          <div className="flex items-center justify-between gap-2.5 sm:justify-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              {displayedProducts.length} {t("sellingShowing")}
            </span>

            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute start-3 text-muted"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label={t("catalogSort")}
                className="cursor-pointer appearance-none rounded-xl border border-border/90 bg-surface-subtle py-2 ps-8 pe-7 text-[11px] font-black uppercase tracking-wider text-primary focus:border-primary focus:bg-surface focus:outline-none"
              >
                <option value="featured">{t("sellingSortFeatured")}</option>
                <option value="price-asc">{t("sellingSortPriceLow")}</option>
                <option value="price-desc">{t("sellingSortPriceHigh")}</option>
                <option value="rating-desc">{t("sellingSortRating")}</option>
              </select>
            </div>

            <div className="hidden items-center rounded-xl border border-border/90 bg-surface-subtle p-1 xl:inline-flex">
              <button
                type="button"
                onClick={() => setGridCols(3)}
                title={t("sellingThreeColumn")}
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
                title={t("sellingFourColumn")}
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
        </div>

        {/* ================================================================ */}
        {/* 3. LOADING SKELETON / EMPTY STATE / 3D PRODUCT GRID              */}
        {/* ================================================================ */}
        {loading ? (
          <div
            className={`grid grid-cols-2 gap-1.5 sm:gap-3 gap-y-5 md:grid-cols-3 ${
              gridCols === 4 ? " lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductGridSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-primary">
              <PackageSearch size={28} strokeWidth={1.6} />
            </div>

            <h3 className="text-sm font-black uppercase tracking-wider text-primary">
              {t("sellingNoMatching")}
            </h3>

            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted">
              {t("sellingNoMatchingHint")}
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setSortBy("featured");
              }}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-action px-5 py-3 text-xs font-black uppercase tracking-widest text-on-action shadow-md transition-all hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <RotateCcw size={13} />
              <span>{t("sellingShowAll")}</span>
            </button>
          </div>
        ) : (
          <div
            style={{ perspective: "1200px" }}
            className={`grid grid-cols-2 gap-1.5 sm:gap-3 gap-y-5 md:grid-cols-3 ${
              gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {displayedProducts.map((item: Product, index: number) => (
              <div
                key={item._id}
                className="selling-3d-card group relative flex flex-col"
              >
                {/* Top Rank Crown Header */}
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-action px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-on-action">
                    #{String((page - 1) * 8 + index + 1).padStart(2, "0")}{" "}
                    {t("sellingRank").toUpperCase()}
                  </span>

                  {item.isSale ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-success">
                      <Sparkles size={10} /> {t("sellingDiscount")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-warning">
                      <Flame size={10} className="fill-rating text-warning" />
                      {t("sellingPopular")}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <Card product={item} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================ */}
        {/* 4. PAGINATION FOOTER                                             */}
        {/* ================================================================ */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface px-6 py-4 shadow-2xs sm:flex-row">
            <div className="flex items-center gap-2 text-xs font-bold text-muted">
              <Layers size={14} className="text-primary" />
              <span>
                {t("catalogPage")}{" "}
                <strong className="text-primary">{page}</strong>{" "}
                {t("catalogOf")}{" "}
                <strong className="text-primary">{totalPages}</strong>
              </span>
            </div>

            <ClientPagination
              page={page}
              goToPage={goToPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </section>
  );
}
