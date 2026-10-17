"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useProduct } from "@/store/cardStore";
import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { Pricing } from "./Pricing";
import { EmptyCart } from "./EmptyCart";
import { Card } from "./Card";
import { PromoCode } from "./PromoCode";

const FREE_SHIPPING_THRESHOLD = 200;

export const Car = () => {
  const Stack = useProduct((e) => e.stack);
  const clearCart = useProduct((e: any) => e.clearCart);

  if (!Stack || Stack.length === 0) return <EmptyCart />;

  // Calculate total units & current discounted subtotal for Free Shipping progress
  const totalUnits = Stack.reduce(
    (sum: number, item: Product) => sum + (Number(item.count) || 1),
    0,
  );

  const currentSubtotal = Stack.reduce((sum: number, item: Product) => {
    const qty = Number(item.count) || 1;
    return (
      sum + calculateFinalPrice(Number(item.price), Number(item.discount), qty)
    );
  }, 0);

  const amountRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - currentSubtotal,
  );
  const shippingProgress = Math.min(
    100,
    Math.round((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const unlockedFreeShipping = currentSubtotal >= FREE_SHIPPING_THRESHOLD;

  const handleClearBag = () => {
    if (clearCart) {
      clearCart();
      toast.error("Atelier bag cleared");
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-8 text-[#111111] sm:py-12">
      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. TOP ATELIER BAG HEADER                                        */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-[#F8F8F8] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-700 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>Continue Shopping</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                <Sparkles size={10} className="text-amber-400" />
                ATELIER BAG
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                Your Shopping Bag
              </h1>
              <span className="rounded-full bg-[#F4F3F4] px-3 py-0.5 font-mono text-xs font-black text-neutral-700">
                {Stack.length} SKU{Stack.length !== 1 ? "s" : ""} · {totalUnits}{" "}
                Unit{totalUnits !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right Controls: Clear Bag */}
          {clearCart && (
            <button
              type="button"
              onClick={handleClearBag}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 self-end rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600 transition-all hover:border-rose-600 hover:bg-rose-600 hover:text-white lg:self-auto"
            >
              <Trash2 size={13} />
              <span>Clear Bag</span>
            </button>
          )}
        </header>

        {/* ================================================================ */}
        {/* 2. LIVE FREE EXPRESS SHIPPING PROGRESS BAR                       */}
        {/* ================================================================ */}
        <div className="overflow-hidden rounded-2xl border border-white/90 bg-[#111111] px-5 py-4 text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,0.22)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  unlockedFreeShipping
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-amber-400"
                }`}
              >
                {unlockedFreeShipping ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Truck size={16} />
                )}
              </span>

              {unlockedFreeShipping ? (
                <p className="font-bold tracking-wide text-white">
                  Complimentary{" "}
                  <span className="font-black text-emerald-400">
                    VIP Express Shipping
                  </span>{" "}
                  unlocked for your order!
                </p>
              ) : (
                <p className="font-medium text-white/85">
                  Add{" "}
                  <strong className="font-mono font-black text-amber-400">
                    ${amountRemaining.toFixed(2)}
                  </strong>{" "}
                  more to unlock{" "}
                  <strong className="font-black text-white">
                    Free Express Dispatch
                  </strong>
                </p>
              )}
            </div>

            <span className="font-mono text-[11px] font-black text-white/70">
              {shippingProgress}%
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              style={{ width: `${shippingProgress}%` }}
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                unlockedFreeShipping
                  ? "bg-emerald-400"
                  : "bg-linear-to-r from-white/70 via-white to-amber-400"
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
              {Stack.map((item: Product) => (
                <Card
                  productItem={item}
                  key={`${item._id}-${item.size || ""}-${item.colors || ""}`}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Sticky 3D Receipt & Promo Sidebar */}
          <aside className="sticky top-24 w-full shrink-0 overflow-hidden rounded-[2rem] border border-white/90 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] lg:w-[360px] xl:w-[390px]">
            <Pricing product={Stack} />
            <PromoCode />

            {/* Buyer Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 border-t border-neutral-100 bg-[#F8F8F8] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Authenticated &amp; Insured Checkout</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
