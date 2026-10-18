"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Flame,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

import Card from "@/features/catalog/components/ProductCard";
import Heading from "@/shared/components/ui/SectionHeading";
import { Product } from "@/types";
import { ProductGridSkeleton } from "@/shared/components/ui/ProductGridSkeleton";
import useData from "@/hooks/getData";
import SpecularButton from "@/shared/components/motion/SpecularButton";

export default function NewArrivalsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const { data, loading } = useData("/product", {
    params: {
      keyword: keyword || undefined,
    },
    limit: 8,
  });

  const rawProducts: Product[] = data?.data?.Products ?? [];

  // Interactive Client Filter & Sort
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "under150">(
    "all",
  );

  const displayedProducts = useMemo(() => {
    const list = [...rawProducts];
    if (activeTab === "promo") {
      const promos = list.filter(
        (p: any) => p.isSale === true || Number(p.discount) > 0,
      );
      return promos.length > 0 ? promos : list;
    }
    if (activeTab === "under150") {
      const affordable = list.filter((p: any) => Number(p.price || 0) <= 150);
      return affordable.length > 0 ? affordable : list;
    }
    return list;
  }, [rawProducts, activeTab]);

  function handelClick() {
    router.push("/shop");
  }

  if (loading) {
    return (
      <section className="Responsive py-14 sm:py-16">
        <div className="mb-8 flex flex-col items-center space-y-3">
          <div className="h-6 w-36 animate-pulse rounded-full bg-surface-hover" />
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-surface-hover" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductGridSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden  Responsive py-16!">
      {/* GPU 3D Pedestal Hover Styles */}
      <style>{`
        .arrival-3d-item {
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .arrival-3d-item:hover {
            transform: translateY(-6px) rotateX(2.5deg) rotateY(-2.5deg);
          }
        }
      `}</style>

      <div className="  space-y-8">
        {/* ── Top Editorial Header & Quick Filter Bar ── */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3.5 py-1 shadow-2xs">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">
              SEASON ARCHIVE · FRESH DROPS
            </span>
          </div>

          <Heading title="NEW ARRIVALS" />

          {/* Interactive Filter Pills */}
          <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-surface-subtle p-1.5 shadow-2xs">
            {[
              { id: "all", label: `All Drops (${rawProducts.length})` },
              { id: "promo", label: "Featured & Promo" },
              { id: "under150", label: "Essentials ≤ $150" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-action text-on-action shadow-xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3D Architectural Product Grid ── */}
        <div
          style={{ perspective: "1200px" }}
          className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {displayedProducts.map((item: Product, idx: number) => (
            <div
              key={item._id}
              className="arrival-3d-item group relative flex flex-col"
            >
              {/* Subtle Edition Index Tag */}
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted transition-colors group-hover:text-primary">
                  DROP // 0{idx + 1}
                </span>
                {(item as any).isSale && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-success">
                    <Flame size={10} /> Hot
                  </span>
                )}
              </div>

              <div className="flex-1">
                <Card product={item} />
              </div>
            </div>
          ))}
        </div>

        {/* ── View All CTA with SpecularButton ── */}
        <div className="flex w-full flex-col items-center justify-center pt-4 pb-6">
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
            Explore Full Archive ↗
          </SpecularButton>
        </div>

        {/* Architectural Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border-strong to-transparent" />
          <span className="absolute bg-surface px-4 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-subtle">
            SHOP.CO
          </span>
        </div>
      </div>
    </section>
  );
}
