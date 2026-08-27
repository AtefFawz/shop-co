"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import StarRating from "./StarsRating";
import { Product } from "../../types/index";
import Pricing from "./Pricing";

export default function Card({ product }: { product: Product }) {
  //   const product = products ?? [];
  const detailUrl = `/shopping/details/${product._id}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative w-full flex flex-col gap-3 mb-4 cursor-pointer"
    >
      {/* ── Image container ── */}
      <Link
        href={detailUrl}
        className="relative w-full overflow-hidden rounded-2xl bg-gray-100 block transition-all duration-300 active:scale-[0.98]"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={product.photo ?? ""}
          alt={product.name || "Product"}
          fill
          quality={60}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        {product.isSale && (
          <span className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg z-10">
            Sale
          </span>
        )}

        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-3 md:group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-black text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-2xl hover:bg-black hover:text-white active:scale-95 transition-all text-nowrap">
            View Details
            <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="space-y-1.5 px-0.5">
        <Link href={detailUrl}>
          <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-gray-900 truncate leading-tight hover:text-gray-600 transition-colors">
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
        <Pricing product={product} />
      </div>
    </motion.div>
  );
}
