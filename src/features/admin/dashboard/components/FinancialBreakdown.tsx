"use client";

import { Wallet, CircleAlert } from "lucide-react";

import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import type { RevenueAnalyticsSummary } from "@/types/domain";

type FinancialBreakdownProps = {
  summary: RevenueAnalyticsSummary;
  locale: "ar" | "en";
};

export default function FinancialBreakdown({
  summary,
  locale,
}: FinancialBreakdownProps) {
  const { t } = useLocale();
  const profitIsAvailable =
    summary.profitAvailable && summary.netProfit !== null;
  const profitMargin =
    profitIsAvailable && summary.profitMarginPercent !== null
      ? new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(summary.profitMarginPercent)
      : null;

  const rows = [
    { label: t("dashboardGrossSales"), value: summary.grossSales },
    { label: t("dashboardDiscounts"), value: -summary.discounts },
    { label: t("dashboardRefunds"), value: -summary.refunds },
    { label: t("dashboardShippingRevenue"), value: summary.shippingRevenue },
    {
      label: t("dashboardCostOfGoods"),
      value: summary.costOfGoodsSold === null ? null : -summary.costOfGoodsSold,
    },
    { label: t("dashboardGrossProfit"), value: summary.grossProfit },
    {
      label: t("dashboardPaymentFees"),
      value: summary.paymentFees === null ? null : -summary.paymentFees,
    },
    {
      label: t("dashboardShippingCosts"),
      value: summary.shippingCosts === null ? null : -summary.shippingCosts,
    },
    {
      label: t("dashboardOperatingExpenses"),
      value: summary.operatingExpenses === null ? null : -summary.operatingExpenses,
    },
  ];

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-subtle/70 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
            {t("dashboardFinancialBreakdown")}
          </p>
          <h4 className="mt-1 text-sm font-extrabold text-primary">
            {t("dashboardWhereMoneyGoes")}
          </h4>
        </div>
        <Wallet size={17} className="text-muted" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 text-[11px]"
          >
            <span className="min-w-0 truncate text-secondary">{row.label}</span>
            <span className="shrink-0 font-mono font-semibold text-primary">
              {row.value === null
                ? "—"
                : `${row.value < 0 ? "−" : ""}${formatCurrency(Math.abs(row.value), locale)}`}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold text-secondary">
            {t("dashboardProfitMargin")}
          </span>
          <span className="font-mono text-[11px] font-bold text-primary">
            {profitMargin !== null ? `${profitMargin}%` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-primary">
            {t("dashboardNetProfit")}
          </span>
          <span
            className={`font-mono text-sm font-black ${
              profitIsAvailable ? "text-success" : "text-muted"
            }`}
          >
            {profitIsAvailable && summary.netProfit !== null
              ? formatCurrency(summary.netProfit, locale)
              : "—"}
          </span>
        </div>
      </div>

      {!profitIsAvailable && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-warning-border bg-warning-soft p-2.5 text-[10px] leading-relaxed text-warning">
          <CircleAlert size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {t("dashboardProfitSetupHint")}
        </p>
      )}
    </div>
  );
}
