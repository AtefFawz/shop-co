"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import StarRating from "./StarsRating";
import { Product } from "../../types/index";
import Pricing from "./Pricing";
import { useRouter } from "next/navigation";

export default function Card({ product }: { product: Product }) {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`/shopping/details/${product._id}`);
  };

  return (
    <motion.div
      className="group relative w-full flex flex-col gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* ── Image container ── */}
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
        style={{ aspectRatio: "3/4" }}
        onClick={handleNavigate}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18 }}
      >
        {/* Product image */}
        <Image
          src={product.photo}
          alt={product.name || "Product"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay — always subtle on mobile, stronger on hover desktop */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Sale badge */}
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-gray-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
            Sale
          </span>
        )}

        {/* CTA button — bottom center */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-black text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-xl hover:bg-white transition-colors text-nowrap"
          >
            View Details
            <ArrowUpRight size={13} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Info ── */}
      <div className="space-y-1.5 px-0.5">
        {/* Name || Description*/}
        <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-gray-900 truncate leading-tight">
          {product.description || product.name}
        </h4>

        {/* Stars + rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] font-bold text-gray-400">
            {product.rating?.toFixed(1)}/5
          </span>
        </div>

        {/* Price */}
        <Pricing product={product} />
      </div>
    </motion.div>
  );
}
