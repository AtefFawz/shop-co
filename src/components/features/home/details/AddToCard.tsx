"use client";

import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { Product } from "@/types";

export const ButtonCard = ({ item }: { item: Product }) => {
  const title = item?.name || item?.description || "Atelier Garment";

  return (
    <div className="w-full">
      <motion.button
        type="button"
        onClick={() => {
          toast.success(`${title} added to your bag!`);
        }}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#111111] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_-8px_rgba(0,0,0,0.4)] transition-all hover:bg-neutral-800 sm:text-sm"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <ShoppingBag size={15} className="relative z-10" />
        <span className="relative z-10">Add To Bag</span>
        <ArrowUpRight
          size={14}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </motion.button>
    </div>
  );
};
