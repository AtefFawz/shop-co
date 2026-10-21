"use client";

type ProductSizeSelectorProps = {
  product: { size?: string[] | string | null };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
};

export default function ProductSizeSelector({
  product,
  selectedSize,
  setSelectedSize,
}: ProductSizeSelectorProps) {
  const sizes = Array.isArray(product?.size)
    ? product.size
    : typeof product?.size === "string"
      ? product.size.split(",")
      : [];
  const normalizedSizes = [...new Set(sizes.map((size) => size.trim()).filter(Boolean))];

  if (!normalizedSizes.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a size">
      {normalizedSizes.map((size) => {
        const isSelected = selectedSize === size;
        return (
          <button
            key={size}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setSelectedSize(size)}
            className={`min-w-14 cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98] sm:min-w-16 ${
              isSelected
                ? "border-action bg-action text-on-action shadow-sm"
                : "border-border bg-surface-muted text-primary hover:border-border-strong hover:bg-surface-hover"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
