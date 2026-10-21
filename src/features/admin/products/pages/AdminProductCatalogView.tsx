"use client";

import Link from "next/link";
import {
  Plus, Boxes, Sparkles, AlertTriangle, Tag, Layers, ArrowUpRight, Store,
} from "lucide-react";
import ProductList from "@/features/admin/products/components/AdminProductList";
import Pagination from "@/shared/components/navigation/LinkPagination";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

type CatalogPagination = { page: number; totalPages: number; total: number };
type CatalogViewProps = {
  page: number;
  totalCount: number;
  productList: any[];
  pagination: CatalogPagination;
  onSaleCount: number;
  lowStockCount: number;
  pageCatalogValue: number;
  startItem: number;
  endItem: number;
};

export default function AdminProductCatalogView({
  page, totalCount, productList, pagination, onSaleCount, lowStockCount,
  pageCatalogValue, startItem, endItem,
}: CatalogViewProps) {
  const { t, locale, direction } = useLocale();
  return (
    <div dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-8">
      {/* GPU Entrance & 3D Card Styles */}
      <style>{`
        @keyframes studioFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .studio-enter-1 { animation: studioFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both; }
        .studio-enter-2 { animation: studioFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.09s both; }
        .studio-enter-3 { animation: studioFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
      `}</style>

      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE CATALOG HEADER                                      */}
        {/* ================================================================ */}
        <header className="studio-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-12px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-action" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
                {t("adminCatalogStudio")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {t("adminAllProducts")}
              </h1>
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[11px] font-black text-secondary">
                {totalCount.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")} {t("adminSkuCount")}
              </span>
            </div>

            <p className="text-xs font-medium text-muted">
              {t("adminShowingItems")}{" "}
              <strong className="font-bold text-primary">
                {startItem}–{endItem}
              </strong>{" "}
              {t("adminOf")}{" "}
              <strong className="font-bold text-primary">
                {totalCount}
              </strong>{" "}
              {t("adminRegisteredGarments")}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border/90 bg-surface px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-subtle"
            >
              <Store size={14} />
              <span className="hidden sm:inline">{t("adminLiveShop")}</span>
              <ArrowUpRight
                size={13}
                className="text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>

            <Link
              href="/dashboard/products/add"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-action px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-on-action shadow-[0_12px_28px_-6px_rgba(var(--shadow-rgb),0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-[0_18px_36px_-6px_rgba(var(--shadow-rgb),0.45)] active:scale-95"
            >
              <Plus
                size={15}
                strokeWidth={3}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              <span>{t("adminCreateProduct")}</span>
            </Link>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. 3D CATALOG TELEMETRY STRIP                                    */}
        {/* ================================================================ */}
        <div className="studio-enter-2 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Total Listed */}
          <div className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("adminMasterArchive")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {totalCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("adminTotalListedSkus")}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-subtle text-primary transition-colors group-hover:bg-action group-hover:text-on-action">
              <Boxes size={18} />
            </div>
          </div>

          {/* Card 2: Page Valuation */}
          <div className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("adminPageUnitValue")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {formatCurrency(pageCatalogValue, locale)}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {productList.length} {t("adminItemsOnPage")} {page}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-subtle text-primary transition-colors group-hover:bg-action group-hover:text-on-action">
              <Sparkles size={18} />
            </div>
          </div>

          {/* Card 3: On Promotion */}
          <div className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("adminActivePromos")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-success sm:text-2xl">
                {onSaleCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("adminDiscountedItems")}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
              <Tag size={18} />
            </div>
          </div>

          {/* Card 4: Restock Watch */}
          <div className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("adminRestockAlerts")}
              </p>
              <p
                className={`mt-1 font-mono text-xl font-black sm:text-2xl ${
                  lowStockCount > 0 ? "text-warning" : "text-primary"
                }`}
              >
                {lowStockCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("adminSkusAtMostFive")}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                lowStockCount > 0
                  ? "bg-warning-soft text-warning"
                  : "bg-surface-subtle text-secondary"
              }`}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. UNIFIED INTERACTIVE CATALOG STUDIO + PAGINATION               */}
        {/* ================================================================ */}
        <div className="studio-enter-3 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)]">
          {/* Client Interactive Catalog Component */}
          <ProductList key={page} initialProducts={productList} />

          {/* Bottom Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle bg-surface-subtle/70 px-5 py-4 sm:flex-row sm:px-6">
              <div className="flex items-center gap-2 text-xs font-bold text-muted">
                <Layers size={14} className="text-primary" />
                <span>
                  Page{" "}
                  <strong className="text-primary">{pagination.page}</strong>{" "}
                  {t("adminOf")}{" "}
                  <strong className="text-primary">
                    {pagination.totalPages}
                  </strong>
                </span>
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
