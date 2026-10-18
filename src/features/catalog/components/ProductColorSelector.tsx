"use client";

import CheckIcon from "@mui/icons-material/Check";

export default function ProductColorSelector({
  product,
  selectedColor,
  setSelectedColor,
}: any) {
  const ex = product.colors.join(",");
  const result = ex.split(",");
  if (!result) {
    return;
  }

  return (
    <div className="flex items-center gap-2">
      {result.map((color: string, id: number) => {
        const isSelected = selectedColor === color;
        const isWhite =
          color.toLowerCase() === "#ffffff" || color.toLowerCase() === "white";

        return (
          <button
            key={id}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            className={`relative flex items-center justify-center lg:w-10 lg:h-10 w-7 h-7 rounded-full cursor-pointer transition-all duration-200 
              ${isSelected ? "ring-1 ring-offset-2 ring-border-strong scale-110" : "hover:scale-105"}
              ${isWhite ? "border border-border" : ""}`}
          >
            {isSelected && (
              <CheckIcon
                className={`text-sm lg:text-base ${isWhite ? "text-primary" : "text-on-action"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
