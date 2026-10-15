"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { SlidersHorizontal, X, RotateCcw, Sparkles } from "lucide-react";
import { SectionButton } from "@/components/features/shop/buttons/SectionButton";
import { StyleButton } from "@/components/features/shop/buttons/StyleButton";
import PriceSlider from "../menu/Slider";
import { Colors } from "../menu/Colors";
import { Sizing } from "../menu/Sizing";
import { useFilterStore } from "@/store/filterStore";

const CATEGORIES = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

export default function MobileFilterDrawer() {
  const reset = useFilterStore((e) => e.resetFilter);
  const products = useFilterStore((e) => e.filteredProducts);
  const { currentSection, currentType, currentStyle } = useFilterStore();
  const [open, setOpen] = React.useState(false);

  const activeCount = [currentSection, currentType, currentStyle].filter(
    Boolean,
  ).length;

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white px-4 py-3 shadow-2xs">
      {/* Left Mobile Telemetry */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-black uppercase tracking-wider text-[#111111]">
          {currentSection || currentStyle || currentType || "All Collections"}
        </p>
        <p className="text-[10px] font-semibold text-neutral-400">
          {products.length} piece{products.length === 1 ? "" : "s"} available
        </p>
      </div>

      {/* Right Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xs active:scale-95"
      >
        <SlidersHorizontal size={13} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 font-mono text-[9px] font-black text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "28px 28px 0 0",
            maxHeight: "88vh",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <div className="overflow-y-auto px-5 pb-8 pt-3">
          {/* Drag Handle */}
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-200" />

          {/* Drawer Header */}
          <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111111] text-white">
                <SlidersHorizontal size={14} />
              </span>
              <div>
                <span className="block text-sm font-black uppercase tracking-tight text-[#111111]">
                  Atelier Filters
                </span>
                <span className="block text-[10px] font-semibold text-neutral-400">
                  {products.length} matching garments
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-600"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="divide-y divide-neutral-100">
            <div className="pb-4">
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Garment Category
              </p>
              <SectionButton content={CATEGORIES} />
            </div>

            <PriceSlider />
            <Colors />
            <Sizing />

            <div className="pt-4">
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Dress Aesthetic
              </p>
              <StyleButton content={DRESS_STYLES} />
            </div>
          </div>

          {/* Sticky Apply Button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg active:scale-98"
          >
            <Sparkles size={13} />
            <span>Show {products.length} Results</span>
          </button>
        </div>
      </Drawer>
    </div>
  );
}
