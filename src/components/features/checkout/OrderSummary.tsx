"use client";

import React from "react";
import { ShoppingBag, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";

const FREE_SHIPPING_THRESHOLD = 200;

const getImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/100x120/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

export const OrderSummary = ({ items }: { items: Product[] }) => {
  const { rawSubtotal, discountedSubtotal, totalUnits } = items.reduce(
    (acc, item) => {
      const qty = Number(item.count ?? 1);
      const price = Number(item.price || 0);
      const disc = item.discount !== undefined ? Number(item.discount) : 0;

      return {
        rawSubtotal: acc.rawSubtotal + price * qty,
        discountedSubtotal:
          acc.discountedSubtotal + calculateFinalPrice(price, disc, qty),
        totalUnits: acc.totalUnits + qty,
      };
    },
    { rawSubtotal: 0, discountedSubtotal: 0, totalUnits: 0 },
  );

  const totalSaved = Math.max(0, rawSubtotal - discountedSubtotal);
  const deliveryFee =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0
      ? 0
      : 15;
  const grandTotal = discountedSubtotal + deliveryFee;

  return (
    <div className="sticky top-24 overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] sm:p-7">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
            <ShoppingBag size={17} />
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-[#111111]">
              Order Manifest
            </h3>
            <p className="text-xs font-semibold text-neutral-400">
              {items.length} SKU{items.length === 1 ? "" : "s"} · {totalUnits}{" "}
              unit{totalUnits === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F4F3F4] px-3 py-1 font-mono text-[10px] font-black uppercase text-[#111111]">
          VERIFIED
        </span>
      </div>

      {/* Scrollable Items Manifest */}
      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const qty = Number(item.count ?? 1);
          const lineFinal = calculateFinalPrice(
            Number(item.price || 0),
            item.discount !== undefined ? Number(item.discount) : 0,
            qty,
          );
          const rawImg =
            item.photo || (Array.isArray(item.images) ? item.images[0] : "");

          return (
            <div
              key={`${item._id}-${item.size || ""}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200/70 bg-[#F8F8F8] p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-2xs">
                  <img
                    src={getImageUrl(rawImg)}
                    alt={item.name}
                    className="h-full w-full object-cover object-top"
                  />
                  <span className="absolute bottom-0.5 right-0.5 rounded bg-[#111111]/90 px-1.5 py-0.2 font-mono text-[8px] font-black text-white">
                    ×{qty}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase text-[#111111]">
                    {item.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.colors && <span>· {item.colors}</span>}
                  </div>
                </div>
              </div>

              <span className="shrink-0 font-mono text-xs font-black text-[#111111]">
                ${lineFinal.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Financial Breakdown */}
      <div className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4 text-xs">
        <div className="flex justify-between">
          <span className="font-semibold text-neutral-500">Items Subtotal</span>
          <span className="font-mono font-bold text-[#111111]">
            ${rawSubtotal.toFixed(2)}
          </span>
        </div>

        {totalSaved > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span className="font-semibold">Atelier Savings</span>
            <span className="font-mono font-black">
              -${totalSaved.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-semibold text-neutral-500">
            Courier Dispatch Fee
          </span>
          {deliveryFee === 0 ? (
            <span className="font-mono text-[10px] font-black uppercase text-emerald-600">
              COMPLIMENTARY
            </span>
          ) : (
            <span className="font-mono font-bold text-[#111111]">
              +${deliveryFee.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Dark Luxury Settlement Receipt Box */}
      <div className="mt-5 rounded-2xl bg-[#111111] p-4 text-white shadow-md">
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/45">
              TOTAL SETTLEMENT
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <ShieldCheck size={13} /> Guaranteed Price
            </span>
          </div>

          <span className="font-mono text-2xl font-black leading-none text-white">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
