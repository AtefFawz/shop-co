"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export default function Counter({
  quantity,
  setQuantity,
  logicQuantity,
  maxStock = 99,
}: any) {
  const isMin = quantity <= 1;
  const isMax = Boolean(logicQuantity) || quantity >= maxStock;

  return (
    <article className="h-full w-full">
      <div className="flex h-full min-h-[50px] w-full items-center justify-between rounded-full border border-neutral-200/90 bg-[#F4F3F4] px-2 py-1.5 shadow-inner">
        <button
          type="button"
          disabled={isMin}
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#111111] shadow-2xs transition-all duration-200 active:scale-90 ${
            isMin
              ? "cursor-not-allowed opacity-35"
              : "hover:bg-[#111111] hover:text-white"
          }`}
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>

        <span className="px-2 font-mono text-sm font-black text-[#111111] select-none">
          {String(quantity).padStart(2, "0")}
        </span>

        <button
          type="button"
          disabled={isMax}
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Increase quantity"
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#111111] shadow-2xs transition-all duration-200 active:scale-90 ${
            isMax
              ? "cursor-not-allowed opacity-30"
              : "hover:bg-[#111111] hover:text-white"
          }`}
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
