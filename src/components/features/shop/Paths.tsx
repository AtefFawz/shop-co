"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

export const ShopPaths = () => {
  const router = useRouter();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-4 z-40 flex items-center gap-2 lg:left-8">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-[#111111]/95 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_16px_36px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors hover:bg-black"
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">Back</span>
      </motion.button>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToTop}
            title="Scroll to top"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#111111] shadow-[0_12px_28px_rgba(0,0,0,0.15)] backdrop-blur-md hover:bg-[#111111] hover:text-white"
          >
            <ArrowUp size={15} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
