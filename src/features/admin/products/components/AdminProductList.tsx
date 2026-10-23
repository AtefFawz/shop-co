// @/features/admin/products/components/ProductList.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Pencil, Trash2, AlertTriangle, Tag, PackageX, Search, LayoutGrid, List, ArrowUpDown, Copy, Check, Flame, CheckCircle2 } from "lucide-react";
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
      {/* 1. 3D INTERACTIVE DELETE CONFIRMATION MODAL                        */}
      {/* ================================================================== */}
      {confirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-action/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_30px_80px_rgba(var(--shadow-rgb),0.35)] animate-in zoom-in-95 duration-200">
            {/* Top Warning Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft text-danger ring-8 ring-danger/10">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-center text-lg font-black uppercase tracking-tight text-primary">
              {t("adminRemoveFromArchive")}
            </h3>
            <p className="mt-1 text-center text-xs leading-relaxed text-muted">
              {t("adminRemoveProductWarning")}
            </p>

            {/* Preview Card of the Product Being Deleted */}
            <div className="my-5 flex items-center gap-3.5 rounded-2xl border border-border/80 bg-surface-subtle p-3">
              {getImageUrl(confirmProduct) ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                  <Image
                    src={getImageUrl(confirmProduct)!}
                    alt={confirmProduct.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-[10px] font-black text-muted">
                  N/A
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-primary">
                  {confirmProduct.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] font-bold text-muted">
                  <span>SKU #{confirmProduct._id.slice(-6).toUpperCase()}</span>
                  <span>•</span>
                  <span className="text-primary">
                    {formatCurrency(confirmProduct.price, locale)}
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
                className="flex-1 cursor-pointer rounded-2xl border border-border bg-surface py-3 text-xs font-black uppercase tracking-wider text-secondary transition-colors hover:border-border-strong hover:bg-surface-subtle disabled:opacity-50"
              >
                {t("adminCancel")}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmProduct._id)}
                disabled={!!deletingId}
                className="flex-1 cursor-pointer rounded-2xl bg-danger py-3 text-xs font-black uppercase tracking-wider text-on-danger shadow-[0_10px_24px_-6px_rgba(var(--danger-rgb),0.5)] transition-all hover:bg-danger disabled:opacity-60"
              >
                {deletingId ? t("adminDeleting") : t("adminConfirmDeletion")}
              </button>
            </div>
          </div>
        </div>
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
        /* 4A. EDITORIAL TABLE VIEW                                         */
        /* ================================================================ */
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-subtle/60 text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                <th className="py-3.5 px-5">{t("adminGarmentSku")}</th>
                <th className="hidden py-3.5 px-4 sm:table-cell">{t("adminCategory")}</th>
                <th className="py-3.5 px-4">{t("adminUnitPrice")}</th>
                <th className="hidden py-3.5 px-4 md:table-cell">
                  {t("adminStockTelemetry")}
                </th>
                <th className="py-3.5 px-5 text-end">{t("adminActions")}</th>
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
                                <Check size={10} className="text-success" />
                              ) : (
                                <Copy size={10} />
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
                            {t("adminLowStockCount").replace("{count}", String(stock))}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-success">
                            <CheckCircle2 size={10} />
                            {t("adminInStockCount").replace("{count}", String(stock))}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-3.5 px-5 text-end align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/products/edit/${p._id}`)
                          }
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-action px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-on-action shadow-2xs transition-all hover:-translate-y-0.5 hover:bg-action-hover active:scale-95"
                          title={t("adminEditProduct")}
                        >
                          <Pencil size={13} />
                          <span className="hidden lg:inline">{t("adminEditProduct")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmProduct(p)}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-danger-border bg-danger-soft px-3 py-2 text-[10px] font-black uppercase tracking-wider text-danger transition-all hover:-translate-y-0.5 hover:border-danger-border hover:bg-danger hover:text-on-danger active:scale-95"
                          title={t("adminDeleteProduct")}
                        >
                          <Trash2 size={13} />
                          <span className="hidden lg:inline">{t("adminDeleteProduct")}</span>
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
          {filteredProducts.map((p: Product) => {
            const imgUrl = getImageUrl(p);
            const stock = Math.max(0, Number(p.countInStock ?? 10));
            const isOut = stock === 0;
            const isLow = stock > 0 && stock <= 5;

            return (
              <div
                key={p._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface-subtle p-3.5 transition-all duration-500 hover:-translate-y-1.5 hover:border-border hover:bg-surface hover:shadow-[0_24px_48px_-12px_rgba(var(--shadow-rgb),0.12)]"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-surface">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 260px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
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
                      {isOut ? t("adminZeroStock") : `${stock} ${t("adminUnits")}`}
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
                    <span>{p.section || p.style || t("adminArchiveLabel")}</span>
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
