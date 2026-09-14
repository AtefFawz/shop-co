"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CheckIcon from "@mui/icons-material/Check";

const arrayOfColor = [
  "#9f0712",
  "#193cb8",
  "#7bf1a8",
  "#000000",
  "#fff085",
  "#6e11b0",
  "#3d2b1f",
  "#7b3306",
  "#0F2854",
  "#89986D",
  "#301CA0",
  "#FF937E",
  "#540863",
  "#777C6D",
  "#3C467B",
];

export const Colors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <div className="w-full border-b border-gray-100 pb-1">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center justify-between w-full py-4 cursor-pointer outline-none"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-700">
          Colors
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2.5 pb-4 pt-1">
            {arrayOfColor.map((color, i) => {
              const isSelected = selectedColor === color;
              const isWhite =
                color.toLowerCase() === "#ffffff" ||
                color.toLowerCase() === "white";

              return (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`relative flex items-center justify-center lg:w-9 lg:h-9 w-8 h-8 rounded-full cursor-pointer transition-all duration-200 
                    ${isSelected ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}
                    ${isWhite ? "border border-gray-200" : ""}`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {isSelected && (
                    <CheckIcon
                      className={`text-sm ${isWhite ? "text-black" : "text-white"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
