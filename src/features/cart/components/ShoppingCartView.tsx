"use client";

import Link from "next/link";
import { Sparkles, Truck, CheckCircle2, ArrowLeft, Trash2, ShieldCheck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { isOutOfStock, summarizeCart, useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { CartOrderSummary } from "@/features/cart/components/CartOrderSummary";
import { EmptyCartState } from "@/features/cart/components/EmptyCartState";
import { CartLineItem } from "@/features/cart/components/CartLineItem";
import { PromoCodeForm } from "@/features/cart/components/PromoCodeForm";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

const FREE_SHIPPING_THRESHOLD = 200;

export const ShoppingCartView = () => {
  const { t, locale } = useLocale();
  const items = useCartStore((state) => state.stack);
  const clearCart = useCartStore((state) => state.clearCart);
  const selectAll = useCartStore((state) => state.selectAll);
  const removeSelected = useCartStore((state) => state.removeSelected);
  const selectedItems = items.filter(
    (item) => item.isChose !== false && !isOutOfStock(item),
  );
  const cartSummary = summarizeCart(items);
  const selectedLineCount = cartSummary.selectedLineCount;
  const selectableLineCount = items.filter(
    (item) => !isOutOfStock(item),
  ).length;
  const isEverythingSelected =
    selectableLineCount > 0 && selectedLineCount === selectableLineCount;

  if (items.length === 0) return <EmptyCartState />;

  const totalBagQuantity = cartSummary.quantityCount;
  const selectedOrderValue = cartSummary.selectedTotal;

  const amountRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - selectedOrderValue,
  );
  const shippingProgress = Math.min(
    100,
    Math.round((selectedOrderValue / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const unlockedFreeShipping = selectedOrderValue >= FREE_SHIPPING_THRESHOLD;

  const handleClearBag = () => {
    clearCart();
    toast.success(t("clearBag"));
  };

  const handleRemoveSelected = () => {
    if (selectedLineCount === 0) return;
    removeSelected();
    toast.success(t("removeSelectedItems"));
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-8 text-primary sm:py-12">
      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. TOP ATELIER BAG HEADER                                        */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>{t("continueShopping")}</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
                <Sparkles size={10} className="text-rating" />
                ATELIER BAG
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {t("yourBag")}
              </h1>
              <span className="rounded-full bg-surface-subtle px-3 py-0.5 font-mono text-xs font-black text-secondary">
                {items.length} {t("products")} · {totalBagQuantity} {t("units")}
              </span>
            </div>
          </div>

          {/* Clear saved cart lines */}
          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <button
              type="button"
              onClick={() => selectAll(!isEverythingSelected)}
              disabled={selectableLineCount === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-secondary transition-colors hover:border-border-strong hover:bg-surface-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
            >
              <CheckCircle2 size={13} />
              <span>{isEverythingSelected ? t("deselectAllItems") : t("selectAllItems")}</span>
            </button>
            <button
              type="button"
              onClick={handleRemoveSelected}
              disabled={selectedLineCount === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-danger-border/80 bg-danger-soft/60 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-danger transition-colors hover:bg-danger hover:text-on-danger disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={13} />
              <span>{t("removeSelectedItems")}</span>
            </button>
            <button
              type="button"
              onClick={handleClearBag}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-danger-border/80 bg-danger-soft/60 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-danger transition-colors hover:bg-danger hover:text-on-danger"
            >
              <Trash2 size={13} />
              <span>{t("clearBag")}</span>
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border-subtle bg-surface/75 px-4 py-3 text-xs text-secondary">
          <span>{selectedLineCount} / {items.length} {t("selectedItemsCount")}</span>
          <span className="font-semibold">{t("selectedSubtotalLabel")}: {formatCurrency(cartSummary.selectedSubtotal, locale)}</span>
        </div>

        {/* ================================================================ */}
        {/* 2. LIVE FREE EXPRESS SHIPPING PROGRESS BAR                       */}
        {/* ================================================================ */}
        <div className="overflow-hidden rounded-2xl border border-border bg-action px-5 py-4 text-on-action shadow-[0_14px_34px_-10px_rgba(var(--shadow-rgb),0.22)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  unlockedFreeShipping
                    ? "bg-success text-on-success"
                    : "bg-white/10 text-rating"
                }`}
              >
                {unlockedFreeShipping ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Truck size={16} />
                )}
              </span>

              {selectedLineCount === 0 ? (
                <p className="font-bold tracking-wide text-on-action">
                  {t("noCheckoutSelection")}
                </p>
              ) : unlockedFreeShipping ? (
                <p className="font-bold tracking-wide text-on-action">
                  {t("freeShipping")}
                </p>
              ) : (
                <p className="font-medium text-on-action/85">
                  {t("freeShippingFrom")} {" "}
                  <strong className="font-mono font-black text-rating">
                    {formatCurrency(amountRemaining, locale)}
                  </strong>
                </p>
              )}
            </div>

            <span className="font-mono text-[11px] font-black text-on-action/70">
              {shippingProgress}%
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              style={{ width: `${shippingProgress}%` }}
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                unlockedFreeShipping
                  ? "bg-success-bright"
                  : "bg-linear-to-r from-white/70 via-white to-rating"
              }`}
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. MAIN 2-COLUMN LAYOUT (ITEMS + STICKY RECEIPT SIDEBAR)         */}
        {/* ================================================================ */}
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Left: Cart Items List */}
          <div className="w-full space-y-3.5 lg:flex-1">
            <AnimatePresence mode="popLayout">
              {items.map((item: Product) => (
                <CartLineItem
                  productItem={item}
                  key={`${item._id}-${item.size || ""}-${item.colors || ""}`}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Sticky 3D Receipt & Promo Sidebar */}
          <aside className="sticky top-24 w-full shrink-0 overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[0_20px_50px_-15px_rgba(var(--shadow-rgb),0.08)] lg:w-[360px] xl:w-[390px]">
            <CartOrderSummary product={selectedItems} />
            <PromoCodeForm canCheckout={selectedLineCount > 0} />

            {/* Buyer Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 border-t border-border-subtle bg-surface-subtle px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted">
              <ShieldCheck size={14} className="text-success" />
              <span>{t("securedCheckout")}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
