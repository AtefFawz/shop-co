"use client";
import { motion } from "motion/react";
export const ButtonCard = () => {
  return (
    <div>
      <motion.button
        whileTap={{ opacity: 0.7, scale: 0.98 }}
        transition={{ duration: 0.6 }}
        className="w-full py-2 px-4 text-sm lg:text-lg font-bold text-[#ffffff] bg-gray-950 rounded-full  cursor-pointer inset-shadow-xl "
      >
        Add To Card
      </motion.button>
    </div>
  );
};
