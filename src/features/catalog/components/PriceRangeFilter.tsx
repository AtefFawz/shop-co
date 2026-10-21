"use client";

import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useFilterStore } from "@/store/filterStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

const ThemeAwareSlider = styled(Slider)({
  color: "var(--action)",
  height: 5,
  "& .MuiSlider-track": { border: "none", borderRadius: 999 },
  "& .MuiSlider-rail": { opacity: 0.65, backgroundColor: "var(--border-strong)" },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "var(--surface)",
    border: "3px solid var(--action)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 6px var(--focus-ring)",
    },
    "&::before": { display: "none" },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 10,
    fontWeight: 900,
    background: "var(--action)",
    color: "var(--text-on-action)",
    borderRadius: 8,
    padding: "3px 8px",
  },
});

const PRESETS = [150, 500, 1500, 5000];

export default function PriceRangeFilter() {
  const { t, locale, direction } = useLocale();
  const [price, setPrice] = useState<number>(1000);
  const filterPrice = useFilterStore((s) => s.filterPrice);

  const applyPreset = (val: number) => {
    setPrice(val);
    filterPrice?.(val);
  };

  return (
    <div dir={direction} className="w-full py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
          {t("priceCeiling")}
        </span>
        <span className="rounded-lg bg-action px-2.5 py-0.5 font-mono text-[11px] font-black text-on-action">
          {t("upTo")} {formatCurrency(price, locale)}
        </span>
      </div>

      <Box sx={{ px: 1 }}>
        <ThemeAwareSlider
          valueLabelDisplay="auto"
          value={price}
          onChange={(_, v) => setPrice(v as number)}
          onChangeCommitted={(_, v) => filterPrice?.(v as number)}
          min={0}
          max={5000}
          valueLabelFormat={(v) => formatCurrency(v, locale)}
        />
      </Box>

      <div className="mt-1 flex justify-between font-mono text-[10px] font-bold text-muted">
        <span>{formatCurrency(0, locale)}</span>
        <span>{formatCurrency(5000, locale)}</span>
      </div>

      {/* Quick Price Presets */}
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => applyPreset(preset)}
            className={`cursor-pointer rounded-lg border py-1 font-mono text-[9px] font-black uppercase transition-all ${
              price === preset
                ? "border-border-strong bg-action text-on-action"
                : "border-border bg-surface-subtle text-secondary hover:border-border-strong"
            }`}
          >
            {preset === 5000 ? t("allPrices") : `${t("upTo")} ${formatCurrency(preset, locale)}`}
          </button>
        ))}
      </div>
    </div>
  );
}
