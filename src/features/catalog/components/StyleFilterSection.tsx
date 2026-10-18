"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProductStyleFilter } from "@/features/catalog/components/ProductStyleFilter";

const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

export const StyleFilterSection = () => {
  const [active, setActive] = useState(true);

  return (
    <div className="w-full py-1">
      <button
        type="button"
        onClick={() => setActive((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between py-3.5"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
          Dress Aesthetic
        </span>
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
        <div className="overflow-hidden pb-3 pt-1">
          <ProductStyleFilter content={DRESS_STYLES} />
        </div>
      </div>
    </div>
  );
};
