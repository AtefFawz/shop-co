"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingBag, Ruler, Sparkles, ArrowRight, X } from "lucide-react";
import ProductColorSelector from "@/features/catalog/components/ProductColorSelector";
import Sizes from "@/features/catalog/components/ProductSizeSelector";
import Counter from "@/features/catalog/components/ProductQuantitySelector";
import { useProduct } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function ProductDetailsClient({ product }: { product: any }) {
  const update = useProduct((state) => state.update);
  const router = useRouter();

  // Safely initialize first color/size if array is provided
  const [selectedColor, setSelectedColor] = useState(() =>
    Array.isArray(product?.colors) ? product.colors[0] : product?.colors,
  );
  const [selectedSize, setSelectedSize] = useState(() =>
    Array.isArray(product?.size) ? product.size[0] : product?.size,
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const maxStock = Math.max(0, Number(product?.countInStock ?? 10));
  const isAtMaxStock = quantity >= maxStock;
  const isExceedingStock = quantity > maxStock || maxStock === 0;

  const unitPrice = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const effectiveUnitPrice =
    discount > 0 ? Math.round(unitPrice * (1 - discount / 100)) : unitPrice;
  const totalSelectedPrice = effectiveUnitPrice * quantity;

  const handleAddToCart = (redirectImmediate = false) => {
    const finalProduct = {
      ...product,
      colors: selectedColor,
      size: selectedSize,
      count: quantity,
      isChose: true,
    };

    update(finalProduct);

    if (redirectImmediate) {
      router.push("/shop/details/cart");
      return;
    }

    toast.success(
      (t) => (
        <div className="flex items-center gap-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-success">
              Added to Atelier Bag
            </p>
            <p className="truncate text-xs font-bold text-on-action">
              {quantity}× {product.name || product.section}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              router.push("/shop/details/cart");
              toast.dismiss(t.id);
            }}
            className="shrink-0 cursor-pointer rounded-full bg-surface px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-primary transition-transform hover:scale-105"
          >
            View Bag ↗
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: "top-center",
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {/* ── Interactive Size Guide Modal ── */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-action/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-surface p-6 text-primary shadow-2xl">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-muted text-secondary hover:bg-action hover:text-on-action"
            >
              <X size={15} />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <Ruler size={16} />
              <h4 className="text-sm font-black uppercase tracking-wider">
                SHOP.CO™ Standard Sizing (CM)
              </h4>
            </div>

            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] font-black uppercase text-muted">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Waist</th>
                  <th className="py-2">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono text-xs font-bold">
                <tr>
                  <td className="py-2 font-sans font-black">Small (S)</td>
                  <td className="py-2">92–96</td>
                  <td className="py-2">76–80</td>
                  <td className="py-2">70</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">Medium (M)</td>
                  <td className="py-2">98–102</td>
                  <td className="py-2">82–86</td>
                  <td className="py-2">72</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">Large (L)</td>
                  <td className="py-2">104–108</td>
                  <td className="py-2">88–92</td>
                  <td className="py-2">74</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">X-Large (XL)</td>
                  <td className="py-2">110–116</td>
                  <td className="py-2">94–100</td>
                  <td className="py-2">76</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 1. Select Color ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            Select Finish / Color
          </h3>
          {selectedColor && typeof selectedColor === "string" && (
            <span className="font-mono text-[10px] font-bold uppercase text-secondary">
              {selectedColor}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <ProductColorSelector
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      </div>

      {/* ── 2. Choose Size ── */}
      <div className="space-y-2.5 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            Select Tailored Size
          </h3>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-black uppercase tracking-wider text-secondary underline decoration-border-strong underline-offset-4 hover:text-primary"
          >
            <Ruler size={12} />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Sizes
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </div>
      </div>

      {/* ── 3. Quantity & 3D Add To Bag CTA ── */}
      <div className="space-y-3 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            Quantity &amp; Dispatch
          </h3>
          <span className="font-mono text-[10px] font-bold text-muted">
            Max available: {maxStock}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <Counter
              quantity={quantity}
              setQuantity={setQuantity}
              logicQuantity={isAtMaxStock}
              maxStock={maxStock}
            />
          </div>

          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            disabled={isExceedingStock}
            className={`group relative flex min-h-[50px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-[0_16px_34px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all duration-300 sm:col-span-8 ${
              isExceedingStock
                ? "cursor-not-allowed bg-surface-hover opacity-50 shadow-none"
                : "bg-action hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-[0_22px_42px_-8px_rgba(var(--shadow-rgb),0.55)] active:scale-[0.99]"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <ShoppingBag size={15} className="relative z-10" />
            <span className="relative z-10">Add To Bag</span>
            {totalSelectedPrice > 0 && (
              <span className="relative z-10 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-black text-on-action">
                ${totalSelectedPrice.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
