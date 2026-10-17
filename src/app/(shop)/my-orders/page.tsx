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
import OrderCard from "@/components/features/OrderCard/OrderCard";
import { Pagination } from "@/components/common/Pagination.client";

export default function MyOrdersPage() {
  const { data, loading, refetch, page, totalPages, goToPage } =
    useData("profile/my-orders");

  useEffect(() => {
    document.title = "My Orders & Tracking · Account | SHOP.CO™";
  }, []);

  const orders: any[] = data?.data?.orders ?? [];
  const total = data?.pagination?.total ?? orders.length;

  if (loading && !data) {
    return (
      <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-12 text-[#111111] sm:py-16">
        <div className="Responsive animate-pulse space-y-6">
          <div className="h-16 w-full rounded-3xl bg-white" />
          <div className="space-y-3.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl border border-neutral-100 bg-white p-6"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-8 text-[#111111] sm:py-12">
      {/* Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. ACCOUNT ORDERS HEADER                                         */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[#F4F3F4] px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-700">
                ACCOUNT ARCHIVE · MY ORDERS
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                Order History
              </h1>
              {orders.length > 0 && (
                <span className="rounded-full bg-neutral-100 px-3 py-0.5 font-mono text-xs font-black text-neutral-700">
                  {total} Record{total !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              disabled={loading}
              onClick={refetch}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all hover:bg-neutral-800 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-emerald-400"
                    : "transition-transform group-hover:rotate-180"
                }
              />
              <span>{loading ? "Syncing..." : "Sync Orders"}</span>
            </button>
          )}
        </header>

        {/* ================================================================ */}
        {/* 2. ORDERS LIST OR 3D EMPTY STATE                                 */}
        {/* ================================================================ */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/90 bg-white px-6 py-20 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-neutral-200/80 bg-[#F8F8F8] text-neutral-400">
              <Package size={34} strokeWidth={1.5} />
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F3F4] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
              <Sparkles size={10} /> NO TRANSACTION HISTORY
            </span>

            <h3 className="mt-3 text-xl font-black uppercase tracking-tight text-[#111111] sm:text-2xl">
              No Orders Placed Yet
            </h3>

            <p className="mt-1.5 max-w-sm text-xs font-medium leading-relaxed text-neutral-400">
              You haven&apos;t completed any purchases with us. Explore the
              flagship archive to curate your first look.
            </p>

            <Link
              href="/shop"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-[#111111] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_-8px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              <ShoppingBag size={14} />
              <span>Start Shopping</span>
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
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white px-6 py-4 shadow-2xs sm:flex-row">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Layers size={14} className="text-[#111111]" />
              <span>
                Page <strong className="text-[#111111]">{page}</strong> of{" "}
                <strong className="text-[#111111]">{totalPages}</strong> (
                {total} orders)
              </span>
            </div>

            <Pagination
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
