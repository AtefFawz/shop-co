"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingBag, Ruler, Sparkles, ArrowRight, X } from "lucide-react";
import Colors from "@/components/common/Colors";
import Sizes from "@/components/common/Sizes";
import Counter from "./Counter";
import { useProduct } from "@/store/cardStore";
import { useRouter } from "next/navigation";

export default function ProductClientWrapper({ product }: { product: any }) {
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
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Added to Atelier Bag
            </p>
            <p className="truncate text-xs font-bold text-white">
              {quantity}× {product.name || product.section}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              router.push("/shop/details/cart");
              toast.dismiss(t.id);
            }}
            className="shrink-0 cursor-pointer rounded-full bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-[#111111] transition-transform hover:scale-105"
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 text-[#111111] shadow-2xl">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-black hover:text-white"
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
                <tr className="border-b border-neutral-200 text-[10px] font-black uppercase text-neutral-400">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Waist</th>
                  <th className="py-2">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-xs font-bold">
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
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Select Finish / Color
          </h3>
          {selectedColor && typeof selectedColor === "string" && (
            <span className="font-mono text-[10px] font-bold uppercase text-neutral-600">
              {selectedColor}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Colors
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      </div>

      {/* ── 2. Choose Size ── */}
      <div className="space-y-2.5 border-t border-neutral-100 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Select Tailored Size
          </h3>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-[#111111]"
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
      <div className="space-y-3 border-t border-neutral-100 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Quantity &amp; Dispatch
          </h3>
          <span className="font-mono text-[10px] font-bold text-neutral-500">
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
            className={`group relative flex min-h-[50px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_34px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 sm:col-span-8 ${
              isExceedingStock
                ? "cursor-not-allowed bg-neutral-300 opacity-50 shadow-none"
                : "bg-[#111111] hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_22px_42px_-8px_rgba(0,0,0,0.55)] active:scale-[0.99]"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <ShoppingBag size={15} className="relative z-10" />
            <span className="relative z-10">Add To Bag</span>
            {totalSelectedPrice > 0 && (
              <span className="relative z-10 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-black text-white">
                ${totalSelectedPrice.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
