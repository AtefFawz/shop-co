"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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

  const isOutOfStock = (product?.countInStock ?? 0) <= 0;

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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative w-full flex flex-col gap-3 mb-4 cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── Image container ── */}
      <Link
        href={detailUrl}
        className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 block transition-all duration-300 active:scale-[0.98] ${
          isOutOfStock ? "grayscale-35 opacity-90" : ""
        }`}
        style={{ aspectRatio: "3/4" }}
      >
        {images.map((imgUrl, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={getImageUrl(imgUrl)}
                alt={product.name || "Product image"}
                fill
                quality={60}
                priority={idx === 0}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          );
        })}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

        {/* Indicators Dots */}
        {images.length > 1 && (
          <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIdx
                    ? "w-3.5 bg-white"
                    : "w-1 bg-white/40 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badges Container (Sale & Out of Stock) */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            <span className="bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          ) : (
            product.isSale && (
              <span className="bg-gray-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                Sale
              </span>
            )
          )}
        </div>

        {/* Action Button Overlay */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-3 md:group-hover:translate-y-0 transition-all duration-300 ease-out z-30">
          <span
            className={`flex items-center gap-1.5 backdrop-blur-md text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-2xl transition-all text-nowrap ${
              isOutOfStock
                ? "bg-zinc-800/90 text-zinc-300 hover:bg-black hover:text-white"
                : "bg-white/95 text-black hover:bg-black hover:text-white active:scale-95"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "View Details"}
            <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="space-y-1.5 px-0.5">
        <Link href={detailUrl}>
          <h4
            className={`font-black text-sm sm:text-base uppercase tracking-tight truncate leading-tight transition-colors ${
              isOutOfStock
                ? "text-gray-400 hover:text-gray-600"
                : "text-gray-900 hover:text-gray-600"
            }`}
          >
            {product.name || product.description}
          </h4>
        </Link>

        {/* Stars + rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product?.ratingsAverage || 0} />
          <span className="text-[10px] font-bold text-gray-400">
            {product?.ratingsAverage}/5
          </span>
        </div>

        {/* Price */}
        <div className={isOutOfStock ? "opacity-60" : ""}>
          <Pricing product={product} />
        </div>
      </div>
    </motion.div>
  );
}
