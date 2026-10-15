"use client";

import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useFilterStore } from "@/store/filterStore";

const BlackSlider = styled(Slider)({
  color: "#111111",
  height: 5,
  "& .MuiSlider-track": { border: "none", borderRadius: 999 },
  "& .MuiSlider-rail": { opacity: 0.15, backgroundColor: "#111111" },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#ffffff",
    border: "3px solid #111111",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 6px rgba(17,17,17,0.10)",
    },
    "&::before": { display: "none" },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 10,
    fontWeight: 900,
    background: "#111111",
    borderRadius: 8,
    padding: "3px 8px",
  },
});

const PRESETS = [
  { label: "≤ $150", val: 150 },
  { label: "≤ $500", val: 500 },
  { label: "≤ $1.5k", val: 1500 },
  { label: "All", val: 5000 },
];

export default function PriceSlider() {
  const [price, setPrice] = useState<number>(1000);
  const filterPrice = useFilterStore((s) => s.filterPrice);

  const applyPreset = (val: number) => {
    setPrice(val);
    filterPrice?.(val);
  };

  return (
    <div className="w-full py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-800">
          Price Ceiling
        </span>
        <span className="rounded-lg bg-[#111111] px-2.5 py-0.5 font-mono text-[11px] font-black text-white">
          Up to ${price.toLocaleString()}
        </span>
      </div>

      <Box sx={{ px: 1 }}>
        <BlackSlider
          valueLabelDisplay="auto"
          value={price}
          onChange={(_, v) => setPrice(v as number)}
          onChangeCommitted={(_, v) => filterPrice?.(v as number)}
          min={0}
          max={5000}
          valueLabelFormat={(v) => `$${v}`}
        />
      </Box>

      <div className="mt-1 flex justify-between font-mono text-[10px] font-bold text-neutral-400">
        <span>$0</span>
        <span>$5,000</span>
      </div>

      {/* Quick Price Presets */}
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.val)}
            className={`cursor-pointer rounded-lg border py-1 font-mono text-[9px] font-black uppercase transition-all ${
              price === p.val
                ? "border-black bg-[#111111] text-white"
                : "border-neutral-200 bg-[#F8F8F8] text-neutral-600 hover:border-black"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
