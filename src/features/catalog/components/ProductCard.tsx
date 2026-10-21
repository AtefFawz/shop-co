"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles, Eye, Heart } from "lucide-react";
import toast from "react-hot-toast";

import StarRating from "@/shared/components/feedback/StarRating";
import Pricing from "@/features/catalog/components/ProductPrice";
import { Product } from "@/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useWishlistStore } from "@/store/wishlistStore";

/* -------------------------------------------------------------------------- */
/*                                HELPER UTILS                                */
/* -------------------------------------------------------------------------- */

const CLOUDINARY_BASE = "https://res.cloudinary.com/dudit0nty/image/upload/";

const getImageUrl = (url?: string): string => {
  if (!url?.trim()) return "";
  return url.startsWith("http") ? url : `${CLOUDINARY_BASE}${url}`;
};

/* -------------------------------------------------------------------------- */
/*                              MAIN CARD COMPONENT                           */
/* -------------------------------------------------------------------------- */

export default function ProductCard({ product }: { product: Product }) {
  const { t, direction } = useLocale();
  const isSaved = useWishlistStore((state) =>
    state.items.some((item) => item._id === product._id),
  );
  const toggleSaved = useWishlistStore((state) => state.toggleItem);
  const detailUrl = `/shop/details/${product._id}`;

  // 1. Stock Telemetry
  const stockCount = Number(product?.countInStock ?? 10);
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  // 2. Normalized Image List
  const images = useMemo<string[]>(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      );
    }
    return product.photo ? [product.photo] : [];
  }, [product.images, product.photo]);

  // 3. Auto-Slideshow State
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [isPaused, images.length]);

  const categoryLabel =
    (product as any).category || (product as any).section || t("productAtelierEdit");
  const ratingValue = Number(product?.ratingsAverage || 0);

  return (
    <motion.article
      dir={direction}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setActiveIdx(0);
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="group relative flex h-full w-full flex-col justify-between rounded-2xl border border-border/75 bg-surface p-1.5 shadow-[0_4px_20px_-8px_rgba(var(--shadow-rgb),0.05)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-border hover:shadow-[0_20px_40px_-14px_rgba(var(--shadow-rgb),0.12)] sm:rounded-[1.65rem] sm:p-2.5"
    >
      {/* ================================================================== */}
      {/* 1. VISUAL STAGE (OPTIMIZED FOR MOBILE & DESKTOP)                   */}
      {/* ================================================================== */}
      <Link
        href={detailUrl}
        className={`relative block aspect-[3/3.75] w-full overflow-hidden rounded-xl bg-surface-subtle transition-transform duration-300 active:scale-[0.99] sm:aspect-[3/3.85] sm:rounded-[1.25rem] ${
          isOutOfStock ? "grayscale opacity-80" : ""
        }`}
      >
        {/* Product Images */}
        {images.length > 0 ? (
          images.map((imgUrl, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={`${imgUrl}-${idx}`}
                className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                <Image
                  src={getImageUrl(imgUrl)}
                  alt={product.name || t("productImageAlt")}
                  fill
                  quality={85}
                  priority={idx === 0}
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            );
          })
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-surface-subtle text-muted">
            <Sparkles size={18} />
            <span className="mt-1 font-mono text-[8px] font-black uppercase tracking-widest sm:text-[9px]">
              SHOP.CO
            </span>
          </div>
        )}

        {/* Desktop Hover Gradient Vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100"
        />

        {/* Top-Left Status Badges (Compact on Mobile) */}
        <div className="absolute start-2 top-2 z-30 flex flex-col items-start gap-1 sm:start-2.5 sm:top-2.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-danger px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-on-danger shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px]">
              {t("soldOut")}
            </span>
          ) : (
            <>
              {product.isSale && (
                <span className="inline-flex items-center gap-1 rounded-full bg-action/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-on-action shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px]">
                  <Sparkles
                    size={8}
                    className="text-rating sm:h-2.5 sm:w-2.5"
                  />
                  <span>{t("sale")}</span>
                </span>
              )}

              {isLowStock && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-surface/95 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-warning shadow-xs backdrop-blur-md sm:text-[8px]">
                  <Flame size={8} className="fill-rating text-warning" />
                  <span>{stockCount} {t("leftInStock")}</span>
                </span>
              )}
            </>
          )}
        </div>

        {/* Top-Right Image Switcher Dots */}
        {images.length > 1 && (
          <div className="absolute end-2 top-2 z-30 flex items-center gap-1 rounded-full bg-action/40 px-1.5 py-1 backdrop-blur-md sm:end-2.5 sm:top-2.5 sm:px-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                aria-label={t("productImageAlt")}
                className={`h-1 cursor-pointer rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? "w-3 bg-surface sm:w-3.5"
                    : "w-1 bg-white/45 hover:bg-surface/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop-Only Hover Quick-Inspect Pill (Does not block mobile image) */}
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-30 hidden translate-y-2 opacity-0 transition-all duration-300 ease-out md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <span
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg backdrop-blur-xl ${
              isOutOfStock
                ? "bg-action/90 text-subtle"
                : "bg-surface/95 text-primary"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Eye size={12} />
              <span>{isOutOfStock ? t("outOfStock") : t("quickView")}</span>
            </span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      {/* Save product without interrupting the product-details link. */}
      <button
        type="button"
        aria-label={isSaved ? t("removeFromWishlist") : t("addToWishlist")}
        aria-pressed={isSaved}
        title={isSaved ? t("removeFromWishlist") : t("addToWishlist")}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleSaved(product);
          toast.success(t(isSaved ? "removeFromWishlist" : "addToWishlist"));
        }}
        className="absolute end-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-surface/95 text-secondary shadow-sm backdrop-blur transition-all hover:scale-105 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:end-5 sm:top-5 sm:h-10 sm:w-10"
      >
        <Heart size={17} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-danger" : ""} />
      </button>

      {/* ================================================================== */}
      {/* 2. GARMENT METADATA & FOOTER (ERGONOMIC MOBILE SPACING)            */}
      {/* ================================================================== */}
      <div className="flex flex-1 flex-col justify-between px-1 pt-2.5 pb-0.5 sm:px-1.5 sm:pt-3">
        <div className="space-y-1">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1">
            <span className="truncate font-mono text-[8px] font-extrabold uppercase tracking-[0.14em] text-muted sm:text-[9px]">
              {categoryLabel}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              {/* Full stars on tablet/desktop, compact single star on narrow phones */}
              <div className="hidden sm:block">
                <StarRating rating={ratingValue} />
              </div>
              <span className="text-[10px] text-rating sm:hidden">★</span>
              <span className="font-mono text-[9px] font-extrabold text-muted sm:text-[10px]">
                {ratingValue > 0 ? ratingValue.toFixed(1) : t("productNewLabel")}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="block">
            <h4
              title={product.name}
              className={`line-clamp-1 text-xs font-black uppercase tracking-tight transition-colors sm:text-[13px] lg:text-sm ${
                isOutOfStock
                  ? "text-muted"
                  : "text-primary group-hover:text-secondary"
              }`}
            >
              {product.name || product.description}
            </h4>
          </Link>
        </div>

        {/* Price & Action Footer */}
        <div
          className={`mt-2 flex items-center justify-between gap-2 border-t border-border-subtle pt-2 ${
            isOutOfStock ? "opacity-55" : ""
          }`}
        >
          <div className="min-w-0 flex-1">
            <Pricing product={product} />
          </div>

          {/* Tactile Micro Action Button (Great for Mobile Tap & Desktop Hover) */}
          <Link
            href={detailUrl}
            aria-label={`${t("productViewProduct")}: ${product.name || t("products")}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-primary transition-all duration-300 group-hover:rotate-45 group-hover:bg-action group-hover:text-on-action sm:h-8 sm:w-8"
          >
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
