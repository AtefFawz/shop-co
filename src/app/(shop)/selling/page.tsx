"use client";

import React, { useState, useMemo, useEffect } from "react";
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

import Card from "@/components/common/Card";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import useData from "@/hooks/getData";
import { Pagination } from "@/components/common/Pagination.client";

export default function SellingPage() {
  const { data, loading, page, goToPage, totalPages } = useData("/product");
  const rawProducts: Product[] = data?.data?.Products ?? [];

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
    document.title = "Top Selling & Archive Sale | SHOP.CO™";
  }, []);

  // Live Telemetry from current products batch
  const telemetry = useMemo(() => {
    const saleItems = rawProducts.filter(
      (p: any) => p.isSale === true || Number(p.discount) > 0,
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
      setActiveTab("all");
    }
  }, [loading, rawProducts.length, telemetry.saleCount]);

  // Filtered & Sorted Products
  const displayedProducts = useMemo(() => {
    const list = [...rawProducts].filter((item: any) => {
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

  const resetAll = () => {
    setActiveTab(telemetry.saleCount > 0 ? "sale" : "all");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4]  text-[#111111] ">
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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. TOP NAVIGATION & CAMPAIGN HEADER                              */}
        {/* ================================================================ */}
        <div className="flex flex-col justify-between gap-5 rounded-[2.2rem] border border-white/90 bg-white/90 p-5 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-7 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-[#F8F8F8] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-700 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>Flagship</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                <Crown size={11} className="text-amber-400" />
                HIGH-DEMAND ARCHIVE
              </span>
            </div>

            <div className="pt-1">
              <Heading title="TOP SELLING" styling="text-start !my-0" />
            </div>

            <p className="max-w-xl text-xs font-medium leading-relaxed text-neutral-500">
              Explore our most coveted garments, seasonal markdowns, and
              highest-rated pieces curated from global luxury houses.
            </p>
          </div>

          {/* Right Dark Telemetry Card */}
          <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-[#111111] px-5 py-4 text-white shadow-lg sm:gap-7">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                Active Promos
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-emerald-400">
                {telemetry.saleCount} Drops
              </span>
            </div>

            <span className="h-7 w-px bg-white/15" />

            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                Starting At
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-white">
                ${telemetry.minPrice.toLocaleString()}
              </span>
            </div>

            <span className="h-7 w-px bg-white/15" />

            <div>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                Avg Sentiment
              </span>
              <span className="mt-0.5 block font-mono text-lg font-black text-amber-400">
                {telemetry.avgRating} ★
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. INTERACTIVE FILTER, SEARCH & SORT STUDIO BAR                  */}
        {/* ================================================================ */}
        <div className="flex flex-col justify-between gap-3.5 rounded-3xl border border-white/90 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Filter Mode Pills + Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex flex-wrap rounded-xl border border-neutral-200/90 bg-[#F8F8F8] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("sale")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "sale"
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                <Tag size={11} />
                <span>On Sale ({telemetry.saleCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "all"
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                All Best Sellers ({rawProducts.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("under150")}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "under150"
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Under $150
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:w-56 sm:flex-initial">
              <Search
                size={13}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garment or style..."
                className="w-full rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-9 pr-3 text-xs font-semibold text-[#111111] placeholder:text-neutral-400 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Sort Dropdown + Grid Density Switcher */}
          <div className="flex items-center justify-between gap-2.5 sm:justify-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {displayedProducts.length} Showing
            </span>

            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute left-3 text-neutral-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort top selling products"
                className="cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-8 pr-7 text-[11px] font-black uppercase tracking-wider text-[#111111] focus:border-black focus:bg-white focus:outline-none"
              >
                <option value="featured">Sort: Featured Rank</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>

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
        </div>

        {/* ================================================================ */}
        {/* 3. LOADING SKELETON / EMPTY STATE / 3D PRODUCT GRID              */}
        {/* ================================================================ */}
        {loading ? (
          <div
            className={`grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 ${
              gridCols === 4 ? " lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-white/90 bg-white px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-[#F8F8F8] text-[#111111]">
              <PackageSearch size={28} strokeWidth={1.6} />
            </div>

            <h3 className="text-sm font-black uppercase tracking-wider text-[#111111]">
              No Matching Drops on This Page
            </h3>

            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-neutral-400">
              No garments in the current batch match your active filter. Switch
              to &ldquo;All Best Sellers&rdquo; or reset your search.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setSortBy("featured");
              }}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              <RotateCcw size={13} />
              <span>Show All Best Sellers</span>
            </button>
          </div>
        ) : (
          <div
            style={{ perspective: "1200px" }}
            className={`grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 ${
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
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#111111] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-white">
                    #{String((page - 1) * 8 + index + 1).padStart(2, "0")} RANK
                  </span>

                  {item.isSale ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600">
                      <Sparkles size={10} /> Markdown
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600">
                      <Flame
                        size={10}
                        className="fill-amber-500 text-amber-500"
                      />
                      Coveted
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
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white px-6 py-4 shadow-2xs sm:flex-row">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Layers size={14} className="text-[#111111]" />
              <span>
                Archive Page <strong className="text-[#111111]">{page}</strong>{" "}
                of <strong className="text-[#111111]">{totalPages}</strong>
              </span>
            </div>

            <Pagination
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
