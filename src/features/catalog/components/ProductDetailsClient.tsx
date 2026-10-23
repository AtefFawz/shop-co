"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingBag, Ruler, X } from "lucide-react";
import ProductColorSelector from "@/features/catalog/components/ProductColorSelector";
import Sizes from "@/features/catalog/components/ProductSizeSelector";
import Counter from "@/features/catalog/components/ProductQuantitySelector";
import { useProduct } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

import Link from "next/link";

import type { Product } from "@/types";
export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const { t, locale, direction } = useLocale();
  const addItem = useProduct((state) => state.addItem);
  const router = useRouter();

  // Safely initialize first color/size if array is provided
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const colors = Array.isArray(product?.colors)
      ? product.colors
      : typeof product?.colors === "string"
        ? (product.colors as string).split(",")
        : [];
    return colors[0]?.trim() ?? "";
  });
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const sizes = Array.isArray(product?.size)
      ? product.size
      : typeof product?.size === "string"
        ? (product.size as string).split(",")
        : [];
    return sizes[0]?.trim() ?? "";
  });
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
      colors: selectedColor ? [selectedColor] : [],
      size: selectedSize ? [selectedSize] : [],
      count: quantity,
      isChose: true,
    };

    addItem(finalProduct);

    if (redirectImmediate) {
      router.push("/shop/details/cart");
      return;
    }

    toast.success(
      (toastInstance) => (
        <div className="flex w-full min-w-0 flex-col gap-1.5">
          <div className="flex w-full min-w-0 items-center justify-between gap-2">
            <span className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-success">
              {t("productAddedToBag")}
            </span>

            <Link
              href="/shop/details/cart"
              onClick={() => toast.dismiss(toastInstance.id)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-subtle px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-primary shadow-2xs transition-colors hover:bg-action hover:text-on-action"
            >
              <span>{t("productViewBag")}</span>
            </Link>
          </div>

          <p className="truncate text-[11px] font-extrabold uppercase tracking-tight text-primary">
            {quantity}×{" "}
            {product.name.length > 46
              ? `${product.name.slice(0, 46)}…`
              : product.name}
          </p>
        </div>
      ),
      { duration: 3500 },
    );
  };

  return (
    <div dir={direction} className="flex w-full flex-col gap-5">
      {/* ── Interactive Size Guide Modal ── */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-action/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-surface p-6 text-primary shadow-2xl">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="absolute end-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-muted text-secondary hover:bg-action hover:text-on-action"
            >
              <X size={15} />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <Ruler size={16} />
              <h4 className="text-sm font-black uppercase tracking-wider">
                {t("productStandardSizing")}
              </h4>
            </div>

            <table className="w-full border-collapse text-start text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] font-black uppercase text-muted">
                  <th className="py-2">{t("size")}</th>
                  <th className="py-2">{t("productChest")}</th>
                  <th className="py-2">{t("productWaist")}</th>
                  <th className="py-2">{t("productLength")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono text-xs font-bold">
                <tr>
                  <td className="py-2 font-sans font-black">
                    {locale === "ar" ? t("sizeSmall") : "Small (S)"}
                  </td>
                  <td className="py-2">92–96</td>
                  <td className="py-2">76–80</td>
                  <td className="py-2">70</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">
                    {locale === "ar" ? t("sizeMedium") : "Medium (M)"}
                  </td>
                  <td className="py-2">98–102</td>
                  <td className="py-2">82–86</td>
                  <td className="py-2">72</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">
                    {locale === "ar" ? t("sizeLarge") : "Large (L)"}
                  </td>
                  <td className="py-2">104–108</td>
                  <td className="py-2">88–92</td>
                  <td className="py-2">74</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-black">
                    {locale === "ar" ? t("sizeXL") : "X-Large (XL)"}
                  </td>
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
            {t("productSelectColor")}
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
            {t("productSelectSize")}
          </h3>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-black uppercase tracking-wider text-secondary underline decoration-border-strong underline-offset-4 hover:text-primary"
          >
            <Ruler size={12} />
            <span>{t("sizeGuide")}</span>
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
            {t("productQuantityDispatch")}
          </h3>
          <span className="font-mono text-[10px] font-bold text-muted">
            {t("maxAvailable")} {maxStock}
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
            <span className="relative z-10">{t("productAddToBag")}</span>
            {totalSelectedPrice > 0 && (
              <span className="relative z-10 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-black text-on-action">
                {formatCurrency(totalSelectedPrice, locale)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
