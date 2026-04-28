"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { FilterButton } from "@/components/common/FilterButton";
import PriceSlider from "../menu/Slider";
import { Colors } from "../menu/Colors";
import { Sizing } from "../menu/Sizing";
import { useFilterStore } from "@/store/filterStore";

const fil = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];
const dress = ["Casual", "Formal", "Party", "Gym"];

export default function MobileFilterDrawer() {
  const reset = useFilterStore((e) => e.resetFilter);
  const product = useFilterStore((e) => e.filteredProducts);
  const [open, setOpen] = React.useState(false);

  const find = product.find((e: any) => e._id);

  return (
    <div className="flex items-center justify-between w-full">
      {/* Breadcrumb */}
      <p className="text-xs font-bold text-gray-500 truncate">
        Shopping
        {find?.type && (
          <>
            {" "}
            <span className="text-gray-300">/</span> {find.type}
          </>
        )}
        {find?.section && (
          <>
            {" "}
            <span className="text-gray-300">/</span> {find.section}
          </>
        )}
      </p>

      {/* Filter trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700 hover:border-gray-400 transition-colors shadow-sm flex-shrink-0"
      >
        <SlidersHorizontal size={13} />
        Filter
      </button>

      {/* Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { borderRadius: "24px 24px 0 0", maxHeight: "85vh" },
        }}
      >
        <div className="px-5 pb-8 overflow-y-auto">
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-gray-700" />
              <span className="text-sm font-black uppercase tracking-tight">
                Filters
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <RotateCcw size={11} />
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <Divider sx={{ mb: 2 }} />

          {/* Category */}
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
              Category
            </p>
            <FilterButton content={fil} />
          </div>

          <Divider sx={{ mb: 1 }} />

          <PriceSlider />
          <Colors />
          <Sizing />

          <Divider sx={{ my: 1 }} />

          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
              Dress Style
            </p>
            <FilterButton content={dress} />
          </div>

          {/* Apply button */}
          <button
            onClick={() => setOpen(false)}
            className="w-full mt-6 bg-black text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>
    </div>
  );
}
