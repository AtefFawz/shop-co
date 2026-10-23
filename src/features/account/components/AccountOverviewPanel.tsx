"use client";


import Link from "next/link";
import { Star, Package, CreditCard, ShoppingBag, ArrowUpRight, Store } from "lucide-react";
import OrderCard from "@/features/orders/components/CustomerOrderCard";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import type { CustomerOrderRecord, ReviewRecord } from "@/types/domain";
import type { LucideIcon } from "lucide-react";
type DataType = {
  orders: CustomerOrderRecord[];
  reviews: ReviewRecord[];
  onRefresh: () => void;
  goTo: (state: string) => void;
  pagination: {
    paginationOrders: { total: number; totalExpenses?: number };
    paginationReviews: { total: number };
  };
};

export default function AccountOverviewPanel({
  orders = [],
  onRefresh,
  goTo,
  pagination,
}: DataType) {
  const { t, locale, direction } = useLocale();
  // Safe calculation of total expenses so it never renders an invalid amount
  const safeExpenses =
    typeof pagination?.paginationOrders?.totalExpenses === "number"
      ? pagination.paginationOrders.totalExpenses
      : orders.reduce((sum, o) => sum + (Number(o?.totalPrice) || 0), 0);

  const totalOrders = pagination?.paginationOrders?.total ?? orders.length;
  const totalReviews = pagination?.paginationReviews?.total ?? 0;

  return (
    <div dir={direction} className="space-y-8 animate-in fade-in duration-500">
      <style>{`
        .overview-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .overview-3d-card:hover {
            transform: translateY(-5px) rotateX(3.5deg) rotateY(-3.5deg);
            box-shadow: 0 22px 44px -12px rgba(var(--shadow-rgb), 0.12);
          }
        }
      `}</style>

      {/* ── 1. 3D KPI Stat Cards ── */}
      <div
        style={{ perspective: "1100px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label={t("accountCumulativeSpend")}
          value={formatCurrency(safeExpenses, locale)}
          sub={t("accountLifetimeVerified")}
          icon={CreditCard}
          accent="emerald"
          onClick={() => goTo("orders")}
        />
        <StatCard
          label={t("accountTotalOrders")}
          value={totalOrders}
          sub={t("accountDispatchesQueued")}
          icon={Package}
          accent="black"
          onClick={() => goTo("orders")}
        />
        <StatCard
          label={t("accountPublishedReviews")}
          value={totalReviews}
          sub={t("accountVerifiedFeedback")}
          icon={Star}
          accent="amber"
          onClick={() => goTo("reviews")}
        />
      </div>

      {/* ── 2. Latest Activity Feed ── */}
      <section className="space-y-5">
        <AccountSectionHeader
          icon={ShoppingBag}
          title={t("accountRecentOrderActivity")}
          count={totalOrders}
        />

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-14 text-center shadow-[0_12px_34px_-14px_rgba(var(--shadow-rgb),0.05)]">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-primary">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-primary">
              {t("accountNoRecentOrders")}
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted">
              {t("accountOrderHistoryHint")}
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-action px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-action shadow-md transition hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <Store size={13} />
              <span>{t("accountExploreShop")}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 2).map((order: CustomerOrderRecord) => (
              <OrderCard
                key={order._id}
                order={order}
                onReviewSuccess={onRefresh}
              />
            ))}

            {orders.length > 2 && (
              <button
                type="button"
                onClick={() => goTo("orders")}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border-strong bg-surface/60 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-secondary transition-all hover:border-border hover:bg-action hover:text-on-action"
              >
                <span>{t("accountInspectAllOrders").replace("{count}", String(totalOrders))}</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  accent: "emerald" | "black" | "amber";
  onClick?: () => void;
}) {
  const iconStyles = {
    emerald: "bg-success-soft text-success",
    black: "bg-action text-on-action",
    amber: "bg-warning-soft text-warning",
  };

  return (
    <div
      onClick={onClick}
      className="overview-3d-card group relative flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)]"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconStyles[accent]}`}
        >
          <Icon size={22} />
        </div>

        <div className="min-w-0 text-start">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted">
            {label}
          </p>
          <p className="mt-1 font-mono text-2xl font-black leading-none tracking-tight text-primary sm:text-3xl">
            {value ?? 0}
          </p>
          <p className="mt-1.5 truncate text-[10px] font-semibold text-muted">
            {sub}
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={16}
        className="shrink-0 text-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
      />
    </div>
  );
}
