"use client";
import { useRouter } from "next/navigation";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";
import { motion } from "framer-motion";
export const ShopPaths = () => {
  const router = useRouter();
  return (
    <motion.button
      whileTap={{ x: -500 }}
      transition={{ duration: 0.6 }}
      onClick={() => router.back()}
      className="fixed bottom-16  bg-gray-900 p-2 md:p-4 text-[#EEEEEE] rounded-[9999px] cursor-pointer left-5 lg:left-16 text-2xl hover:shadow-2xl shadow-blue-600  duration-300 "
    >
      <HiOutlineArrowSmallLeft />
    </motion.button>
  );
};
