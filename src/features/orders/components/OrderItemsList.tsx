"use client";

import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, ShieldCheck, ArrowUpRight } from "lucide-react";

type OrderItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  product?: {
    _id?: string;
    name?: string;
    category?: string;
  };
};

const getImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/120x150/111111/FFFFFF?text=SHOP.CO";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

export default function OrderItemsList({
  items = [],
  totalPrice = 0,
}: {
  items: OrderItem[];
  totalPrice: number;
}) {
  const totalUnits = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0,
  );

  const calculatedSubtotal = items.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  return (
    <div className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-7">
      {/* ── Top Manifest Header ── */}
      <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action text-on-action shadow-xs">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-primary sm:text-lg">
              Order Manifest
            </h2>
            <p className="text-xs font-semibold text-muted">
              {items.length} unique SKU{items.length === 1 ? "" : "s"} ·{" "}
              {totalUnits} total unit{totalUnits === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-secondary">
          VERIFIED ITEMS
        </span>
      </div>

      {/* ── Garments List ── */}
      <div className="space-y-3.5">
        {items.map((item, idx) => {
          const qty = Number(item.quantity) || 1;
          const unitPrice = Number(item.price) || 0;
          const lineTotal = unitPrice * qty;
          const productName =
            item.name || item.product?.name || "Atelier Garment";
          const productId = item.product?._id;

          return (
            <div
              key={item._id || idx}
              className="group flex flex-col justify-between gap-4 rounded-3xl border border-border/70 bg-surface-subtle/80 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:shadow-md sm:flex-row sm:items-center sm:p-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* 3D Thumbnail Frame */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-surface bg-surface shadow-sm sm:h-24 sm:w-24">
                  <img
                    src={getImageUrl(item.image)}
                    alt={productName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded-lg bg-action/90 px-2 py-0.5 font-mono text-[10px] font-black text-on-action backdrop-blur-md">
                    ×{qty}
                  </span>
                </div>

                {/* Item Title & Unit Breakdown */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span className="inline-block font-mono text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                    ITEM // 0{idx + 1}
                  </span>

                  <h3 className="truncate text-sm font-black uppercase tracking-tight text-primary sm:text-base">
                    {productName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-xs font-bold text-muted">
                    <span>Unit: {unitPrice.toLocaleString()} EGP</span>
                    <span>•</span>
                    <span>Qty: {qty}</span>
                  </div>
                </div>
              </div>

              {/* Right Line Subtotal & Inspect Link */}
              <div className="flex items-center justify-between border-t border-border/60 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-muted">
                    Subtotal
                  </span>
                  <span className="font-mono text-base font-black text-primary sm:text-lg">
                    {lineTotal.toLocaleString()}{" "}
                    <span className="text-[10px] font-bold text-muted">
                      EGP
                    </span>
                  </span>
                </div>

                {productId && (
                  <Link
                    href={`/shop/details/${productId}`}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-muted hover:text-primary"
                  >
                    <span>View SKU</span>
                    <ArrowUpRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Dark Luxury Financial Receipt Summary ── */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-action p-5 text-on-action shadow-lg sm:p-6">
        <div className="space-y-2.5 border-b border-white/10 pb-4 text-xs">
          <div className="flex items-center justify-between text-on-action/65">
            <span>Items Subtotal ({totalUnits} units)</span>
            <span className="font-mono font-bold text-on-action">
              {calculatedSubtotal.toLocaleString()} EGP
            </span>
          </div>

          <div className="flex items-center justify-between text-on-action/65">
            <span>Atelier Express Packaging &amp; Handling</span>
            <span className="font-mono font-bold text-success">
              INCLUDED
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-on-action/45">
              FINAL SETTLEMENT AMOUNT
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-success">
              <ShieldCheck size={14} /> Verified Official Invoice
            </span>
          </div>

          <div className="text-right font-mono">
            <span className="text-2xl font-black tracking-tight text-on-action sm:text-3xl">
              {Number(totalPrice || calculatedSubtotal).toLocaleString()}
            </span>
            <span className="ml-1.5 text-xs font-extrabold text-on-action/60">
              EGP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
