"use client";

import React from "react";
import { Receipt, Sparkles } from "lucide-react";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { Product } from "@/types";

const FREE_SHIPPING_THRESHOLD = 200;

export const Pricing = ({ product }: { product: Product[] }) => {
  const { total, subtotal } = product.reduce(
    (acc, item) => {
      const qty = Number(item.count ?? 1);
      const price = Number(item.price || 0);
      return {
        subtotal: acc.subtotal + price * qty,
        total:
          acc.total +
          calculateFinalPrice(price, Number(item.discount || 0), qty),
      };
    },
    { total: 0, subtotal: 0 },
  );

  const discountAmount = Math.max(0, subtotal - total);
  const delivery = total >= FREE_SHIPPING_THRESHOLD || total === 0 ? 0 : 15;
  const grandTotal = total > 0 ? total + delivery : 0;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-white">
            <Receipt size={16} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-[#111111]">
              Order Summary
            </h2>
            <p className="text-[10px] font-semibold text-neutral-400">
              Live bag valuation
            </p>
          </div>
        </div>

        {discountAmount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider text-emerald-700">
            <Sparkles size={10} /> You Save ${discountAmount.toFixed(2)}
          </span>
        )}
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-500">
            Original Subtotal
          </span>
          <span className="font-mono font-bold text-[#111111]">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-500">
            Atelier Markdowns
          </span>
          <span className="font-mono font-black text-rose-600">
            -${discountAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-500">
            Courier Dispatch
          </span>
          {delivery === 0 && total > 0 ? (
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-emerald-700">
              FREE VIP
            </span>
          ) : (
            <span className="font-mono font-bold text-[#111111]">
              ${delivery.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Grand Total Box */}
      <div className="flex items-end justify-between rounded-2xl bg-[#F4F3F4] p-4">
        <div>
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Estimated Total
          </span>
          <span className="text-xs font-extrabold uppercase text-[#111111]">
            Taxes Included
          </span>
        </div>

        <span className="font-mono text-2xl font-black leading-none tracking-tight text-[#111111]">
          ${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
