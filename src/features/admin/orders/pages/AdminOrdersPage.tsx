"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, RefreshCw, Search, Sparkles, Clock, CheckCircle2, Truck, ArrowUpDown, Store, ArrowUpRight } from "lucide-react";
import useData from "@/hooks/getData";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { AdminMobileOrdersList } from "@/features/admin/orders/components/AdminMobileOrdersList";
import { AdminDesktopOrdersTable } from "@/features/admin/orders/components/AdminDesktopOrdersTable";

import type { AdminOrderRecord } from "@/types/domain";
export default function AdminOrdersPage() {
  const { t, locale, direction } = useLocale();
  const { loading, data, page, totalPages, goToPage, refetch, total } =
    useData("/order/all");
  const formatMoney = (value: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(value);

  // Interactive Studio States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "total-desc" | "total-asc" | "items-desc"
  >("newest");

  // Set Browser Tab Title
  useEffect(() => {
    document.title = `${t("ordersAllOrders")} | SHOP.CO™`;
  }, [t]);

  const handleDeleteOrder = () => {
    refetch();
  };

  const orders: AdminOrderRecord[] = useMemo(() => {
    return (data as unknown as { data?: { orders?: AdminOrderRecord[] } } | null)?.data?.orders ?? [];
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
        const itemMatch = (order.orderItems || []).some((it: AdminOrderRecord["orderItems"][number]) =>
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
    <div dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-8">
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
            box-shadow: 0 22px 44px -12px rgba(var(--shadow-rgb), 0.12);
          }
        }
      `}</style>

      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 mx-auto max-w-full space-y-6 ">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE FULFILLMENT HEADER                                  */}
        {/* ================================================================ */}
        <header className="order-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-12px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
                {t("ordersPanelTitle")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {t("ordersAllOrders")}
              </h1>
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[11px] font-black text-secondary">
                {total ?? 0} {t("ordersRecords")}
              </span>
            </div>

            <p className="text-xs font-medium text-muted">
              {t("ordersRealtimeDescription")}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border/90 bg-surface px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-subtle"
            >
              <Store size={14} />
              <span className="hidden sm:inline">{t("ordersOverview")}</span>
              <ArrowUpRight
                size={13}
                className="text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>

            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-action px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-on-action shadow-[0_12px_28px_-6px_rgba(var(--shadow-rgb),0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover active:scale-95 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-success"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />
              <span>{loading ? t("ordersSyncing") : t("ordersSyncTelemetry")}</span>
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. DARK LUXURY LOGISTICS PULSE RIBBON                            */}
        {/* ================================================================ */}
        <div className="order-enter-2 relative overflow-hidden rounded-2xl bg-action px-5 py-3.5 text-on-action shadow-[0_14px_34px_-10px_rgba(var(--shadow-rgb),0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-on-action">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/50">
                  {t("ordersLogisticsVelocity")}
                </p>
                <p className="text-xs font-extrabold tracking-wide text-on-action">
                  {telemetry.fulfillmentRate}% {t("ordersDispatchCompletion")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("ordersPageVolume")}
                </span>
                <span className="font-mono text-sm font-black text-on-action">
                  {formatMoney(telemetry.batchRevenue)}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("ordersAverageTicket")}
                </span>
                <span className="font-mono text-sm font-black text-success">
                  {formatMoney(telemetry.avgTicket)}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("ordersAwaitingAction")}
                </span>
                <span
                  className={`font-mono text-sm font-black ${
                    telemetry.pendingCount > 0
                      ? "text-rating"
                      : "text-success"
                  }`}
                >
                  {telemetry.pendingCount} {t(telemetry.pendingCount === 1 ? "ordersOrderSingular" : "ordersOrderPlural")}
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
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("ordersMasterLog")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {total ?? 0}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("ordersTotalPlaced")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-subtle text-primary transition-colors group-hover:bg-action group-hover:text-on-action">
              <Package size={19} />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("ordersQueueStatus")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-warning sm:text-2xl">
                {telemetry.pendingCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("ordersPendingProcessing")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning-soft text-warning">
              <Clock size={19} />
            </div>
          </div>

          {/* In Transit / Shipped */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("ordersDispatched")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {telemetry.shippedCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("ordersInTransit")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-secondary group-hover:bg-action group-hover:text-on-action transition-colors">
              <Truck size={19} />
            </div>
          </div>

          {/* Delivered */}
          <div className="order-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("ordersFulfilled")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-success sm:text-2xl">
                {telemetry.deliveredCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("ordersDeliveredToClient")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-soft text-success">
              <CheckCircle2 size={19} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. INTERACTIVE FILTER, SEARCH & SORT STUDIO BAR                  */}
        {/* ================================================================ */}
        <div className="order-enter-3 flex flex-col justify-between gap-3.5 rounded-3xl border border-border bg-surface p-4 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Search + Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[230px] flex-1 sm:w-64 sm:flex-initial">
              <Search
                size={14}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("ordersSearchPlaceholder")}
                className="w-full rounded-xl border border-border/90 bg-surface-subtle py-2 ps-9 pe-3 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
              />
            </div>

            {/* Status Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border border-border/90 bg-surface-subtle p-1">
              {[
                { id: "all", label: t("ordersFilterAll") },
                { id: "pending", label: t("ordersFilterPending") },
                { id: "processing", label: t("ordersFilterProcessing") },
                { id: "shipped", label: t("ordersFilterShipped") },
                { id: "delivered", label: t("ordersFilterDelivered") },
                { id: "cancelled", label: t("ordersFilterCancelled") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                    statusFilter === tab.id
                      ? "bg-action text-on-action shadow-2xs"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center justify-between gap-2.5 sm:justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {t("ordersShowing")} {processedOrders.length} {t("ordersOf")} {orders.length}
            </span>

            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute start-3 text-muted"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label={t("ordersSortLabel")}
                className="cursor-pointer appearance-none rounded-xl border border-border/90 bg-surface-subtle py-2 ps-8 pe-7 text-[11px] font-extrabold uppercase tracking-wider text-secondary focus:border-primary focus:bg-surface focus:outline-none"
              >
                <option value="newest">{t("ordersSortNewest")}</option>
                <option value="total-desc">{t("ordersSortTotalHighLow")}</option>
                <option value="total-asc">{t("ordersSortTotalLowHigh")}</option>
                <option value="items-desc">{t("ordersSortItemsMost")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. LOADING SKELETON / EMPTY STATE / ORDERS TABLES                */}
        {/* ================================================================ */}
        {loading ? (
          <div className="space-y-3 rounded-3xl border border-border bg-surface p-5 shadow-xs">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-full animate-pulse items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-subtle px-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded-xl bg-surface-hover/80" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-36 rounded bg-surface-hover/90" />
                    <div className="h-2.5 w-24 rounded bg-surface-hover/60" />
                  </div>
                </div>
                <div className="hidden h-9 w-28 rounded-xl bg-surface-hover/70 sm:block" />
                <div className="h-8 w-24 rounded-xl bg-surface-hover/90" />
              </div>
            ))}
          </div>
        ) : total === 0 || processedOrders.length === 0 ? (
          <div className="order-enter-3 flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-muted">
              <Package size={28} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-black uppercase tracking-wider text-primary">
              {total === 0 ? t("ordersNoRecords") : t("ordersNoMatches")}
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted">
              {total === 0
                ? t("ordersIncomingDescription")
                : t("ordersAdjustFilters")}
            </p>
            {total !== 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setSortBy("newest");
                }}
                className="mt-4 cursor-pointer rounded-xl bg-action px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-action hover:bg-action-hover"
              >
                {t("ordersClearFilters")}
              </button>
            )}
          </div>
        ) : (
          <div className="order-enter-3">
            <AdminDesktopOrdersTable
              orders={processedOrders}
              goToPage={goToPage}
              totalPages={totalPages}
              page={page}
              total={total}
              onOrderDeleted={handleDeleteOrder}
            />
            <AdminMobileOrdersList
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
