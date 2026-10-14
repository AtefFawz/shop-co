// @/components/features/admin/ProductList.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  Tag,
  PackageX,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Copy,
  Check,
  Flame,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductList({
  initialProducts = [],
}: {
  initialProducts?: Product[];
}) {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);

  // Interactive Studio Controls
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<
    "all" | "healthy" | "low" | "out"
  >("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "stock-asc"
  >("default");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  // Unified Image Helper (supports both direct URLs & Cloudinary paths)
  const getImageUrl = (p: any) => {
    const raw = p?.photo || p?.images?.[0];
    if (!raw) return null;
    if (typeof raw === "string" && raw.startsWith("http")) return raw;
    return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
  };

  // Copy SKU ID to clipboard
  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`SKU #${id.slice(-6).toUpperCase()} copied`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Delete Handler with Toast Feedback
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`product/${id}`);

      setProductsList((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product permanently removed from catalog");
      router.refresh();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product";
      console.error("Error deleting product:", msg);
      toast.error(msg);
    } finally {
      setDeletingId(null);
      setConfirmProduct(null);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const list = [...(productsList || [])].filter((p: any) => {
      const stock = Number(p.countInStock ?? 10);
      if (stockFilter === "healthy" && stock <= 5) return false;
      if (stockFilter === "low" && (stock === 0 || stock > 5)) return false;
      if (stockFilter === "out" && stock !== 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (p.name || "").toLowerCase().includes(q);
        const catMatch = (p.category || "").toLowerCase().includes(q);
        const idMatch = (p._id || "").toLowerCase().includes(q);
        return nameMatch || catMatch || idMatch;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "stock-asc") {
      list.sort(
        (a: any, b: any) =>
          Number(a.countInStock ?? 10) - Number(b.countInStock ?? 10),
      );
    }

    return list;
  }, [productsList, searchQuery, stockFilter, sortBy]);

  return (
    <>
      {/* ================================================================== */}
      {/* 1. 3D INTERACTIVE DELETE CONFIRMATION MODAL                        */}
      {/* ================================================================== */}
      {confirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-200">
            {/* Top Warning Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-center text-lg font-black uppercase tracking-tight text-[#111111]">
              Remove From Archive?
            </h3>
            <p className="mt-1 text-center text-xs leading-relaxed text-neutral-500">
              This action is permanent and will immediately delist the garment
              from the live storefront.
            </p>

            {/* Preview Card of the Product Being Deleted */}
            <div className="my-5 flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-3">
              {getImageUrl(confirmProduct) ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <Image
                    src={getImageUrl(confirmProduct)!}
                    alt={confirmProduct.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-[10px] font-black text-neutral-500">
                  N/A
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-[#111111]">
                  {confirmProduct.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] font-bold text-neutral-500">
                  <span>SKU #{confirmProduct._id.slice(-6).toUpperCase()}</span>
                  <span>•</span>
                  <span className="text-[#111111]">
                    ${Number(confirmProduct.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={!!deletingId}
                onClick={() => setConfirmProduct(null)}
                className="flex-1 cursor-pointer rounded-2xl border border-neutral-200 bg-white py-3 text-xs font-black uppercase tracking-wider text-neutral-700 transition-colors hover:border-black hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmProduct._id)}
                disabled={!!deletingId}
                className="flex-1 cursor-pointer rounded-2xl bg-rose-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_10px_24px_-6px_rgba(225,29,72,0.5)] transition-all hover:bg-rose-700 disabled:opacity-60"
              >
                {deletingId ? "Removing..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 2. INTERACTIVE STUDIO CONTROL BAR (SEARCH, FILTERS, SORT, VIEW)    */}
      {/* ================================================================== */}
      <div className="flex flex-col justify-between gap-3.5 border-b border-neutral-100 bg-[#F8F8F8]/75 p-4 sm:p-5 lg:flex-row lg:items-center">
        {/* Left: Instant Search + Stock Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-initial">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, category, or SKU..."
              className="w-full rounded-xl border border-neutral-200/90 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-[#111111] placeholder:text-neutral-400 focus:border-black focus:outline-none"
            />
          </div>

          {/* Stock Status Filter Tabs */}
          <div className="inline-flex rounded-xl border border-neutral-200/90 bg-white p-1">
            {(
              [
                { id: "all", label: "All" },
                { id: "healthy", label: "In Stock" },
                { id: "low", label: "Low (≤5)" },
                { id: "out", label: "Zero" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStockFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  stockFilter === tab.id
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sort Selector + View Mode Switcher (Table vs 3D Grid) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown
              size={12}
              className="pointer-events-none absolute left-3 text-neutral-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products"
              className="cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-white py-2 pl-8 pr-7 text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 focus:border-black focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="stock-asc">Stock: Low → High</option>
            </select>
          </div>

          {/* Table vs 3D Grid View Switcher */}
          <div className="inline-flex rounded-xl border border-neutral-200/90 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === "table"
                  ? "bg-[#111111] text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
              title="Editorial Table View"
            >
              <List size={13} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === "grid"
                  ? "bg-[#111111] text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
              title="3D Showroom Grid View"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">3D Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. EMPTY STATE                                                     */}
      {/* ================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-[#F8F8F8] text-neutral-400">
            <PackageX size={28} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-black uppercase tracking-wider text-[#111111]">
            No Matching Garments Found
          </p>
          <p className="mt-1 max-w-xs text-xs text-neutral-400">
            {productsList.length === 0
              ? "Your catalog archive is currently empty. Add your first product to get started."
              : "No items match your active search or stock filter criteria."}
          </p>
          {productsList.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStockFilter("all");
                setSortBy("default");
              }}
              className="mt-4 cursor-pointer rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-neutral-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* ================================================================ */
        /* 4A. EDITORIAL TABLE VIEW                                         */
        /* ================================================================ */
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                <th className="py-3.5 px-5">Garment / SKU</th>
                <th className="hidden py-3.5 px-4 sm:table-cell">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="hidden py-3.5 px-4 md:table-cell">
                  Stock Telemetry
                </th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white text-xs">
              {filteredProducts.map((p: any) => {
                const imgUrl = getImageUrl(p);
                const stock = Math.max(0, Number(p.countInStock ?? 10));
                const isOut = stock === 0;
                const isLow = stock > 0 && stock <= 5;
                const shortId = p._id.slice(-6).toUpperCase();

                return (
                  <tr
                    key={p._id}
                    className="group transition-colors duration-150 hover:bg-[#F8F8F8]/90"
                  >
                    {/* 1. Product Info & Thumbnail */}
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3.5">
                        {imgUrl ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-2xs">
                            <Image
                              src={imgUrl}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 text-[10px] font-black uppercase text-neutral-400">
                            N/A
                          </div>
                        )}

                        <div className="min-w-0 max-w-[175px] sm:max-w-[260px]">
                          <p
                            title={p.name}
                            className="truncate text-xs font-extrabold text-[#111111] transition-colors group-hover:text-black sm:text-sm"
                          >
                            {p.name}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyId(p._id)}
                              title="Click to copy full SKU ID"
                              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-500 transition-colors hover:bg-[#111111] hover:text-white"
                            >
                              <span>#{shortId}</span>
                              {copiedId === p._id ? (
                                <Check size={10} className="text-emerald-400" />
                              ) : (
                                <Copy size={10} />
                              )}
                            </button>

                            {(p.section || p.style) && (
                              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                                · {p.section || p.style}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Category */}
                    <td className="hidden py-3.5 px-4 align-middle sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-[#F8F8F8] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                        <Tag size={11} className="text-neutral-400" />
                        {p.category || "General"}
                      </span>
                    </td>

                    {/* 3. Price */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-black text-[#111111] sm:text-sm">
                          ${Number(p.price || 0).toLocaleString()}
                        </span>
                        {Number(p.discount) > 0 && (
                          <span className="mt-0.5 inline-block w-fit rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-black uppercase text-emerald-700">
                            -{p.discount}% Promo
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 4. Stock Telemetry */}
                    <td className="hidden py-3.5 px-4 align-middle md:table-cell">
                      <div className="flex items-center gap-3">
                        {/* 5-Bar Visual Gauge */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((bar) => {
                            const active =
                              stock >= bar * (stock > 5 ? 3 : 1) ||
                              (stock > 0 && bar === 1);
                            return (
                              <span
                                key={bar}
                                className={`h-3.5 w-1.5 rounded-xs ${
                                  !active
                                    ? "bg-neutral-200"
                                    : isOut
                                      ? "bg-rose-500"
                                      : isLow
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                }`}
                              />
                            );
                          })}
                        </div>

                        {isOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-600">
                            Depleted (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700">
                            <Flame size={10} />
                            Low ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                            <CheckCircle2 size={10} />
                            {stock} in stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-3.5 px-5 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/products/edit/${p._id}`)
                          }
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs transition-all hover:-translate-y-0.5 hover:bg-neutral-800 active:scale-95"
                          title="Edit Product"
                        >
                          <Pencil size={13} />
                          <span className="hidden lg:inline">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmProduct(p)}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-rose-600 transition-all hover:-translate-y-0.5 hover:border-rose-600 hover:bg-rose-600 hover:text-white active:scale-95"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                          <span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================================================================ */
        /* 4B. 3D SHOWROOM CARDS GRID VIEW                                  */
        /* ================================================================ */
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p: any) => {
            const imgUrl = getImageUrl(p);
            const stock = Math.max(0, Number(p.countInStock ?? 10));
            const isOut = stock === 0;
            const isLow = stock > 0 && stock <= 5;

            return (
              <div
                key={p._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-[#F8F8F8] p-3.5 transition-all duration-500 hover:-translate-y-1.5 hover:border-black/20 hover:bg-white hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)]"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 260px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase text-neutral-300">
                      No Image
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#111111] shadow-2xs backdrop-blur-md">
                      {p.category || "General"}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider shadow-2xs backdrop-blur-md ${
                        isOut
                          ? "bg-rose-600 text-white"
                          : isLow
                            ? "bg-amber-500 text-white"
                            : "bg-[#111111]/85 text-white"
                      }`}
                    >
                      {isOut ? "Zero Stock" : `${stock} Units`}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="mt-3.5 space-y-2 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      title={p.name}
                      className="truncate text-sm font-black text-[#111111]"
                    >
                      {p.name}
                    </h4>
                    <span className="font-mono text-sm font-black text-[#111111]">
                      ${Number(p.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>SKU #{p._id.slice(-6).toUpperCase()}</span>
                    <span>{p.section || p.style || "ARCHIVE"}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 flex gap-2 border-t border-neutral-200/70 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/products/edit/${p._id}`)
                    }
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#111111] py-2.5 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:bg-neutral-800"
                  >
                    <Pencil size={12} />
                    <span>Edit SKU</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmProduct(p)}
                    className="flex cursor-pointer items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
                    title="Delete SKU"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
