"use client";

import React from "react";
import { useFilterStore } from "@/store/filterStore";
import { ChevronRight, Check } from "lucide-react";

export const StyleButton = ({ content }: { content: string[] }) => {
  const set = useFilterStore((state) => state.filterByStyle);
  const currentStyle = useFilterStore((state) => state.currentStyle);

  return (
    <div className="w-full space-y-1.5">
      {content.map((item, id) => {
        const isActive = currentStyle === item;
        return (
          <button
            key={id}
            type="button"
            onClick={() => set(item)}
            className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-[#111111] text-white shadow-xs"
                : "bg-[#F8F8F8] text-neutral-600 hover:bg-neutral-200/70 hover:text-[#111111]"
            }`}
          >
            <span>{item}</span>
            {isActive ? (
              <Check size={13} strokeWidth={3} className="text-emerald-400" />
            ) : (
              <ChevronRight
                size={14}
                className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#111111]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
