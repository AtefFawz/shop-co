"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  RefreshCw,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  Truck,
  ArrowUpDown,
  Store,
  ArrowUpRight,
  Layers,
  Filter,
} from "lucide-react";
import useData from "@/hooks/getData";
import { MobileOrders } from "@/components/features/admin/orders/MobileOrder";
import { DeskTopOrder } from "@/components/features/admin/orders/DesktopOrder";

export default function AdminOrdersPage() {
  const { loading, data, page, totalPages, goToPage, refetch, total } =
    useData("/order/all");

  // Interactive Studio States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "total-desc" | "total-asc" | "items-desc"
  >("newest");

  // Set Browser Tab Title
  useEffect(() => {
    document.title = "Fulfillment Studio · Orders | SHOP.CO™";
  }, []);

  const handleDeleteOrder = () => {
    refetch();
  };

  const orders: any[] = useMemo(() => {
    return (
      (data as unknown as { data?: { orders?: any[] } })?.data?.orders ?? []
    );
  }, [data]);

  // Live Telemetry Calculations from current orders batch
  const telemetry = useMemo(() => {
    const batchRevenue = orders.reduce(
      (sum, o) => sum + (Number(o.totalPrice) || 0),
      0,
    );
    const avgTicket =
      orders.length > 0 ? Math.round(batchRevenue / orders.length) : 0;

    const pendingCount = orders.filter((o) =>
      ["pending", "processing"].includes((o.status || "").toLowerCase()),
    ).length;

    const shippedCount = orders.filter((o) =>
      ["shipped", "in transit", "out for delivery"].includes(
        (o.status || "").toLowerCase(),
      ),
    ).length;

    const deliveredCount = orders.filter((o) =>
      ["delivered", "completed"].includes((o.status || "").toLowerCase()),
    ).length;

    const fulfillmentRate =
      orders.length > 0
        ? Math.round(((deliveredCount + shippedCount) / orders.length) * 100)
        : 100;

    return {
      batchRevenue,
      avgTicket,
      pendingCount,
      shippedCount,
      deliveredCount,
      fulfillmentRate,
    };
  }, [orders]);

  // Filtered & Sorted Orders
  const processedOrders = useMemo(() => {
    const list = [...orders].filter((order) => {
      const currentStatus = (order.status || "pending").toLowerCase();

      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (order._id || "").toLowerCase().includes(q);
        const nameMatch = (order.user?.fullName || "")
          .toLowerCase()
          .includes(q);
        const emailMatch = (order.user?.email || "").toLowerCase().includes(q);
        const itemMatch = (order.orderItems || []).some((it: any) =>
          (it.product?.name || it.name || "").toLowerCase().includes(q),
        );
        return idMatch || nameMatch || emailMatch || itemMatch;
      }

      return true;
    });

    if (sortBy === "total-desc") {
      list.sort(
        (a, b) => (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0),
      );
    } else if (sortBy === "total-asc") {
      list.sort(
        (a, b) => (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0),
      );
    } else if (sortBy === "items-desc") {
      list.sort(
        (a, b) => (b.orderItems?.length || 0) - (a.orderItems?.length || 0),
      );
    } else {
      // newest first
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    }

    return list;
  }, [orders, searchQuery, statusFilter, sortBy]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-8">
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS & ENTRANCE KEYFRAMES                             */}
      {/* ================================================================== */}
      <style>{`
        @keyframes orderFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .order-enter-1 { animation: orderFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both; }
        .order-enter-2 { animation: orderFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.09s both; }
        .order-enter-3 { animation: orderFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }

        .order-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .order-3d-card:hover {
            transform: translateY(-4px) rotateX(3deg) rotateY(-3deg);
            box-shadow: 0 22px 44px -12px rgba(17, 17, 17, 0.12);
          }
        }
      `}</style>

      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className=" relative z-10 mx-auto max-w-full space-y-6 ">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE FULFILLMENT HEADER                                  */}
        {/* ================================================================ */}
        <header className="order-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[#F4F3F4] px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-700">
                ADMIN PANEL · FULFILLMENT &amp; LOGISTICS
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                All Orders
              </h1>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-black text-neutral-700">
                {total ?? 0} Record{total !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs font-medium text-neutral-500">
              Real-time dispatch queue, customer manifests, and payment
              telemetry.
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-neutral-200/90 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-neutral-800 transition-all duration-200 hover:border-black hover:bg-neutral-50"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Overview</span>
              <ArrowUpRight
                size={13}
                className="text-neutral-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
              />
            </Link>

            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-emerald-400"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />
              <span>{loading ? "Syncing..." : "Sync Telemetry"}</span>
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. DARK LUXURY LOGISTICS PULSE RIBBON                            */}
        {/* ================================================================ */}
        <div className="order-enter-2 relative overflow-hidden rounded-2xl bg-[#111111] px-5 py-3.5 text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Logistics Velocity
                </p>
                <p className="text-xs font-extrabold tracking-wide text-white">
                  {telemetry.fulfillmentRate}% Dispatch &amp; Completion Rate on
                  Current Page
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Page Volume
                </span>
                <span className="font-mono text-sm font-black text-white">
                  ${telemetry.batchRevenue.toLocaleString()}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Avg. Ticket
                </span>
                <span className="font-mono text-sm font-black text-emerald-400">
                  ${telemetry.avgTicket.toLocaleString()}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Awaiting Action
                </span>
                <span
                  className={`font-mono text-sm font-black ${
                    telemetry.pendingCount > 0
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {telemetry.pendingCount} Order
                  {telemetry.pendingCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. 3D KPI TELEMETRY CARDS                                        */}
        {/* ================================================================ */}
        <div
          style={{ perspective: "1100px" }}
          className="order-enter-2 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {/* Total Orders */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Master Log
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {total ?? 0}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Total Orders Placed
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F3F4] text-[#111111] transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <Package size={19} />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Queue Status
              </p>
              <p className="mt-1 font-mono text-xl font-black text-amber-600 sm:text-2xl">
                {telemetry.pendingCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Pending / Processing
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <Clock size={19} />
            </div>
          </div>

          {/* In Transit / Shipped */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Dispatched
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {telemetry.shippedCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                In Transit Couriers
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800 group-hover:bg-[#111111] group-hover:text-white transition-colors">
              <Truck size={19} />
            </div>
          </div>

          {/* Delivered */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Fulfilled
              </p>
              <p className="mt-1 font-mono text-xl font-black text-emerald-600 sm:text-2xl">
                {telemetry.deliveredCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Delivered to Client
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. INTERACTIVE FILTER, SEARCH & SORT STUDIO BAR                  */}
        {/* ================================================================ */}
        <div className="order-enter-3 flex flex-col justify-between gap-3.5 rounded-3xl border border-white/90 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Search + Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[230px] flex-1 sm:w-64 sm:flex-initial">
              <Search
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search #ID, customer, email..."
                className="w-full rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-9 pr-3 text-xs font-semibold text-[#111111] placeholder:text-neutral-400 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            {/* Status Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border border-neutral-200/90 bg-[#F8F8F8] p-1">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "processing", label: "Processing" },
                { id: "shipped", label: "Shipped" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                    statusFilter === tab.id
                      ? "bg-[#111111] text-white shadow-2xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center justify-between gap-2.5 sm:justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Showing {processedOrders.length} of {orders.length}
            </span>

            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute left-3 text-neutral-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort orders"
                className="cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-8 pr-7 text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 focus:border-black focus:bg-white focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="total-desc">Total: High → Low</option>
                <option value="total-asc">Total: Low → High</option>
                <option value="items-desc">Items: Most First</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. LOADING SKELETON / EMPTY STATE / ORDERS TABLES                */}
        {/* ================================================================ */}
        {loading ? (
          <div className="space-y-3 rounded-3xl border border-white/90 bg-white p-5 shadow-xs">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-full animate-pulse items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-[#F8F8F8] px-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded-xl bg-neutral-200/80" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-36 rounded bg-neutral-200/90" />
                    <div className="h-2.5 w-24 rounded bg-neutral-200/60" />
                  </div>
                </div>
                <div className="hidden h-9 w-28 rounded-xl bg-neutral-200/70 sm:block" />
                <div className="h-8 w-24 rounded-xl bg-neutral-200/90" />
              </div>
            ))}
          </div>
        ) : total === 0 || processedOrders.length === 0 ? (
          <div className="order-enter-3 flex flex-col items-center justify-center rounded-3xl border border-white/90 bg-white px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-[#F8F8F8] text-neutral-400">
              <Package size={28} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-black uppercase tracking-wider text-[#111111]">
              {total === 0 ? "No Orders Recorded Yet" : "No Matching Orders"}
            </p>
            <p className="mt-1 max-w-xs text-xs text-neutral-400">
              {total === 0
                ? "Incoming customer orders will appear here in real time."
                : "Try clearing your search query or switching the active status filter."}
            </p>
            {total !== 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setSortBy("newest");
                }}
                className="mt-4 cursor-pointer rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-neutral-800"
              >
                Reset Active Filters
              </button>
            )}
          </div>
        ) : (
          <div className="order-enter-3">
            <DeskTopOrder
              orders={processedOrders}
              goToPage={goToPage}
              totalPages={totalPages}
              page={page}
              total={total}
              onOrderDeleted={handleDeleteOrder}
            />
            <MobileOrders
              orders={processedOrders}
              goToPage={goToPage}
              page={page}
              total={total}
              onOrderDeleted={handleDeleteOrder}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
