"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const array = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

export const Sizing = () => {
  const [active, setActive] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  return (
    <div className="w-full border-b border-gray-100 pb-1">
      <button
        onClick={() => setActive((p) => !p)}
        className="flex items-center justify-between w-full py-4 cursor-pointer"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-700">
          Size
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
        <div className="overflow-hidden">
          <div className="grid grid-cols-3 md:grid-cols-2 gap-4 items-center justify-center">
            {array.map((e: any, id: any) => (
              <button
                key={id}
                style={{
                  backgroundColor: selectedSize === e ? "black" : "#e5e7eb",
                  color: selectedSize === e ? "white" : "gray",
                }}
                onClick={() => setSelectedSize(e)}
                className=" min-w-fit px-4 py-1 text-sm font-bold md:text-sm lg:text-lg text-nowrap rounded-full cursor-pointer w-16 col-span-1"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
