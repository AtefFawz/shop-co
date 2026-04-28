"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FilterButton } from "@/components/common/FilterButton";

const fil = ["Casual", "Formal", "Party", "Gym"];

export const Sections = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="w-full border-b border-gray-100 pb-1">
      <button
        onClick={() => setActive((p) => !p)}
        className="flex items-center justify-between w-full py-4 cursor-pointer"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-700">
          Dress Style
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${active ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pb-4 pt-1">
          <FilterButton content={fil} />
        </div>
      </div>
    </div>
  );
};
