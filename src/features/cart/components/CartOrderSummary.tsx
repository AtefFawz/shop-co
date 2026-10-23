"use client";


import { Receipt, Sparkles } from "lucide-react";
import { calculateFinalPrice } from "@/lib/logicPricing";
import type { Product } from "@/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

const FREE_SHIPPING_THRESHOLD = 200;

export const CartOrderSummary = ({ product }: { product: Product[] }) => {
  const { t, locale } = useLocale();
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
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-action text-on-action">
            <Receipt size={16} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-primary">
              {t("orderSummary")}
            </h2>
            <p className="text-[10px] font-semibold text-muted">
              {t("liveBagValue")}
            </p>
          </div>
        </div>

        {discountAmount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider text-success">
            <Sparkles size={10} /> {t("youSave")} {formatCurrency(discountAmount, locale)}
          </span>
        )}
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-muted">
            {t("originalSubtotal")}
          </span>
          <span className="font-mono font-bold text-primary">
            {formatCurrency(subtotal, locale)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-muted">
            {t("discounts")}
          </span>
          <span className="font-mono font-black text-danger">
            -{formatCurrency(discountAmount, locale)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-muted">
            {t("delivery")}
          </span>
          {delivery === 0 && total > 0 ? (
            <span className="rounded bg-success-soft px-2 py-0.5 font-mono text-[10px] font-black uppercase text-success">
              {t("free")}
            </span>
          ) : (
            <span className="font-mono font-bold text-primary">
              {formatCurrency(delivery, locale)}
            </span>
          )}
        </div>
      </div>

      {/* Grand Total Box */}
      <div className="flex items-end justify-between rounded-2xl bg-surface-subtle p-4">
        <div>
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-muted">
            {t("estimatedTotal")}
          </span>
          <span className="text-xs font-extrabold uppercase text-primary">
            {t("taxesIncluded")}
          </span>
        </div>

        <span className="font-mono text-2xl font-black leading-none tracking-tight text-primary">
          {formatCurrency(grandTotal, locale)}
        </span>
      </div>
    </div>
  );
};
