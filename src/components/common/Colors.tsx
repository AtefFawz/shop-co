"use client";

import CheckIcon from "@mui/icons-material/Check";

export default function Colors({
  product,
  selectedColor,
  setSelectedColor,
}: any) {
  const ex = product.colors.join(",");
  const result = ex.split(",");
  if (!ex) {
    return;
  }
  return (
    <div className="flex items-center gap-2">
      {result.map((color: any, id: any) => {
        const isSelected = selectedColor === color;
        const isWhite =
          color.toLowerCase() === "#ffffff" || color.toLowerCase() === "white";

        return (
          <button
            key={id}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            className={`relative flex items-center justify-center lg:w-10 lg:h-10 w-full h-7 rounded-full cursor-pointer transition-all duration-200 
              ${isSelected ? "ring-1 ring-offset-2 ring-gray-500 scale-110" : "hover:scale-105"}
              ${isWhite ? "border border-gray-200" : ""}`}
          >
            {isSelected && (
              <CheckIcon
                className={`text-sm lg:text-base ${isWhite ? "text-black" : "text-white"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
