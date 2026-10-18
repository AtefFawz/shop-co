"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import Card from "@/features/catalog/components/ProductCard";
import Heading from "@/shared/components/ui/SectionHeading";
import useData from "@/hooks/getData";
import { ProductGridSkeleton } from "@/shared/components/ui/ProductGridSkeleton";

export const RelatedProductsSection = ({ productItem }: { productItem: Product }) => {
  const { data, loading } = useData("/product");
  const allProducts: Product[] = data?.data?.Products ?? [];

  // Exclude current product & smartly fallback to general products if section has < 4 matches
  const recommendations = useMemo(() => {
    const others = allProducts.filter((item) => item._id !== productItem?._id);
    const sameSection = others.filter(
      (item) => item.section === productItem?.section,
    );
    const sameCategory = others.filter(
      (item) => item.category === productItem?.category,
    );

    const combined = [...sameSection, ...sameCategory, ...others];
    const uniqueMap = new Map<string, Product>();
    combined.forEach((p) => {
      if (p?._id && !uniqueMap.has(p._id)) {
        uniqueMap.set(p._id, p);
      }
    });

    return Array.from(uniqueMap.values()).slice(0, 4);
  }, [allProducts, productItem]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductGridSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1 shadow-2xs">
            <Sparkles size={11} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
              CURATED RECOMMENDATIONS
            </span>
          </div>
          <Heading title="YOU MIGHT ALSO LIKE" styling="!text-start !my-0" />
        </div>

        <Link
          href="/shop"
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary shadow-2xs transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
        >
          <span>Explore Archive</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((item: Product) => (
          <Card key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};
