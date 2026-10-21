"use client";

// app/dashboard/page.tsx
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AdminMetricCard, type AdminMetricCardProps } from "@/features/admin/dashboard/components/AdminMetricCard";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types";
import { calculateTrend } from "@/utils/formatters";
import { RevenueTrendChart } from "@/features/admin/dashboard/components/RevenueTrendChart";
import { LowStockProductList } from "@/features/admin/dashboard/components/LowStockProductList";

type AdminDashboardClientProps = {
  stats: any;
  productsResponse: any;
};

export default function AdminDashboardClient({
  stats,
  productsResponse,
}: AdminDashboardClientProps) {
  const { t, locale, direction } = useLocale();

  const allProducts: Product[] = productsResponse?.data?.Products || [];
  const totalCount = productsResponse?.pagination?.total ?? allProducts.length;

  const lowStockProducts = allProducts.filter(
    (p: any) => (p.countInStock ?? 10) <= 5,
  );

  const {
    onSaleCount: onSaleProducts = 0,
    lowStockCount = 0,
    outOfStockCount: outOfStockProducts = 0,
  } = productsResponse?.stats || {};

  const safeTotal = Math.max(totalCount, 1);

  const salePercentage = Math.min(
    Math.round((onSaleProducts / safeTotal) * 100),
    100,
  );

  const lowStockPercentage = Math.min(
    Math.round((lowStockCount / safeTotal) * 100),
    100,
  );

  const healthyCount = Math.max(
    totalCount - lowStockCount - outOfStockProducts,
    0,
  );
  const healthyPercentage = Math.max(
    0,
    Math.min(Math.round((healthyCount / safeTotal) * 100), 100),
  );

  // Executive derived metrics
  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Calculate dynamic trends
  const revenueTrend = calculateTrend(
    stats?.currentMonthRevenue,
    stats?.lastMonthRevenue,
  );
  const ordersTrend = calculateTrend(
    stats?.currentMonthOrders,
    stats?.lastMonthOrders,
  );
  const usersTrend = calculateTrend(
    stats?.currentMonthUsers,
    stats?.lastMonthUsers,
  );

  const statCards: AdminMetricCardProps[] = [
    {
      title: t("dashboardMetricRevenue"),
      value: formatCurrency(totalRevenue, locale),
      icon: TrendingUp,
      trend: revenueTrend.trend,
      trendUp: revenueTrend.trendUp,
      subtitle: t("dashboardVsLastMonth"),
    },
    {
      title: t("dashboardMetricOrders"),
      value: totalOrders,
      icon: ShoppingBag,
      trend: ordersTrend.trend,
      trendUp: ordersTrend.trendUp,
      subtitle: `${pendingOrders} ${t("dashboardPendingFulfillment")}`,
    },
    {
      title: t("dashboardMetricCustomers"),
      value: stats?.totalUsers ?? 0,
      icon: Users,
      trend: usersTrend.trend,
      trendUp: usersTrend.trendUp,
      subtitle: `+${stats?.currentMonthUsers ?? 0} ${t("dashboardJoinedThisMonth")}`,
    },
    {
      title: t("dashboardMetricLowStock"),
      value: lowStockCount,
      icon: AlertTriangle,
      trend: lowStockCount > 0 ? t("dashboardActionNeeded") : t("dashboardOptimal"),
      trendUp: lowStockCount === 0,
      subtitle: `${lowStockPercentage}% ${t("dashboardOfCatalog")}`,
    },
  ];

  const circumference = 2 * Math.PI * 38;
  const healthStrokeOffset =
    circumference - (healthyPercentage / 100) * circumference;

  return (
    <div dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-8">
      <style>{`
        @keyframes dashFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .dash-enter-1 { animation: dashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.04s both; }
        .dash-enter-2 { animation: dashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both; }
        .dash-enter-3 { animation: dashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both; }
        .dash-enter-4 { animation: dashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both; }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_25%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* 1. EXECUTIVE COMMAND HEADER */}
        <header className="dash-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-12px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.22em] text-secondary text-nowrap">
                {t("dashboardCommandCenterLive")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {t("dashboardOverview")}
              </h1>
              <span className="hidden font-mono text-[11px] font-bold text-muted sm:inline-block">
                {t("dashboardStudioEdition")}
              </span>
            </div>

            <p className="text-xs font-medium text-muted">
              {t("dashboardDescription")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-2xl border border-border/90 bg-surface-subtle px-3.5 py-2.5 text-xs font-bold text-secondary">
              <Calendar size={14} className="text-primary" />
              <span>
                {new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border/90 bg-surface px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-subtle"
            >
              <Store size={14} />
              <span className="hidden sm:inline">{t("dashboardStorefront")}</span>
              <ArrowUpRight
                size={13}
                className="text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>

            <Link
              href="/admin/products/add"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-action px-4 py-2.5 text-xs font-black uppercase tracking-wider text-on-action shadow-[0_10px_25px_-6px_rgba(var(--shadow-rgb),0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <PackagePlus size={15} />
              <span>{t("dashboardAddProduct")}</span>
            </Link>
          </div>
        </header>

        {/* 2. EXECUTIVE INTELLIGENCE RIBBON */}
        <div className="dash-enter-2 relative overflow-hidden rounded-2xl bg-action px-5 py-3.5 text-on-action shadow-[0_14px_34px_-10px_rgba(var(--shadow-rgb),0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-on-action">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/50">
                  {t("dashboardExecutivePulse")}
                </p>
                <p className="text-xs font-extrabold tracking-wide text-on-action">
                  {t("dashboardInventoryReadiness").replace(
                    "{percent}",
                    healthyPercentage.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG"),
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("dashboardAverageOrderValue")}
                </span>
                <span className="font-mono text-sm font-black text-on-action">
                  {formatCurrency(avgOrderValue, locale)}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("dashboardActivePromotions")}
                </span>
                <span className="font-mono text-sm font-black text-success">
                  {onSaleProducts} {t("dashboardItems")} ({salePercentage}%)
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("dashboardCriticalRestock")}
                </span>
                <span
                  className={`font-mono text-sm font-black ${
                    lowStockCount > 0 ? "text-rating" : "text-success"
                  }`}
                >
                  {lowStockCount} {t("dashboardSkuCount")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 3D KPI STAT CARDS GRID */}
        <div className="dash-enter-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <AdminMetricCard
              key={card.title}
              {...card}
              verifiedLabel={t("dashboardVerified")}
              liveLabel={t("dashboardLiveStatus")}
            />
          ))}
        </div>

        {/* 4. ANALYTICS CHART (8 COLS) + 3D INVENTORY HEALTH (4 COLS) */}
        <div className="dash-enter-3 grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
          <RevenueTrendChart stats={stats} />

          {/* 3D Inventory Health Studio */}
          <div className="xl:col-span-4 flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-primary" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                    {t("dashboardInventoryTelemetry")}
                  </p>
                </div>
                <h3 className="mt-1 text-base font-black uppercase tracking-tight text-primary sm:text-lg">
                  {t("dashboardStockBreakdown")}
                </h3>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                  outOfStockProducts === 0
                    ? "bg-success-soft text-success"
                    : "bg-warning-soft text-warning"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    outOfStockProducts === 0 ? "bg-success" : "bg-warning"
                  }`}
                />
                {outOfStockProducts === 0 ? t("dashboardOptimal") : t("dashboardWatch")}
              </span>
            </div>

            {/* Radial Gauge */}
            <div className="my-5 flex items-center gap-5 rounded-2xl border border-border-subtle bg-surface-subtle p-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                <svg
                  className="h-full w-full -rotate-90 transform"
                  viewBox="0 0 96 96"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-subtle"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={healthStrokeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-lg font-black leading-none text-primary">
                    {healthyPercentage}%
                  </span>
                  <span className="mt-0.5 text-[8px] font-extrabold uppercase tracking-widest text-muted">
                    {t("dashboardHealthy")}
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                  {t("dashboardCatalogReadiness")}
                </p>
                <p className="text-[11px] leading-relaxed text-muted">
                  {t("dashboardCatalogHealthSummary")
                    .replace(
                      "{healthy}",
                      healthyCount.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG"),
                    )
                    .replace(
                      "{total}",
                      totalCount.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG"),
                    )}
                </p>
              </div>
            </div>

            {/* Telemetry Bars */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-secondary">
                    <CheckCircle2 size={13} className="text-success" />
                    {t("dashboardOptimalStock")}
                  </span>
                  <span className="font-mono text-primary">
                    {healthyPercentage}% ({healthyCount})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-700"
                    style={{ width: `${healthyPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-secondary">
                    <Tag size={13} className="text-primary" />
                    {t("dashboardOnPromotion")}
                  </span>
                  <span className="font-mono text-primary">
                    {salePercentage}% ({onSaleProducts})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-action transition-all duration-700"
                    style={{ width: `${salePercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-secondary">
                    <AlertTriangle size={13} className="text-warning" />
                    {t("dashboardLowAndDepleted")}
                  </span>
                  <span className="font-mono text-primary">
                    {lowStockPercentage}% ({lowStockProducts.length})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-warning transition-all duration-700"
                    style={{ width: `${lowStockPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Mini Metric Cards */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-border-subtle pt-4">
              <div className="rounded-2xl border border-border/70 bg-surface-subtle p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-muted">
                  {t("dashboardLiveCatalog")}
                </p>
                <p className="mt-1 font-mono text-lg font-black leading-none text-primary">
                  {totalCount}
                </p>
                <p className="mt-1 text-[9px] font-medium text-muted">
                  {t("dashboardTotalListed")}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-surface-subtle p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-muted">
                  {t("dashboardLowStock")}
                </p>
                <p className="mt-1 font-mono text-lg font-black leading-none text-warning">
                  {lowStockCount}
                </p>
                <p className="mt-1 text-[9px] font-medium text-muted">
                  {t("dashboardNeedsRestock")}
                </p>
              </div>

              <div className="rounded-2xl border border-danger-border bg-danger-soft p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-danger">
                  {t("dashboardZeroStock")}
                </p>
                <p className="mt-1 font-mono text-lg font-black leading-none text-danger">
                  {outOfStockProducts}
                </p>
                <p className="mt-1 text-[9px] font-medium text-danger">
                  {t("dashboardDepleted")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CRITICAL LOW STOCK WATCHLIST */}
        <div className="dash-enter-4">
          <LowStockProductList lowStockProducts={lowStockProducts} />
        </div>
      </div>
    </div>
  );
}
