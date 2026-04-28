"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Brand_Item } from "@/data/brand";
import { ArrowUpRight } from "lucide-react";

export const Brands = () => {
  return (
    <section className="bg-[#F8F8F8] py-16 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-400 inline-block" />
              Trusted Partners
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none text-gray-900">
              Browse Brands
            </h2>
          </div>
          <p className="text-sm text-gray-400 font-medium max-w-xs sm:text-right leading-relaxed">
            Shop from the world's most iconic fashion labels, all in one place.
          </p>
        </div>

        {/* ── Brand Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Brand_Item.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 cursor-pointer hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-300 overflow-hidden"
              >
                {/* Hover top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Arrow icon */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-black">
                  <ArrowUpRight
                    size={13}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </div>

                {/* Brand image */}
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  <Image
                    src={brand.Icon}
                    alt={brand.name}
                    width={160}
                    height={80}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                {/* Brand name */}
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-500 text-center mt-3 transition-colors duration-300">
                  {brand.name}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="flex items-center justify-center mt-10 sm:mt-14">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gray-200" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 border-2 border-gray-200 hover:border-black text-gray-600 hover:text-black px-6 sm:px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              View All Brands
              <ArrowUpRight size={14} />
            </motion.button>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
};
