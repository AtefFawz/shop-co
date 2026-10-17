"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2, Minus, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/store/cardStore";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { Product } from "@/types";

const getImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/160x200/111111/FFFFFF?text=SHOP.CO";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

export const Card = ({ productItem }: { productItem: Product }) => {
  const remove = useProduct((e) => e.delete);
  const update = useProduct((e) => e.update);
  const router = useRouter();

  const qty = Math.max(1, Number(productItem.count ?? 1));
  const maxStock = Math.max(1, Number(productItem.countInStock ?? 20));
  const discount = Number(productItem.discount || 0);

  const finalPrice = calculateFinalPrice(
    Number(productItem.price || 0),
    discount,
    qty,
  );
  const originalTotal = Number(productItem.price || 0) * qty;

  const rawImg =
    productItem.photo ||
    (Array.isArray(productItem.images) ? productItem.images[0] : "");

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > maxStock) return;
    if (update) {
      update({
        ...productItem,
        count: newQty,
        isChose: true,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex gap-3.5 rounded-3xl border border-white/90 bg-white p-3.5 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_20px_40px_-14px_rgba(0,0,0,0.12)] sm:gap-5 sm:p-4"
    >
      {/* ── 1. Product Thumbnail ── */}
      <Link
        href={`/shop/details/${productItem._id}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/70 bg-[#F4F3F4] sm:h-32 sm:w-28"
      >
        <img
          src={getImageUrl(rawImg)}
          alt={productItem.name || "Garment"}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
        />
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-[#111111]/90 px-2 py-0.5 font-mono text-[8px] font-black uppercase text-white backdrop-blur-md">
            -{discount}%
          </span>
        )}
      </Link>

      {/* ── 2. Details & Live Controls ── */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1.5">
            <Link href={`/shop/details/${productItem._id}`}>
              <h2 className="truncate text-sm font-black uppercase tracking-tight text-[#111111] transition-colors hover:text-neutral-600 sm:text-base">
                {productItem.name || productItem.description}
              </h2>
            </Link>

            {/* Size & Color Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {productItem.size && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-neutral-200/80 bg-[#F8F8F8] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                  Size:{" "}
                  <strong className="text-[#111111]">{productItem.size}</strong>
                </span>
              )}

              {productItem.colors && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-[#F8F8F8] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/20"
                    style={{
                      backgroundColor: String(productItem.colors),
                    }}
                  />
                  <span>{productItem.colors}</span>
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              remove(productItem);
              router.refresh();
              toast.error(`${productItem.name || "Garment"} removed from bag`);
            }}
            title="Remove item"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-rose-200/70 bg-rose-50/70 text-rose-500 transition-all hover:border-rose-600 hover:bg-rose-600 hover:text-white"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>

        {/* Bottom Row: Price Breakdown + Interactive Quantity Stepper */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-neutral-100 pt-2.5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base font-black text-[#111111] sm:text-lg">
                ${finalPrice.toFixed(2)}
              </span>

              {discount > 0 && (
                <span className="font-mono text-xs font-bold text-neutral-400 line-through">
                  ${originalTotal.toFixed(2)}
                </span>
              )}
            </div>
            <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              ${Number(productItem.price || 0).toFixed(2)} / unit
            </span>
          </div>

          {/* Live Quantity Stepper */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-[#F4F3F4] p-1">
            <button
              type="button"
              disabled={qty <= 1}
              onClick={() => handleQuantityChange(qty - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-[#111111] shadow-2xs transition-all hover:bg-[#111111] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>

            <span className="min-w-[20px] text-center font-mono text-xs font-black text-[#111111]">
              {String(qty).padStart(2, "0")}
            </span>

            <button
              type="button"
              disabled={qty >= maxStock}
              onClick={() => handleQuantityChange(qty + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-[#111111] shadow-2xs transition-all hover:bg-[#111111] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
