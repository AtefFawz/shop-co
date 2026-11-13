"use client";

import { getStockCount } from "@/lib/stock";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShoppingBag, Ruler, X } from "lucide-react";
import ProductColorSelector from "@/features/catalog/components/ProductColorSelector";
import Sizes from "@/features/catalog/components/ProductSizeSelector";
import Counter from "@/features/catalog/components/ProductQuantitySelector";
import { useProduct } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import { calculateFinalPrice } from "@/lib/logicPricing";

import Link from "next/link";

import type { Product } from "@/types";
import PriceAlertButton from "@/features/engagement/components/PriceAlertButton";
import { recordView } from "@/features/engagement/api";
import { useUserStore } from "@/store/userStore";
export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const { t, locale, direction } = useLocale();
  const addItem = useProduct((state) => state.addItem);
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

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

  useEffect(() => { if (isAuthenticated) recordView(product._id).catch(() => {}); }, [product._id, isAuthenticated]);

  const maxStock = getStockCount(product);
  const isAtMaxStock = quantity >= maxStock;
  const isExceedingStock = quantity > maxStock || maxStock === 0;

  const unitPrice = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const effectiveUnitPrice = calculateFinalPrice(
    unitPrice,
    discount,
    1,
    product.isSale,
  );
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
            <span className="truncate text-xs font-black uppercase tracking-[0.14em] text-success">
              {t("productAddedToBag")}
            </span>

            <Link
              href="/shop/details/cart"
              onClick={() => toast.dismiss(toastInstance.id)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-subtle px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-primary shadow-2xs transition-colors hover:bg-action hover:text-on-action"
            >
              <span>{t("productViewBag")}</span>
            </Link>
          </div>

          <p className="truncate text-xs font-extrabold uppercase tracking-tight text-primary">
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

            <div className="space-y-3">
              <p className="text-xs leading-6 text-muted">{locale === "ar" ? "المقاسات المتاحة لهذا المنتج كما أضافها المتجر. اختَر المقاس الذي تستخدمه عادةً، وراجع وصف المنتج إذا كانت هناك ملاحظات خاصة بالملاءمة." : "These are the sizes configured for this product. Choose the size you usually wear and check the product description for any fit-specific notes."}</p>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(product.size) ? product.size : []).map((size) => (
                  <span key={size} className="rounded-xl border border-border bg-surface-subtle px-4 py-2 text-xs font-black">{size}</span>
                ))}
              </div>
              <p className="text-[11px] leading-5 text-muted">{locale === "ar" ? "لا تتوفر قياسات بالسنتيمتر لهذا المنتج حاليًا؛ لن نعرض أرقامًا تقديرية قد تكون مضللة." : "Exact centimeter measurements are not available for this item, so we avoid showing estimates that could mislead you."}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Select Color ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">
            {t("productSelectColor")}
          </h3>
          {selectedColor && typeof selectedColor === "string" && (
            <span className="font-mono text-xs font-bold uppercase text-secondary">
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
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">
            {t("productSelectSize")}
          </h3>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-black uppercase tracking-wider text-secondary underline decoration-border-strong underline-offset-4 hover:text-primary"
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

      <PriceAlertButton product={product} />

      {/* ── 3. Quantity & 3D Add To Bag CTA ── */}
      <div className="space-y-3 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">
            {t("productQuantityDispatch")}
          </h3>
          <span className="font-mono text-xs font-bold text-muted">
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
            className={`group relative flex min-h-[50px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-card transition-all duration-300 sm:col-span-8 ${
              isExceedingStock
                ? "cursor-not-allowed bg-surface-hover opacity-50 shadow-none"
                : "bg-action hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-panel active:scale-[0.99]"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <ShoppingBag size={15} className="relative z-10" />
            <span className="relative z-10">{t("productAddToBag")}</span>
            {totalSelectedPrice > 0 && (
              <span className="relative z-10 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-xs font-black text-on-action">
                {formatCurrency(totalSelectedPrice, locale)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
