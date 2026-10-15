"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { SectionButton } from "@/components/features/shop/buttons/SectionButton";
import PriceSlider from "./Slider";
import { Colors } from "./Colors";
import { Sizing } from "./Sizing";
import { Sections } from "./Sections";

export const fil = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];

export const Menu = () => {
  const { resetFilter, currentSection, currentStyle, currentType } =
    useFilterStore((s) => s);

  const activeCount = [currentSection, currentStyle, currentType].filter(
    Boolean,
  ).length;

  return (
    <nav className="w-full overflow-hidden rounded-3xl border border-white/90 bg-white shadow-[0_14px_40px_-14px_rgba(0,0,0,0.07)]">
      {/* Studio Filter Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-[#F8F8F8]/70 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111111] text-white shadow-2xs">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight text-[#111111]">
                Atelier Filters
              </span>
              {activeCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 font-mono text-[9px] font-black text-white">
                  {activeCount}
                </span>
              )}
            </div>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              Refine Lookbook
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilter}
          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-neutral-200/80 bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-500 transition-all hover:border-black hover:bg-[#111111] hover:text-white active:scale-95"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Accordions */}
      <div className="divide-y divide-neutral-100 px-5">
        <div className="py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              Garment Category
            </p>
            <Sparkles size={11} className="text-neutral-300" />
          </div>
          <SectionButton content={fil} />
        </div>

        <PriceSlider />
        <Colors />
        <Sizing />
        <Sections />
      </div>
    </nav>
  );
};
