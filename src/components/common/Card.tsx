"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles, Eye } from "lucide-react";
import StarRating from "./StarsRating";
import { Product } from "../../types/index";
import Pricing from "./Pricing";

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
};

export default function Card({ product }: { product: Product }) {
  const detailUrl = `/shop/details/${product._id}`;

  const stockCount = Number(product?.countInStock ?? 10);
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  const images: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.photo
        ? [product.photo]
        : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mb-3 flex h-full w-full cursor-pointer flex-col justify-between rounded-[1.75rem] border border-neutral-200/70 bg-white p-2.5 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-black/20 hover:shadow-[0_24px_48px_-14px_rgba(0,0,0,0.14)] sm:p-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setActiveIdx(0);
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── 1. Portrait Visual Stage ── */}
      <Link
        href={detailUrl}
        className={`relative block w-full overflow-hidden rounded-[1.35rem] bg-[#F4F3F4] transition-all duration-300 active:scale-[0.99] ${
          isOutOfStock ? "grayscale opacity-85" : ""
        }`}
        style={{ aspectRatio: "3/3.85" }}
      >
        {images.length > 0 ? (
          images.map((imgUrl, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={idx}
                className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                <Image
                  src={getImageUrl(imgUrl)}
                  alt={product.name || "Garment image"}
                  fill
                  quality={85}
                  priority={idx === 0}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>
            );
          })
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#EBE9EA] text-neutral-400">
            <Sparkles size={22} />
            <span className="mt-1 font-mono text-[9px] font-black uppercase tracking-widest">
              SHOP.CO ARCHIVE
            </span>
          </div>
        )}

        {/* Subtle Bottom Vignette */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-black/50 via-transparent to-black/10 opacity-30 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />

        {/* Top-Right Segmented Story Indicators */}
        {images.length > 1 && (
          <div className="absolute right-2.5 top-2.5 z-30 flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 backdrop-blur-md">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                className={`h-1 cursor-pointer rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`View angle ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top-Left Status & Urgency Badges */}
        <div className="absolute left-2.5 top-2.5 z-30 flex flex-col items-start gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-rose-600/95 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-md backdrop-blur-md">
              Sold Out
            </span>
          ) : (
            <>
              {product.isSale && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#111111]/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-md backdrop-blur-md">
                  <Sparkles size={9} className="text-amber-400" />
                  Sale
                </span>
              )}
              {isLowStock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-700 shadow-sm backdrop-blur-md">
                  <Flame size={9} className="fill-amber-500 text-amber-500" />
                  Only {stockCount} Left
                </span>
              )}
            </>
          )}
        </div>

        {/* Floating Quick-Inspect Bar on Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-30 flex justify-center opacity-100 transition-all duration-300 ease-out md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <span
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.16em] shadow-xl backdrop-blur-xl transition-all ${
              isOutOfStock
                ? "bg-neutral-900/90 text-neutral-300"
                : "bg-white/95 text-[#111111] hover:bg-[#111111] hover:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Eye size={12} />
              {isOutOfStock ? "Unavailable" : "Inspect Piece"}
            </span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      {/* ── 2. Editorial Garment Metadata ── */}
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-2 px-1">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">
              {(product as any).category ||
                (product as any).section ||
                "STUDIO EDIT"}
            </span>

            <div className="flex items-center gap-1">
              <StarRating rating={product?.ratingsAverage || 0} />
              <span className="font-mono text-[10px] font-extrabold text-neutral-500">
                {Number(product?.ratingsAverage || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="mt-1 block">
            <h4
              title={product.name}
              className={`truncate text-xs font-black uppercase tracking-tight transition-colors sm:text-sm ${
                isOutOfStock
                  ? "text-neutral-400"
                  : "text-[#111111] group-hover:text-neutral-600"
              }`}
            >
              {product.name || product.description}
            </h4>
          </Link>
        </div>

        {/* Price Footer */}
        <div
          className={`border-t border-neutral-100 pt-2 ${
            isOutOfStock ? "opacity-55" : ""
          }`}
        >
          <Pricing product={product} />
        </div>
      </div>
    </motion.div>
  );
}
