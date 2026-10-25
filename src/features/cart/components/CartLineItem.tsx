"use client";
import { resolveImageUrl } from "@/lib/imageUrl";

import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2, Minus, Plus, Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { isOutOfStock, useCartStore } from "@/store/cartStore";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types";

export const CartLineItem = ({ productItem }: { productItem: Product }) => {
  const { t, locale } = useLocale();
  const remove = useCartStore((e) => e.delete);
  const update = useCartStore((e) => e.update);
  const toggleSelected = useCartStore((e) => e.toggleSelected);
  const router = useRouter();
  const outOfStock = isOutOfStock(productItem);
  const selected = !outOfStock && productItem.isChose !== false;

  const qty = Math.max(1, Number(productItem.count ?? 1));
  const parsedStock = Number(productItem.countInStock ?? 20);
  const maxStock = Number.isFinite(parsedStock) ? Math.max(1, parsedStock) : 20;
  const discount = Number(productItem.discount || 0);

  const finalPrice = calculateFinalPrice(
    Number(productItem.price || 0),
    discount,
    qty,
  );
  const originalTotal = Number(productItem.price || 0) * qty;

  const rawImg =
    productItem.photo ||
    (Array.isArray(productItem.images) ? productItem.images[0] : "");

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > maxStock) return;
    if (update) {
      update({
        ...productItem,
        count: newQty,
        isChose: selected,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex gap-3.5 rounded-3xl border border-border bg-surface p-3.5 shadow-[0_10px_30px_-14px_rgba(var(--shadow-rgb),0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_20px_40px_-14px_rgba(var(--shadow-rgb),0.12)] sm:gap-5 sm:p-4"
    >
      {/* ── 1. Product Thumbnail ── */}
      <Link
        href={`/shop/details/${productItem._id}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-surface-subtle sm:h-32 sm:w-28"
      >
        <img
          src={resolveImageUrl(rawImg, "https://placehold.co/160x200/111111/FFFFFF?text=SHOP.CO")}
          alt={productItem.name || t("productImageAlt")}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
        />
        {discount > 0 && (
          <span className="absolute start-1.5 top-1.5 rounded-full bg-action/90 px-2 py-0.5 font-mono text-[8px] font-black uppercase text-on-action backdrop-blur-md">
            -{discount}%
          </span>
        )}
      </Link>

      {/* ── 2. Details & Live Controls ── */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex min-w-0 items-start gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label={selected ? t("deselectItemForCheckout") : t("selectItemForCheckout")}
                onClick={() => toggleSelected(productItem)}
                disabled={outOfStock}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${selected ? "border-action bg-action text-on-action" : "border-border-strong bg-surface text-muted hover:border-focus"}`}
              >
                {selected ? <Check size={12} strokeWidth={3} /> : <Circle size={11} />}
              </button>
              <Link href={`/shop/details/${productItem._id}`} className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-black uppercase tracking-tight text-primary transition-colors hover:text-secondary sm:text-base">
                  {productItem.name || productItem.description}
                </h2>
              </Link>
            </div>

            {/* Variant and stock context */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {outOfStock && (
                <span className="rounded-lg bg-danger-soft px-2.5 py-0.5 text-[10px] font-bold text-danger">
                  {t("outOfStock")}
                </span>
              )}
              {productItem.size && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-surface-subtle px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-secondary">
                  {t("size")}:{" "}
                  <strong className="text-primary">{productItem.size}</strong>
                </span>
              )}

              {productItem.colors && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-subtle px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-secondary">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-border"
                    style={{
                      backgroundColor: String(productItem.colors),
                    }}
                  />
                  <span>{productItem.colors}</span>
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              remove(productItem);
              router.refresh();
              toast.error(`${productItem.name || t("products")} — ${t("removeItem")}`);
            }}
            title={t("removeItem")}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-danger-border/70 bg-danger-soft text-danger transition-all hover:border-danger-border hover:bg-danger hover:text-on-danger"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>

        {/* Bottom Row: Price Breakdown + Interactive Quantity Stepper */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-border-subtle pt-2.5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base font-black text-primary sm:text-lg">
                {formatCurrency(finalPrice, locale)}
              </span>

              {discount > 0 && (
                <span className="font-mono text-xs font-bold text-muted line-through">
                  {formatCurrency(originalTotal, locale)}
                </span>
              )}
            </div>
            <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
              {formatCurrency(Number(productItem.price || 0), locale)} / {t("perUnit")}
            </span>
          </div>

          {/* Live Quantity Stepper */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-surface-subtle p-1">
            <button
              type="button"
              disabled={qty <= 1 || outOfStock}
              onClick={() => handleQuantityChange(qty - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-surface text-primary shadow-2xs transition-all hover:bg-action hover:text-on-action disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={t("decreaseQuantity")}
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>

            <span className="min-w-[20px] text-center font-mono text-xs font-black text-primary">
              {String(qty).padStart(2, "0")}
            </span>

            <button
              type="button"
              disabled={qty >= maxStock || outOfStock}
              onClick={() => handleQuantityChange(qty + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-surface text-primary shadow-2xs transition-all hover:bg-action hover:text-on-action disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={t("increaseQuantity")}
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
