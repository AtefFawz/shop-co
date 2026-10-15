// @/components/ui/ProductSkeleton.tsx
import React from "react";

export const ProductSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="relative mb-3 flex h-full w-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-neutral-200/70 bg-white p-2.5 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.05)] sm:p-3"
    >
      <style>{`
        @keyframes atelierShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-atelier-shimmer {
          animation: atelierShimmer 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* ── 1. Portrait Image Stage Skeleton (Matches 3/3.85 Card Ratio) ── */}
      <div
        className="relative w-full overflow-hidden rounded-[1.35rem] bg-[#EFEFEF]"
        style={{ aspectRatio: "3/3.85" }}
      >
        {/* Moving Shimmer Wave */}
        <div className="animate-atelier-shimmer pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/65 to-transparent" />

        {/* Top-Left Badge Placeholder */}
        <div className="absolute left-2.5 top-2.5 h-5 w-14 rounded-full bg-white/70" />

        {/* Top-Right Story Dots Placeholder */}
        <div className="absolute right-2.5 top-2.5 h-4 w-10 rounded-full bg-black/10" />

        {/* Bottom Button Placeholder */}
        <div className="absolute inset-x-2.5 bottom-2.5 h-8 rounded-xl bg-white/60" />
      </div>

      {/* ── 2. Metadata Skeleton Footer ── */}
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-2.5 px-1">
        <div className="space-y-2">
          {/* Category + Rating Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-neutral-200/90" />
            <div className="h-2.5 w-12 animate-pulse rounded-full bg-neutral-200/80" />
          </div>

          {/* Product Title */}
          <div className="h-4 w-4/5 animate-pulse rounded-lg bg-neutral-200" />
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5">
          <div className="h-5 w-20 animate-pulse rounded-lg bg-neutral-200" />
          <div className="h-4 w-10 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
