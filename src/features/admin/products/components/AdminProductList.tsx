// @/features/admin/products/components/ProductList.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import {
  Pencil,
  Trash2,
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
} from "lucide-react";
import Image from "next/image";

import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import { getApiErrorDetails } from "@/lib/errorUtils";

export default function AdminProductList({
  initialProducts = [],
}: {
  initialProducts?: Product[];
}) {
  const router = useRouter();
  const { t, locale, direction } = useLocale();

  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
    setProductsList(initialProducts);
  }, [initialProducts]);

  // ── Iron-clad Scroll Lock ──
  useEffect(() => {
    if (confirmProduct) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [confirmProduct]);

  // Unified Image Helper
  const getImageUrl = (p: Product) => {
    const raw = p?.photo || p?.images?.[0];
    if (!raw) return null;
    if (typeof raw === "string" && raw.startsWith("http")) return raw;
    return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
  };

  // Copy SKU ID to clipboard
  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`${t("adminSkuCopied")}: #${id.slice(-6).toUpperCase()}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Delete Handler with Toast Feedback
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`product/${id}`);

      setProductsList((prev) => prev.filter((p) => p._id !== id));
      toast.success(t("adminProductDeleted"));
      router.refresh();
    } catch (error: unknown) {
      const backendMessage = getApiErrorDetails(error).response?.data?.message;
      if (backendMessage && locale === "en") {
        toast.error(String(backendMessage));
      } else {
        toast.error(t("adminDeleteFailed"));
      }
    } finally {
      setDeletingId(null);
      setConfirmProduct(null);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const list = [...(productsList || [])].filter((p: Product) => {
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
        (a: Product, b: Product) =>
          Number(a.countInStock ?? 10) - Number(b.countInStock ?? 10),
      );
    }

    return list;
  }, [productsList, searchQuery, stockFilter, sortBy]);

  return (
    <div dir={direction} className="min-w-0">
      {/* ================================================================== */}
      {/* 1. CHIC & PREMIUM 3D PORTAL MODAL                                  */}
      {/* ================================================================== */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {confirmProduct && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                style={{ touchAction: "none" }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                dir={direction}
              >
                {/* ── Premium Glassmorphism Backdrop ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-[#071330]/20 backdrop-blur-xl dark:bg-[#060711]/60"
                  onClick={() => !deletingId && setConfirmProduct(null)}
                />

                {/* ── Sleek Modal Card ── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="relative z-10 w-full max-w-[340px] overflow-hidden rounded-[28px] border border-border/80 bg-surface p-6 shadow-[0_32px_64px_-16px_rgba(var(--shadow-rgb),0.25)]"
                >
                  {/* Subtle Elegant Icon */}
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger ring-4 ring-danger/5">
                    <Trash2 size={24} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-center text-lg font-extrabold tracking-tight text-primary">
                    {t("adminRemoveFromArchive")}
                  </h3>
                  <p className="mt-2 text-center text-[13px] font-medium leading-relaxed text-muted">
                    {t("adminRemoveProductWarning")}
                  </p>

                  {/* Chic Product Preview Snippet */}
                  <div className="my-6 flex items-center gap-3.5 rounded-2xl border border-border-subtle bg-surface-subtle p-3">
                    {getImageUrl(confirmProduct) ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface shadow-2xs">
                        <Image
                          src={getImageUrl(confirmProduct)!}
                          alt={confirmProduct.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-surface-muted text-[10px] font-bold text-muted">
                        N/A
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-primary">
                        {confirmProduct.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-muted">
                        <span>
                          #{confirmProduct._id.slice(-6).toUpperCase()}
                        </span>
                        <span>•</span>
                        <span className="text-primary">
                          {formatCurrency(confirmProduct.price, locale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Elegant Actions */}
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={!!deletingId}
                      onClick={() => setConfirmProduct(null)}
                      className="flex-1 cursor-pointer rounded-xl bg-surface-subtle py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-secondary transition-colors hover:bg-surface-muted hover:text-primary disabled:opacity-50"
                    >
                      {t("adminCancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(confirmProduct._id)}
                      disabled={!!deletingId}
                      className="relative flex-1 cursor-pointer overflow-hidden rounded-xl bg-danger py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-on-danger shadow-[0_8px_16px_-6px_rgba(var(--danger-rgb),0.4)] transition-all hover:bg-danger/90 active:scale-95 disabled:opacity-60"
                    >
                      <span className="relative z-10">
                        {deletingId
                          ? t("adminDeleting")
                          : t("adminConfirmDeletion")}
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ================================================================== */}
      {/* 2. INTERACTIVE STUDIO CONTROL BAR (SEARCH, FILTERS, SORT, VIEW)    */}
      {/* ================================================================== */}
      <div className="flex flex-col justify-between gap-3.5 border-b border-border-subtle bg-surface-subtle/75 p-4 sm:p-5 lg:flex-row lg:items-center">
        {/* Left: Instant Search + Stock Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-initial">
            <Search
              size={14}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("adminSearchNameCategorySku")}
              className="w-full rounded-xl border border-border/90 bg-surface py-2 ps-9 pe-3 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Stock Status Filter Tabs */}
          <div className="inline-flex rounded-xl border border-border/90 bg-surface p-1">
            {(
              [
                { id: "all", label: t("dashboardFilterAll") },
                { id: "healthy", label: t("adminStockHealthy") },
                { id: "low", label: t("adminStockLow") },
                { id: "out", label: t("adminStockZero") },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStockFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  stockFilter === tab.id
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
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
              className="pointer-events-none absolute start-3 text-muted"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label={t("sortProducts")}
              className="cursor-pointer appearance-none rounded-xl border border-border/90 bg-surface py-2 ps-8 pe-7 text-[11px] font-extrabold uppercase tracking-wider text-secondary focus:border-primary focus:outline-none"
            >
              <option value="default">{t("adminSortDefault")}</option>
              <option value="price-desc">{t("adminSortPriceHigh")}</option>
              <option value="price-asc">{t("adminSortPriceLow")}</option>
              <option value="stock-asc">{t("adminSortStockLow")}</option>
            </select>
          </div>

          {/* Table vs 3D Grid View Switcher */}
          <div className="inline-flex rounded-xl border border-border/90 bg-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === "table"
                  ? "bg-action text-on-action"
                  : "text-muted hover:text-primary"
              }`}
              title={t("adminTableView")}
            >
              <List size={13} />
              <span className="hidden sm:inline">{t("adminTable")}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === "grid"
                  ? "bg-action text-on-action"
                  : "text-muted hover:text-primary"
              }`}
              title={t("admin3dCards")}
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">{t("admin3dCards")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. EMPTY STATE                                                     */}
      {/* ================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-muted">
            <PackageX size={28} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-black uppercase tracking-wider text-primary">
            {t("adminNoProducts")}
          </p>
          <p className="mt-1 max-w-xs text-xs text-muted">
            {productsList.length === 0
              ? t("adminEmptyCatalogHint")
              : t("adminNoFilteredProducts")}
          </p>
          {productsList.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStockFilter("all");
                setSortBy("default");
              }}
              className="mt-4 cursor-pointer rounded-xl bg-action px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-action hover:bg-action-hover"
            >
              {t("adminResetFilters")}
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* ================================================================ */
        /* 4A. RESPONSIVE CATALOG: COMPACT CARDS BELOW DESKTOP-WIDE SCREENS  */
        /* ================================================================ */
        <>
          <div className="space-y-3 p-3 sm:p-4 xl:hidden">
            {filteredProducts.map((p: Product) => {
              const imgUrl = getImageUrl(p);
              const stock = Math.max(0, Number(p.countInStock ?? 10));
              const isOut = stock === 0;
              const isLow = stock > 0 && stock <= 5;
              const shortId = p._id.slice(-6).toUpperCase();

              return (
                <article
                  key={p._id}
                  className="min-w-0 rounded-2xl border border-border bg-surface p-3.5 shadow-[var(--shadow-soft)] transition-colors hover:border-border-strong"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {imgUrl ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
                        <Image
                          src={imgUrl}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted text-[10px] font-bold text-muted">
                        N/A
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 break-words text-sm font-bold leading-5 text-primary">
                        {p.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyId(p._id)}
                          title={t("adminCopyFullSku")}
                          className="inline-flex min-h-6 shrink-0 items-center gap-1 rounded-lg bg-surface-muted px-2 py-1 font-mono text-[10px] font-semibold text-secondary transition-colors hover:bg-action hover:text-on-action"
                        >
                          <span>#{shortId}</span>
                          {copiedId === p._id ? (
                            <Check
                              size={11}
                              className="shrink-0 text-success"
                            />
                          ) : (
                            <Copy size={11} className="shrink-0" />
                          )}
                        </button>
                        <span className="max-w-full truncate rounded-lg border border-border-subtle bg-surface-subtle px-2 py-1 text-[10px] font-semibold text-muted">
                          {p.category || t("dashboardGeneralCategory")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-surface-subtle p-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-muted">
                        {t("adminUnitPrice")}
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-primary">
                        {formatCurrency(p.price || 0, locale)}
                      </p>
                      {Number(p.discount) > 0 && (
                        <span className="mt-1 inline-flex rounded-md bg-success-soft px-1.5 py-0.5 text-[9px] font-bold text-success">
                          -{p.discount}%
                        </span>
                      )}
                    </div>
                    <div className="min-w-0" dir={direction}>
                      <p className="text-[10px] font-medium text-muted">
                        {t("adminStockTelemetry")}
                      </p>
                      <span
                        className={`mt-1 inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${isOut ? "border-danger-border bg-danger-soft text-danger" : isLow ? "border-warning-border bg-warning-soft text-warning" : "border-success-border bg-success-soft text-success"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOut ? "bg-danger" : isLow ? "bg-warning" : "bg-success"}`}
                        />
                        {isOut
                          ? t("adminZeroUnits")
                          : isLow
                            ? t("adminLowStockCount").replace(
                                "{count}",
                                String(stock),
                              )
                            : t("adminInStockCount").replace(
                                "{count}",
                                String(stock),
                              )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/dashboard/products/edit/${p._id}`)
                      }
                      title={t("adminEditProduct")}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-action px-3 py-2 text-xs font-bold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <Pencil
                        size={15}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">{t("adminEditProduct")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmProduct(p)}
                      title={t("adminDeleteProduct")}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl border border-danger-border bg-danger-soft px-3 py-2 text-xs font-bold text-danger transition-colors hover:bg-danger hover:text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <Trash2
                        size={15}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {t("adminDeleteProduct")}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Full data table is reserved for wider viewports. */}
          <div className="hidden w-full min-w-0 overflow-x-auto overscroll-x-contain xl:block">
            <table className="w-full min-w-[900px] border-collapse text-start">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-subtle/60 text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                  <th className="py-3.5 px-5">{t("adminGarmentSku")}</th>
                  <th className="hidden py-3.5 px-4 sm:table-cell">
                    {t("adminCategory")}
                  </th>
                  <th className="py-3.5 px-4">{t("adminUnitPrice")}</th>
                  <th className="hidden py-3.5 px-4 md:table-cell">
                    {t("adminStockTelemetry")}
                  </th>
                  <th className="min-w-[230px] whitespace-nowrap px-5 py-3.5 text-end">
                    {t("adminActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface text-xs">
                {filteredProducts.map((p: Product) => {
                  const imgUrl = getImageUrl(p);
                  const stock = Math.max(0, Number(p.countInStock ?? 10));
                  const isOut = stock === 0;
                  const isLow = stock > 0 && stock <= 5;
                  const shortId = p._id.slice(-6).toUpperCase();

                  return (
                    <tr
                      key={p._id}
                      className="group transition-colors duration-150 hover:bg-surface-subtle/90"
                    >
                      {/* 1. Product Info & Thumbnail */}
                      <td className="py-3.5 px-5 align-middle">
                        <div className="flex items-center gap-3.5">
                          {imgUrl ? (
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-surface-muted shadow-2xs">
                              <Image
                                src={imgUrl}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-muted text-[10px] font-black uppercase text-muted">
                              N/A
                            </div>
                          )}

                          <div className="min-w-0 max-w-[175px] sm:max-w-[260px]">
                            <p
                              title={p.name}
                              className="truncate text-xs font-extrabold text-primary transition-colors group-hover:text-primary sm:text-sm"
                            >
                              {p.name}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyId(p._id)}
                                title={t("adminCopyFullSku")}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted transition-colors hover:bg-action hover:text-on-action"
                              >
                                <span>#{shortId}</span>
                                {copiedId === p._id ? (
                                  <Check
                                    size={10}
                                    className="shrink-0 text-success"
                                  />
                                ) : (
                                  <Copy size={10} className="shrink-0" />
                                )}
                              </button>

                              {(p.section || p.style) && (
                                <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted">
                                  · {p.section || p.style}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Category */}
                      <td className="hidden py-3.5 px-4 align-middle sm:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface-subtle px-3 py-1 text-[10px] font-black uppercase tracking-wider text-secondary">
                          <Tag size={11} className="text-muted" />
                          {p.category || t("dashboardGeneralCategory")}
                        </span>
                      </td>

                      {/* 3. Price */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-black text-primary sm:text-sm">
                            {formatCurrency(p.price || 0, locale)}
                          </span>
                          {Number(p.discount) > 0 && (
                            <span className="mt-0.5 inline-block w-fit rounded bg-success-soft px-1.5 py-0.2 text-[9px] font-black uppercase text-success">
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
                                      ? "bg-surface-hover"
                                      : isOut
                                        ? "bg-danger"
                                        : isLow
                                          ? "bg-warning"
                                          : "bg-success"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {isOut ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-danger-border bg-danger-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-danger">
                              {t("adminZeroUnits")}
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-warning-border bg-warning-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-warning">
                              <Flame size={10} />
                              {t("adminLowStockCount").replace(
                                "{count}",
                                String(stock),
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-success">
                              <CheckCircle2 size={10} />
                              {t("adminInStockCount").replace(
                                "{count}",
                                String(stock),
                              )}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Actions */}
                      <td className="min-w-[230px] whitespace-nowrap px-5 py-3.5 text-end align-middle">
                        <div className="flex flex-nowrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/dashboard/products/edit/${p._id}`)
                            }
                            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-action px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-on-action shadow-2xs transition-all hover:-translate-y-0.5 hover:bg-action-hover active:scale-[0.98]"
                            title={t("adminEditProduct")}
                            aria-label={t("adminEditProduct")}
                          >
                            <Pencil
                              size={13}
                              className="shrink-0 text-on-action"
                              aria-hidden="true"
                            />
                            <span className="hidden lg:inline">
                              {t("adminEditProduct")}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmProduct(p)}
                            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-danger-border bg-danger-soft px-3 py-2 text-[10px] font-black uppercase tracking-wider text-danger transition-all hover:-translate-y-0.5 hover:border-danger-border hover:bg-danger hover:text-on-danger active:scale-[0.98]"
                            title={t("adminDeleteProduct")}
                            aria-label={t("adminDeleteProduct")}
                          >
                            <Trash2
                              size={13}
                              className="shrink-0 text-danger"
                              aria-hidden="true"
                            />
                            <span className="hidden lg:inline">
                              {t("adminDeleteProduct")}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* ================================================================ */
        /* 4B. SHOWROOM CARD GRID VIEW                                      */
        /* ================================================================ */
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p: Product) => {
            const imgUrl = getImageUrl(p);
            const stock = Math.max(0, Number(p.countInStock ?? 10));
            const isOut = stock === 0;
            const isLow = stock > 0 && stock <= 5;

            return (
              <div
                key={p._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface-subtle p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:shadow-[0_24px_48px_-12px_rgba(var(--shadow-rgb),0.12)]"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-surface">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 260px"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase text-subtle">
                      {t("adminNoImage")}
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-surface/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-primary shadow-2xs backdrop-blur-md">
                      {p.category || t("dashboardGeneralCategory")}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider shadow-2xs backdrop-blur-md ${
                        isOut
                          ? "bg-danger text-on-danger"
                          : isLow
                            ? "bg-warning text-on-warning"
                            : "bg-action/85 text-on-action"
                      }`}
                    >
                      {isOut
                        ? t("adminZeroStock")
                        : `${stock} ${t("adminUnits")}`}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="mt-3.5 space-y-2 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      title={p.name}
                      className="truncate text-sm font-black text-primary"
                    >
                      {p.name}
                    </h4>
                    <span className="font-mono text-sm font-black text-primary">
                      {formatCurrency(p.price || 0, locale)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>SKU #{p._id.slice(-6).toUpperCase()}</span>
                    <span>
                      {p.section || p.style || t("adminArchiveLabel")}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 flex gap-2 border-t border-border/70 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/products/edit/${p._id}`)
                    }
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-action py-2.5 text-[10px] font-black uppercase tracking-wider text-on-action transition-all hover:bg-action-hover"
                  >
                    <Pencil size={12} />
                    <span>{t("adminEditSku")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmProduct(p)}
                    className="flex cursor-pointer items-center justify-center rounded-xl border border-danger-border bg-danger-soft px-3 py-2.5 text-danger transition-all hover:bg-danger hover:text-on-danger"
                    title={t("adminDeleteSku")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
