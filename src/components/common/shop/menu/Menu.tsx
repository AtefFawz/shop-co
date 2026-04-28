"use client";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { FilterButton } from "@/components/common/FilterButton";
import PriceSlider from "./Slider";
import { Colors } from "./Colors";
import { Sizing } from "./Sizing";
import { Sections } from "./Sections";

export const fil = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];

export const Menu = () => {
  const reset = useFilterStore((s) => s.resetFilter);
  return (
    <nav className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-gray-700" />
          <span className="text-sm font-black uppercase tracking-tight text-gray-900">
            Filters
          </span>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      {/* Filter sections */}
      <div className="px-5 space-y-0">
        <div className="border-b border-gray-100 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
            Category
          </p>
          <FilterButton content={fil} />
        </div>

        <PriceSlider />
        <Colors />
        <Sizing />
        <Sections />
      </div>
    </nav>
  );
};
