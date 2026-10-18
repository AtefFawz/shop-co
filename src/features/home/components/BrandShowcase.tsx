"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { brandCatalogItems } from "@/features/home/data/brandCatalog";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export const BrandShowcase = () => {
  const router = useRouter();

  const handleNavigateShop = () => {
    router.push("/shop");
  };

  return (
    <section className="relative isolate overflow-hidden bg-surface-subtle py-16 text-primary sm:py-22">
      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_80%_70%_at_50%_50%,#000_50%,transparent_100%)]"
      />

      <div className="Responsive relative z-10">
        {/* ── Header ── */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">
                OFFICIAL FLAGSHIP PARTNERS
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[-0.04em] leading-none text-primary sm:text-3xl lg:text-4xl">
              Browse Luxury Houses
            </h2>
          </div>

          <p className="max-w-xs text-xs font-medium leading-relaxed text-muted sm:text-right sm:text-sm">
            Shop authenticated garments from the world&apos;s most iconic
            fashion labels, curated in one archive.
          </p>
        </div>

        {/* ── 3D Brand Grid ── */}
        <div
          style={{ perspective: "1200px" }}
          className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {brandCatalogItems.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <motion.div
                onClick={handleNavigateShop}
                whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.06)] transition-colors duration-300 hover:border-border hover:shadow-[0_24px_48px_-12px_rgba(var(--shadow-rgb),0.14)] cursor-pointer sm:p-6"
              >
                {/* Top Index & Action Arrow */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-subtle transition-colors group-hover:text-secondary">
                    HOUSE // 0{index + 1}
                  </span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-surface-subtle text-muted transition-all duration-300 group-hover:rotate-45 group-hover:bg-action group-hover:text-on-action">
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Brand Logo Stage */}
                <div className="my-4 flex h-16 items-center justify-center sm:h-20">
                  <Image
                    src={brand.Icon}
                    alt={brand.name}
                    width={160}
                    height={80}
                    className="h-full w-full object-contain grayscale opacity-75 transition-all duration-500 group-hover:scale-108 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>

                {/* Brand Name & Verified Pill */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <p className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-primary">
                    {brand.name}
                  </p>
                  <ShieldCheck
                    size={13}
                    className="shrink-0 text-subtle transition-colors group-hover:text-success"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 flex items-center justify-center sm:mt-14">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-border-strong sm:w-28" />
            <motion.button
              type="button"
              onClick={handleNavigateShop}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-action px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.35)] transition-all hover:bg-action-hover sm:px-9"
            >
              <span>Explore All Partners</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.button>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-border-strong sm:w-28" />
          </div>
        </div>
      </div>
    </section>
  );
};
