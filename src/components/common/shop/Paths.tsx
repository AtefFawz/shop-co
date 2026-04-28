"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ShopPaths = () => {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.back()}
      className="fixed bottom-8 left-4 lg:left-10 z-40 flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-full shadow-xl shadow-black/20 hover:bg-gray-800 transition-colors"
    >
      <ArrowLeft size={15} />
      <span className="hidden sm:inline">Back</span>
    </motion.button>
  );
};
