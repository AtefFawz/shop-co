"use client";

import CheckIcon from "@mui/icons-material/Check";

type ProductColorSelectorProps = {
  product: { colors?: string[] | string | null };
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

export default function ProductColorSelector({
  product,
  selectedColor,
  setSelectedColor,
}: ProductColorSelectorProps) {
  const colors = Array.isArray(product?.colors)
    ? product.colors
    : typeof product?.colors === "string"
      ? product.colors.split(",")
      : [];

  const normalizedColors = [...new Set(colors.map((color) => color.trim()).filter(Boolean))];
  if (normalizedColors.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Choose a color">
      {normalizedColors.map((color) => {
        const isSelected = selectedColor === color;
        const normalized = color.toLowerCase();
        const isLightColor =
          ["#fff", "#ffffff", "white", "ivory", "beige", "#f5f5dc"].includes(normalized) ||
          (normalized.startsWith("#") && normalized.length === 7 &&
            parseInt(normalized.slice(1), 16) > 0xdedede);

        return (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            aria-label={`Choose ${color}`}
            aria-pressed={isSelected}
            title={color}
            className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-[transform,box-shadow,border-color] duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:h-10 sm:w-10 ${
              isSelected
                ? "scale-105 border-transparent shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--focus)]"
                : "border-border/70 shadow-sm"
            }`}
          >
            {isSelected && (
              <CheckIcon
                aria-hidden="true"
                sx={{ fontSize: 19, color: isLightColor ? "#202124" : "#ffffff", filter: isLightColor ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,.65))" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
