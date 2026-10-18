// @/features/admin/dashboard/components/LowStackList.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Edit3,
  Search,
  Sparkles,
  CheckCircle2,
  Flame,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const LowStockProductList = ({
  lowStockProducts = [],
}: {
  lowStockProducts: any[];
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "out" | "urgent">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
  };

  const safeList = Array.isArray(lowStockProducts) ? lowStockProducts : [];

  const depletedCount = useMemo(
    () => safeList.filter((i) => (i.countInStock ?? 0) === 0).length,
    [safeList],
  );
  const urgentCount = useMemo(
    () =>
      safeList.filter((i) => {
        const s = i.countInStock ?? 0;
        return s > 0 && s <= 5;
      }).length,
    [safeList],
  );

  const filteredProducts = useMemo(() => {
    return safeList
      .filter((item) => {
        const stock = item.countInStock ?? 0;
        if (filterMode === "out" && stock !== 0) return false;
        if (filterMode === "urgent" && (stock === 0 || stock > 5)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchCat = (item.category || "").toLowerCase().includes(q);
          return matchName || matchCat;
        }
        return true;
      })
      .slice(0, 8);
  }, [safeList, filterMode, searchQuery]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)]">
      {/* ================================================================== */}
      {/* 1. WATCHLIST COMMAND HEADER & LIVE FILTER TABS                     */}
      {/* ================================================================== */}
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle bg-surface-subtle/70 p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-action text-on-action shadow-md">
            <AlertTriangle size={18} className="text-rating" />
            {safeList.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger font-mono text-[9px] font-black text-on-danger">
                {safeList.length}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-tight text-primary sm:text-base">
                Critical Inventory Watchlist
              </h3>
              <span className="hidden rounded-full border border-warning-border bg-warning-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-warning sm:inline-block">
                Restock Priority
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-muted">
              SKUs with ≤ 5 units remaining requiring immediate warehouse
              replenishment.
            </p>
          </div>
        </div>

        {/* Interactive Filter Pills + Search + Catalog Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter SKU or category..."
              className="w-full rounded-xl border border-border bg-surface py-1.5 pl-8 pr-3 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Filter Mode Tabs */}
          <div className="inline-flex rounded-xl border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                filterMode === "all"
                  ? "bg-action text-on-action"
                  : "text-muted hover:text-primary"
              }`}
            >
              All ({safeList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("urgent")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                filterMode === "urgent"
                  ? "bg-warning text-on-warning"
                  : "text-muted hover:text-warning"
              }`}
            >
              Low ({urgentCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("out")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                filterMode === "out"
                  ? "bg-danger text-on-danger"
                  : "text-muted hover:text-danger"
              }`}
            >
              Zero ({depletedCount})
            </button>
          </div>

          <Link
            href="/dashboard/products"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-primary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
          >
            <span>Manage All</span>
            <ArrowUpRight
              size={13}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. TABLE OR HEALTHY EMPTY STATE                                    */}
      {/* ================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success-soft text-success">
            <CheckCircle2 size={22} />
          </div>
          <p className="text-sm font-black uppercase tracking-wider text-primary">
            {safeList.length === 0
              ? "All Catalog Stock Levels Optimal"
              : "No Matching SKUs Found"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {safeList.length === 0
              ? "Every listed garment currently has more than 5 units in warehouse stock."
              : "Try clearing your search filter or switching stock tabs above."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-subtle/50 text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                <th className="py-3.5 px-5 sm:px-6">Garment / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Stock Telemetry (5-Unit Scale)</th>
                <th className="py-3.5 px-5 text-right sm:px-6">Replenish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredProducts.map((item: any) => {
                const stockVal = Math.max(0, Number(item.countInStock ?? 0));
                const isOut = stockVal === 0;

                return (
                  <tr
                    key={item._id}
                    className="group transition-all duration-200 hover:bg-surface-subtle"
                  >
                    {/* Product Thumbnail + Full Name */}
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted shadow-2xs transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src={getImageUrl(item.images?.[0] || item.photo)}
                            alt={item.name || "Product"}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            title={item.name}
                            className="max-w-[180px] truncate text-xs font-extrabold text-primary sm:max-w-[260px]"
                          >
                            {item.name}
                          </p>
                          <span className="mt-0.5 block truncate font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {item.section || item.style || "STUDIO ARCHIVE"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex rounded-lg border border-border/80 bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {item.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono text-xs font-black text-primary">
                      ${Number(item.price || 0).toLocaleString()}
                    </td>

                    {/* Visual 5-Segment Stock Meter + Badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* 5-Cell Visual Battery Gauge */}
                        <div className="hidden items-center gap-1 sm:flex">
                          {[1, 2, 3, 4, 5].map((cell) => {
                            const filled = stockVal >= cell;
                            return (
                              <span
                                key={cell}
                                className={`h-3.5 w-1.5 rounded-xs transition-all ${
                                  !filled
                                    ? "bg-surface-hover"
                                    : stockVal <= 2
                                      ? "bg-danger"
                                      : "bg-warning"
                                }`}
                              />
                            );
                          })}
                        </div>

                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-soft px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-danger">
                            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-danger" />
                            Depleted (0 left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-soft px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-warning">
                            <Flame size={11} className="text-warning" />
                            Urgent · {stockVal} left
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-5 text-right sm:px-6">
                      <Link
                        href={`/dashboard/products/edit/${item._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-action hover:text-on-action"
                      >
                        <Edit3 size={11} />
                        <span>Restock</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

