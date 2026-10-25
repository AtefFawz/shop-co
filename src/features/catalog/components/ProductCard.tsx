"use client";

import { useState, useEffect, useMemo } from "react";
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
import { resolveImageUrl } from "@/lib/imageUrl";

/* -------------------------------------------------------------------------- */
/*                                HELPER UTILS                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             MAIN CARD COMPONENT                            */
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
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
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
    product.category || product.section || t("productAtelierEdit");
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
      className="group relative flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-border/75 bg-surface p-1.5 shadow-[0_4px_20px_-8px_rgba(var(--shadow-rgb),0.05)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-border-strong/40 hover:shadow-[0_20px_40px_-14px_rgba(var(--shadow-rgb),0.14)] sm:rounded-[1.65rem] sm:p-2.5"
    >
      {/* ================================================================== */}
      {/* 1. VISUAL STAGE (OPTIMIZED FOR MOBILE & DESKTOP)                   */}
      {/* ================================================================== */}
      <div className="relative w-full">
        <Link
          href={detailUrl}
          aria-label={`${t("productViewProduct")}: ${product.name || t("products")}`}
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
                    src={resolveImageUrl(imgUrl)}
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

          {/* Subtle Bottom Vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 md:h-24 md:from-black/45 md:opacity-0 md:group-hover:opacity-100"
          />

          {/* Top-Start Status Badges (Compact on Mobile) */}
          <div className="absolute start-2 top-2 z-30 flex max-w-[calc(100%-3rem)] flex-col items-start gap-1 sm:start-2.5 sm:top-2.5">
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
                    <span className="truncate">
                      {stockCount} {t("leftInStock")}
                    </span>
                  </span>
                )}
              </>
            )}
          </div>

          {/* Bottom-Start/Center Image Switcher Dots (Moved away from Wishlist Heart!) */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 start-2.5 z-30 flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-1 backdrop-blur-md md:group-hover:opacity-0 sm:px-2">
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
                      ? "w-3 bg-white sm:w-3.5"
                      : "w-1 bg-white/45 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Mobile Floating Corner Action Badge (Keeps Pricing Row 100% Free!) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 end-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-surface/90 text-primary shadow-md backdrop-blur-md transition-transform duration-300 group-active:scale-90 md:hidden"
          >
            <ArrowUpRight
              size={13}
              strokeWidth={2.4}
              className={direction === "rtl" ? "-scale-x-100" : ""}
            />
          </span>

          {/* Desktop-Only Hover Quick-Inspect Pill */}
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
              <ArrowUpRight
                size={13}
                className={direction === "rtl" ? "-scale-x-100" : ""}
              />
            </span>
          </div>
        </Link>

        {/* Wishlist Heart Button (Top-End) */}
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
          className="absolute end-2 top-2 z-40 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-surface/90 text-secondary shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:text-danger active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:end-2.5 sm:top-2.5 sm:h-9 sm:w-9"
        >
          <Heart
            size={15}
            fill={isSaved ? "currentColor" : "none"}
            className={isSaved ? "text-danger" : ""}
          />
        </button>
      </div>

      {/* ================================================================== */}
      {/* 2. GARMENT METADATA & UNOBSTRUCTED FULL-WIDTH PRICING              */}
      {/* ================================================================== */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-1 pt-2.5 pb-1 sm:px-1.5 sm:pt-3">
        <div className="min-w-0 space-y-1">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1">
            <span className="truncate font-mono text-[8px] font-extrabold uppercase tracking-[0.14em] text-muted sm:text-[9px]">
              {categoryLabel}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              <div className="hidden sm:block">
                <StarRating rating={ratingValue} />
              </div>
              <span className="text-[10px] leading-none text-rating sm:hidden">
                ★
              </span>
              <span className="font-mono text-[9px] font-extrabold text-muted sm:text-[10px]">
                {ratingValue > 0
                  ? ratingValue.toFixed(1)
                  : t("productNewLabel")}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="block min-w-0">
            <h4
              title={product.name}
              className={`line-clamp-1 text-[11.5px] font-black uppercase tracking-tight transition-colors sm:text-[13px] lg:text-sm ${
                isOutOfStock
                  ? "text-muted"
                  : "text-primary group-hover:text-secondary"
              }`}
            >
              {product.name || product.description}
            </h4>
          </Link>
        </div>

        {/* Full-Width Price & Discount Row (Zero Button Collision on Mobile) */}
        <div
          className={`mt-2 w-full min-w-0 border-t border-border-subtle pt-2 ${
            isOutOfStock ? "opacity-55" : ""
          }`}
        >
          <div className="w-full min-w-0 overflow-hidden [&>*]:flex-wrap [&>*]:items-baseline [&>*]:gap-x-1.5 [&>*]:gap-y-1">
            <Pricing product={product} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
