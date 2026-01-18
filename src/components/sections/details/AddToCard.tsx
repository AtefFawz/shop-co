"use client";
import { motion } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useProduct } from "@/store/cardStore";

export const ButtonCard = ({ item }: { item: Product }) => {
  const Choosing = useProduct((e) => e.stack);
  console.log(item);
  const update = useProduct((e) => e.update);
  return (
    <div>
      <motion.button
        onClick={() => {
          update(item);
          toast.success(`${item.title} added to cart!`);
        }}
        whileTap={{ opacity: 0.7, scale: 0.98 }}
        transition={{ duration: 0.6 }}
        className="w-full py-2 px-4 text-sm lg:text-lg font-bold text-[#ffffff] bg-gray-950 rounded-full  cursor-pointer inset-shadow-xl "
      >
        Add To Card
      </motion.button>
    </div>
  );
};
