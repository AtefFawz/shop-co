"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Crown } from "lucide-react";

import Card from "@/features/catalog/components/ProductCard";
import Heading from "@/shared/components/ui/SectionHeading";
import { Product } from "@/types";
import { ProductGridSkeleton } from "@/shared/components/ui/ProductGridSkeleton";
import useData from "@/hooks/getData";
import SpecularButton from "@/shared/components/motion/SpecularButton";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const EMPTY_PRODUCTS: Product[] = [];

export default function BestSellingProductsSection() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const { data, loading } = useData("/product", {
    params: {
      keyword: keyword || undefined,
    },
    limit: 8,
  });

  const results: Product[] = data?.data?.Products ?? EMPTY_PRODUCTS;

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
      <section className="Responsive py-14 sm:py-16">
        <div className="mb-8 flex flex-col items-center space-y-3">
          <div className="h-6 w-36 animate-pulse rounded-full bg-surface-hover" />
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-surface-hover" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductGridSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="relative isolate overflow-hidden pb-6 sm:pb-10 lg:pb-14">
      <div className="Responsive space-y-8">
        {/* ── Header & Mode Switcher ── */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-action px-3.5 py-1 text-on-action shadow-xs">
            <Crown size={12} className="text-rating" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em]">
              {t("topSellingMicro")}
            </span>
          </div>

          <Heading title={t("topSelling")} />

          <div className="mt-2 inline-flex rounded-2xl border border-border/80 bg-surface-subtle p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterMode("sale")}
              className={`cursor-pointer rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                filterMode === "sale"
                  ? "bg-action text-on-action shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              {t("onSaleSpotlight")}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`cursor-pointer rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                filterMode === "all"
                  ? "bg-action text-on-action shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              {t("allTimeBestSellers")}
            </button>
          </div>
        </div>

        {/* ── 4-Column Ranked Showroom Grid ── */}
        <div
          style={{ perspective: "1200px" }}
          className="grid grid-cols-2 gap-1.5 sm:gap-3 gap-y-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {displayedItems.map((item: Product, index: number) => (
            <div
              key={item._id}
              className="arrival-3d-item group relative flex flex-col"
            >
              {/* Rank Crown Bar */}
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1 rounded-md bg-action px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-on-action">
                  #{index + 1} {t("ranked")}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-warning">
                  <Flame size={11} className="fill-rating text-warning" />
                  {t("highDemand")}
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
            tintOpacity={0}
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
            {t("viewAllBestSellers")} ↗
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}
