// app/dashboard/products/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  Plus,
  Boxes,
  Sparkles,
  AlertTriangle,
  Tag,
  Layers,
  ArrowUpRight,
  Store,
} from "lucide-react";

import ProductList from "@/components/features/admin/ProductList";
import { products } from "@/lib/Products";
import Pagination from "@/components/common/Pagination";

/* -------------------------------------------------------------------------- */
/*                        PAGE SEO METADATA (FIXES TAB)                       */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Catalog Studio · All Products",
  description:
    "Manage SHOP.CO luxury garments, pricing, and real-time warehouse stock levels.",
};

/* -------------------------------------------------------------------------- */
/*                              MAIN SERVER PAGE                              */
/* -------------------------------------------------------------------------- */

export default async function ManageProducts({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = 10;

  const productsData = await products("/product", page, limit);

  const productList = productsData?.data?.Products ?? [];
  const pagination = productsData?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const totalCount = pagination?.total ?? productList.length;

  // Global or page-level telemetry stats
  const statsObj = productsData?.stats || {};
  const onSaleCount =
    statsObj.onSaleCount ??
    productList.filter((p: any) => (p.discount ?? 0) > 0 || p.onSale).length;
  const lowStockCount =
    statsObj.lowStockCount ??
    productList.filter((p: any) => (p.countInStock ?? 10) <= 5).length;

  const pageCatalogValue = productList.reduce(
    (sum: number, p: any) => sum + (Number(p.price) || 0),
    0,
  );

  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-8">
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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE CATALOG HEADER                                      */}
        {/* ================================================================ */}
        <header className="studio-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[#F4F3F4] px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#111111]" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-700">
                ADMIN PANEL · CATALOG STUDIO
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                All Products
              </h1>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-black text-neutral-700">
                {totalCount} SKU{totalCount !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs font-medium text-neutral-500">
              Showing items{" "}
              <strong className="font-bold text-neutral-900">
                {startItem}–{endItem}
              </strong>{" "}
              of{" "}
              <strong className="font-bold text-neutral-900">
                {totalCount}
              </strong>{" "}
              registered garments in the master archive.
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-2xl border border-neutral-200/90 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-neutral-800 transition-all duration-200 hover:border-black hover:bg-neutral-50"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Live Shop</span>
              <ArrowUpRight
                size={13}
                className="text-neutral-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
              />
            </Link>

            <Link
              href="/dashboard/products/add"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-[#111111] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_18px_36px_-6px_rgba(0,0,0,0.45)] active:scale-95"
            >
              <Plus
                size={15}
                strokeWidth={3}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              <span>Add Product</span>
            </Link>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. 3D CATALOG TELEMETRY STRIP                                    */}
        {/* ================================================================ */}
        <div className="studio-enter-2 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Total Listed */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Master Archive
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {totalCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Total Listed SKUs
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F3F4] text-[#111111] transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <Boxes size={18} />
            </div>
          </div>

          {/* Card 2: Page Valuation */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Page Unit Value
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                ${pageCatalogValue.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                {productList.length} items on page {page}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F3F4] text-[#111111] transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <Sparkles size={18} />
            </div>
          </div>

          {/* Card 3: On Promotion */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Active Promos
              </p>
              <p className="mt-1 font-mono text-xl font-black text-emerald-600 sm:text-2xl">
                {onSaleCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Discounted Garments
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Tag size={18} />
            </div>
          </div>

          {/* Card 4: Restock Watch */}
          <div className="group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Restock Alerts
              </p>
              <p
                className={`mt-1 font-mono text-xl font-black sm:text-2xl ${
                  lowStockCount > 0 ? "text-amber-600" : "text-[#111111]"
                }`}
              >
                {lowStockCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                SKUs with ≤ 5 units
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                lowStockCount > 0
                  ? "bg-amber-500/15 text-amber-600"
                  : "bg-[#F4F3F4] text-neutral-700"
              }`}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. UNIFIED INTERACTIVE CATALOG STUDIO + PAGINATION               */}
        {/* ================================================================ */}
        <div className="studio-enter-3 overflow-hidden rounded-3xl border border-white/90 bg-white shadow-[0_14px_40px_-14px_rgba(0,0,0,0.07)]">
          {/* Client Interactive Catalog Component */}
          <ProductList key={page} initialProducts={productList} />

          {/* Bottom Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 bg-[#F8F8F8]/70 px-5 py-4 sm:flex-row sm:px-6">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                <Layers size={14} className="text-[#111111]" />
                <span>
                  Page{" "}
                  <strong className="text-[#111111]">{pagination.page}</strong>{" "}
                  of{" "}
                  <strong className="text-[#111111]">
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
