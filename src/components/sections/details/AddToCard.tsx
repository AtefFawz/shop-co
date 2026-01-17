"use client";
import { motion } from "motion/react";
import { useProduct } from "@/store/cardStore";
import { products } from "@/data/data";
export const ButtonCard = () => {
  const Choosing = useProduct((e) => e.stack);
  const update = useProduct((e) => e.update);
  const result = Choosing.map((product) => product);
  console.log(Choosing.forEach((product) => product));
  return (
    <div>
      <motion.button
        onClick={() => {
          // console.log(result);
          Choosing.map((product) => console.log(product));
          Choosing.map((e) => {
            console.log(Choosing);
            update(e);
          });
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
