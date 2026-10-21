"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";
import useData from "@/hooks/getData";
import OrderCard from "@/features/orders/components/CustomerOrderCard";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function CustomerOrderHistoryPage() {
  const { t, locale } = useLocale();
  const { data, loading, refetch, page, totalPages, goToPage } =
    useData("profile/my-orders");

  useEffect(() => {
    document.title = `${t("orderHistoryTitle")} · SHOP.CO™`;
  }, [locale, t]);

  const orders: any[] = data?.data?.orders ?? [];
  const total = data?.pagination?.total ?? orders.length;

  if (loading && !data) {
    return (
      <section className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-12 text-primary sm:py-16">
        <div className="Responsive animate-pulse space-y-6">
          <div className="h-16 w-full rounded-3xl bg-surface" />
          <div className="space-y-3.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl border border-border-subtle bg-surface p-6"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-8 text-primary sm:py-12">
      {/* Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. ACCOUNT ORDERS HEADER                                         */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
                {t("orderHistoryLabel")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                Order History
              </h1>
              {orders.length > 0 && (
                <span className="rounded-full bg-surface-muted px-3 py-0.5 font-mono text-xs font-black text-secondary">
                  {total} {t("orderRecords")}
                </span>
              )}
            </div>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              disabled={loading}
              onClick={refetch}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-action px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-on-action shadow-[0_12px_28px_-6px_rgba(var(--shadow-rgb),0.35)] transition-all hover:bg-action-hover disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-success"
                    : "transition-transform group-hover:rotate-180"
                }
              />
              <span>{loading ? t("syncingOrders") : t("syncOrders")}</span>
            </button>
          )}
        </header>

        {/* ================================================================ */}
        {/* 2. ORDERS LIST OR 3D EMPTY STATE                                 */}
        {/* ================================================================ */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-border bg-surface px-6 py-20 text-center shadow-[0_20px_50px_-15px_rgba(var(--shadow-rgb),0.07)]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-border/80 bg-surface-subtle text-muted">
              <Package size={34} strokeWidth={1.5} />
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-secondary">
              <Sparkles size={10} /> {t("noTransactionHistory")}
            </span>

            <h3 className="mt-3 text-xl font-black uppercase tracking-tight text-primary sm:text-2xl">
              {t("noOrdersYet")}
            </h3>

            <p className="mt-1.5 max-w-sm text-xs font-medium leading-relaxed text-muted">
              {t("noOrdersHint")}
            </p>

            <Link
              href="/shop"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-action px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <ShoppingBag size={14} />
              <span>{t("startShopping")}</span>
            </Link>
          </div>
        ) : (
          <div
            className={`space-y-4 transition-opacity duration-300 ${
              loading ? "pointer-events-none opacity-60" : "opacity-100"
            }`}
          >
            {orders.map((order: any) => (
              <OrderCard
                key={order._id}
                order={order}
                onReviewSuccess={refetch}
              />
            ))}
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. PAGINATION FOOTER                                             */}
        {/* ================================================================ */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface px-6 py-4 shadow-2xs sm:flex-row">
            <div className="flex items-center gap-2 text-xs font-bold text-muted">
              <Layers size={14} className="text-primary" />
              <span>
                {t("catalogPage")} <strong className="text-primary">{page}</strong> {t("catalogOf")} {" "}
                <strong className="text-primary">{totalPages}</strong> (
                {total} {t("ordersTotal")})
              </span>
            </div>

            <ClientPagination
              page={page}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
