"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles, Eye } from "lucide-react";

import StarRating from "./StarsRating";
import Pricing from "./Pricing";
import { Product } from "../../types/index";

/* -------------------------------------------------------------------------- */
/*                                HELPER UTILS                                */
/* -------------------------------------------------------------------------- */

const CLOUDINARY_BASE = "https://res.cloudinary.com/dudit0nty/image/upload/";

const getImageUrl = (url?: string): string => {
  if (!url?.trim()) return "";
  return url.startsWith("http") ? url : `${CLOUDINARY_BASE}${url}`;
};

/* -------------------------------------------------------------------------- */
/*                             MAIN CARD COMPONENT                            */
/* -------------------------------------------------------------------------- */

export default function Card({ product }: { product: Product }) {
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
    (product as any).category || (product as any).section || "Atelier Edit";
  const ratingValue = Number(product?.ratingsAverage || 0);

  return (
    <motion.article
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
      className="group relative flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_22px_44px_-14px_rgba(0,0,0,0.13)] sm:rounded-[1.6rem] sm:p-2.5"
    >
      {/* ================================================================== */}
      {/* 1. VISUAL STAGE (IMAGE + FLOATING ACTION + STATUS BADGES)          */}
      {/* ================================================================== */}
      <Link
        href={detailUrl}
        className={`relative block aspect-[3/3.75] w-full overflow-hidden rounded-xl bg-[#F4F3F4] transition-transform duration-300 active:scale-[0.99] sm:aspect-[3/3.85] sm:rounded-[1.2rem] ${
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
                  alt={product.name || "Product"}
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
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#ECEAEB] text-neutral-400">
            <Sparkles size={18} />
            <span className="mt-1 font-mono text-[8px] font-black uppercase tracking-widest sm:text-[9px]">
              SHOP.CO
            </span>
          </div>
        )}

        {/* Subtle Bottom Vignette for Contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-black/25 via-transparent to-transparent transition-opacity duration-300 md:h-24 md:from-black/45 md:opacity-0 md:group-hover:opacity-100"
        />

        {/* Top-Left Status Badges */}
        <div className="absolute left-2 top-2 z-30 flex flex-col items-start gap-1 sm:left-2.5 sm:top-2.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-rose-600/95 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px]">
              Sold Out
            </span>
          ) : (
            <>
              {product.isSale && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111]/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px]">
                  <Sparkles
                    size={8}
                    className="text-amber-400 sm:h-2.5 sm:w-2.5"
                  />
                  <span>Sale</span>
                </span>
              )}

              {isLowStock && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[7.5px] font-black uppercase tracking-wider text-amber-700 shadow-xs backdrop-blur-md sm:text-[8.5px]">
                  <Flame size={8} className="fill-amber-500 text-amber-500" />
                  <span>{stockCount} Left</span>
                </span>
              )}
            </>
          )}
        </div>

        {/* Top-Right Image Switcher Dots */}
        {images.length > 1 && (
          <div className="absolute right-2 top-2 z-30 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-1 backdrop-blur-md sm:right-2.5 sm:top-2.5 sm:px-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-1 cursor-pointer rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? "w-3 bg-white sm:w-3.5"
                    : "w-1 bg-white/45 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile Floating Corner Action Button (Prevents Price/Discount Overlap!) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#111111] shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform duration-300 group-active:scale-90 md:hidden"
        >
          <ArrowUpRight size={13} strokeWidth={2.4} />
        </span>

        {/* Desktop Hover Quick-View Pill */}
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-30 hidden translate-y-2 opacity-0 transition-all duration-300 ease-out md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <span
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg backdrop-blur-xl ${
              isOutOfStock
                ? "bg-neutral-900/90 text-neutral-300"
                : "bg-white/95 text-[#111111]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Eye size={12} />
              <span>{isOutOfStock ? "Out of Stock" : "Quick View"}</span>
            </span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      {/* ================================================================== */}
      {/* 2. GARMENT METADATA & FULL-WIDTH UNOBSTRUCTED PRICING              */}
      {/* ================================================================== */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-1 pt-2.5 pb-1 sm:px-1.5 sm:pt-3">
        <div className="min-w-0 space-y-1">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1.5">
            <span className="truncate font-mono text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-neutral-400 sm:text-[9.5px]">
              {categoryLabel}
            </span>

            <div className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-100/80 px-1.5 py-0.5 sm:bg-transparent sm:p-0">
              <div className="hidden sm:block">
                <StarRating rating={ratingValue} />
              </div>
              <span className="text-[9.5px] leading-none text-amber-500 sm:hidden">
                ★
              </span>
              <span className="font-mono text-[9px] font-black text-neutral-600 sm:text-[10px]">
                {ratingValue > 0 ? ratingValue.toFixed(1) : "New"}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            href={detailUrl}
            className="group/title flex items-center justify-between gap-1"
          >
            <h4
              title={product.name}
              className={`line-clamp-1 min-w-0 flex-1 text-[11.5px] font-black uppercase tracking-tight transition-colors sm:text-[13px] lg:text-sm ${
                isOutOfStock
                  ? "text-neutral-400"
                  : "text-[#111111] group-hover:text-neutral-600"
              }`}
            >
              {product.name || product.description}
            </h4>
          </Link>
        </div>

        {/* Full-Width Pricing Container (Zero Overlap on Small Screens) */}
        <div
          className={`mt-2 w-full min-w-0 border-t border-neutral-100 pt-2 ${
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
