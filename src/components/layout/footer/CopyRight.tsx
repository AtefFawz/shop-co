"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { pay } from "@/data/payType";
import { ArrowUp, ShieldCheck } from "lucide-react";

export const CopyRight = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-12 flex w-full flex-col items-center justify-between gap-5 border-t border-neutral-300/80 pt-6 sm:mt-14 md:flex-row">
      {/* حقوق الملكية + شارة الأمان */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-center md:justify-start">
        <p className="text-xs font-medium text-neutral-500 sm:text-sm">
          Shop.co &copy; 2000-{new Date().getFullYear()}, All Rights Reserved
        </p>

        <span className="hidden h-3.5 w-px bg-neutral-300 sm:inline-block" />

        <span className="inline-flex items-center gap-1 rounded-md border border-neutral-300/70 bg-white/80 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 shadow-2xs">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>SSL Verified</span>
        </span>
      </div>

      {/* كروت الدفع + زرار الصعود لأعلى الصفحة */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:justify-end">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {pay.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="flex h-8 w-12 items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-2 py-1 shadow-xs sm:h-8.5 sm:w-13"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={46}
                height={24}
                className="h-full w-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        <span className="mx-1 hidden h-5 w-px bg-neutral-300 sm:inline-block" />

        {/* زرار تفاعلي للصعود لأعلى الصفحة */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          title="Back to top"
          className="group flex h-8.5 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-300/90 bg-white px-3 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-xs transition-colors hover:border-black hover:bg-black hover:text-white"
        >
          <span>Top</span>
          <ArrowUp
            size={12}
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </motion.button>
      </div>
    </div>
  );
};
