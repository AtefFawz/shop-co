"use client";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useFilterStore } from "@/store/filterStore";

const BlackSlider = styled(Slider)({
  color: "#000",
  height: 4,
  "& .MuiSlider-track": { border: "none" },
  "& .MuiSlider-rail": { opacity: 0.15 },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2.5px solid #000",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 6px rgba(0,0,0,0.08)",
    },
    "&::before": { display: "none" },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 11,
    fontWeight: 800,
    background: "#000",
    borderRadius: 8,
    padding: "3px 7px",
  },
});

export default function PriceSlider() {
  const [price, setPrice] = useState<number>(1000);
  const filterPrice = useFilterStore((s) => s.filterPrice);

  return (
    <div className="w-full border-b border-gray-100 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-700">
          Price Range
        </span>
        <span className="text-xs font-black text-gray-900">
          Up to ${price.toLocaleString()}
        </span>
      </div>
      <Box sx={{ px: 0.5 }}>
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
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400 font-bold">$0</span>
        <span className="text-[10px] text-gray-400 font-bold">$5,000</span>
      </div>
    </div>
  );
}
