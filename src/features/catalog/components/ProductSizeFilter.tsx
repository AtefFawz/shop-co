"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SIZES = [
  { label: "XX-Small", short: "XXS" },
  { label: "X-Small", short: "XS" },
  { label: "Small", short: "S" },
  { label: "Medium", short: "M" },
  { label: "Large", short: "L" },
  { label: "X-Large", short: "XL" },
  { label: "XX-Large", short: "2XL" },
  { label: "3X-Large", short: "3XL" },
  { label: "4X-Large", short: "4XL" },
];

export const ProductSizeFilter = () => {
  const [active, setActive] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="w-full py-1">
      <button
        type="button"
        onClick={() => setActive((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between py-3.5"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
            Garment Size
          </span>
          {selectedSize && (
            <span className="rounded-md bg-action px-2 py-0.5 font-mono text-[9px] font-black text-on-action">
              {selectedSize}
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-muted transition-transform duration-300 ${
            active ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-3 gap-2 pb-4 pt-1">
            {SIZES.map((s) => {
              const isSelected = selectedSize === s.label;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() =>
                    setSelectedSize((prev) =>
                      prev === s.label ? null : s.label,
                    )
                  }
                  title={s.label}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border py-2 px-2 transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "border-border-strong bg-action text-on-action shadow-sm"
                      : "border-border/80 bg-surface-subtle text-secondary hover:border-border-strong hover:bg-surface"
                  }`}
                >
                  <span className="font-mono text-xs font-black leading-none">
                    {s.short}
                  </span>
                  <span
                    className={`mt-1 text-[8px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-on-action/65" : "text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
