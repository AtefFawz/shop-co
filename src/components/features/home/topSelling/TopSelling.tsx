"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Crown, Sparkles } from "lucide-react";

import Card from "@/components/common/Card";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types/index";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import useData from "@/hooks/getData";
import SpecularButton from "@/components/reactbits/SpecularButton";

export default function TopSelling() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const { data, loading } = useData("/product", {
    params: {
      keyword: keyword || undefined,
    },
    limit: 8,
  });

  const results: Product[] = data?.data?.Products ?? [];

  const [filterMode, setFilterMode] = useState<"sale" | "all">("sale");

  // Smart fallback: if no items have isSale === true, gracefully show top items so section is never empty
  const displayedItems = useMemo(() => {
    const saleItems = results.filter((e: Product) => e.isSale === true);
    if (filterMode === "sale" && saleItems.length > 0) {
      return saleItems.slice(0, 4);
    }
    return results.slice(0, 4);
  }, [results, filterMode]);

  function handelClick() {
    router.push("/selling");
  }

  if (loading) {
    return (
      <section className="Responsive ">
        <div className="mb-8 flex flex-col items-center space-y-3">
          <div className="h-6 w-36 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="relative isolate overflow-hidden  ">
      <div className="Responsive space-y-8">
        {/* ── Header & Mode Switcher ── */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#111111] px-3.5 py-1 text-white shadow-xs">
            <Crown size={12} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em]">
              MOST COVETED · CLIENT FAVORITES
            </span>
          </div>

          <Heading title="TOP SELLING" />

          <div className="mt-2 inline-flex rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterMode("sale")}
              className={`cursor-pointer rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                filterMode === "sale"
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-neutral-500 hover:text-[#111111]"
              }`}
            >
              On Sale Spotlight
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`cursor-pointer rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                filterMode === "all"
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-neutral-500 hover:text-[#111111]"
              }`}
            >
              All-Time Best Sellers
            </button>
          </div>
        </div>

        {/* ── 4-Column Ranked Showroom Grid ── */}
        <div
          style={{ perspective: "1200px" }}
          className="grid grid-cols-2 gap-1.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4"
        >
          {displayedItems.map((item: Product, index: number) => (
            <div
              key={item._id}
              className="arrival-3d-item group relative flex flex-col"
            >
              {/* Rank Crown Bar */}
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#111111] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-white">
                  #{index + 1} RANKED
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600">
                  <Flame size={11} className="fill-amber-500 text-amber-500" />
                  High Demand
                </span>
              </div>

              <div className="flex-1">
                <Card product={item} />
              </div>
            </div>
          ))}
        </div>

        {/* ── View All CTA ── */}
        <div className="flex w-full items-center justify-center pt-4">
          <SpecularButton
            size="sm"
            radius={999}
            baseColor="#99a1af"
            lineColor="#000000"
            tint="#000000"
            tintOpacity={0}
            textColor="#000000"
            blur={1}
            intensity={1}
            shineSize={15}
            shineFade={20}
            thickness={1}
            speed={1.3}
            followMouse={false}
            proximity={250}
            autoAnimate={false}
            className="min-w-[220px] cursor-pointer px-10 py-3.5 text-xs font-black uppercase tracking-[0.18em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md **:bg-transparent! **:font-black!"
            onClick={handelClick}
          >
            View All Best Sellers ↗
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}
