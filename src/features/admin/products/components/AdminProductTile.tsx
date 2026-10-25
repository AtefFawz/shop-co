"use client";

import Image from "next/image";
import { Check, Copy, Pencil, Tag, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";

type AdminProductTileProps = {
  product: Product;
  variant?: "row" | "grid";
  copied?: boolean;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
};

const CLOUDINARY_BASE = "https://res.cloudinary.com/dudit0nty/image/upload/";

function getProductImage(product: Product): string | null {
  const value = product.photo || product.images?.[0];
  if (typeof value !== "string" || !value.trim()) return null;
  return value.startsWith("http") ? value : `${CLOUDINARY_BASE}${value}`;
}

export default function AdminProductTile({
  product,
  variant = "grid",
  copied = false,
  deleting = false,
  onEdit,
  onDelete,
  onCopy,
}: AdminProductTileProps) {
  const { t, locale } = useLocale();
  const image = getProductImage(product);
  const stock = Math.max(0, Number(product.countInStock ?? 0));
  const stockState = stock === 0 ? "out" : stock <= 5 ? "low" : "available";
  const sku = product._id.slice(-6).toUpperCase();
  const isRow = variant === "row";

  const stockClass =
    stockState === "out"
      ? "border-danger-border bg-danger-soft text-danger"
      : stockState === "low"
        ? "border-warning-border bg-warning-soft text-warning"
        : "border-success-border bg-success-soft text-success";

  const stockLabel =
    stockState === "out"
      ? t("adminZeroStock")
      : stockState === "low"
        ? t("adminLowStockCount").replace("{count}", String(stock))
        : t("adminInStockCount").replace("{count}", String(stock));

  return (
    <article
      className={`group min-w-0 overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-[var(--shadow-soft)] ${isRow ? "flex gap-3 p-3 sm:gap-4 sm:p-4" : "flex h-full flex-col p-3"}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle ${isRow ? "h-24 w-20 sm:h-28 sm:w-24" : "aspect-[4/3] w-full"}`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name || t("adminNoImage")}
            fill
            sizes={isRow ? "96px" : "(max-width: 640px) 46vw, 280px"}
            className="object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-muted">
            {t("adminNoImage")}
          </div>
        )}
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${isRow ? "justify-between" : "pt-3"}`}
      >
        <div className="min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3
              title={product.name}
              className="line-clamp-2 min-w-0 text-sm font-bold leading-5 text-primary"
            >
              {product.name || t("products")}
            </h3>
            <span className="shrink-0 text-end font-mono text-xs font-bold text-primary sm:text-sm">
              {formatCurrency(product.price || 0, locale)}
            </span>
          </div>

          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-muted">
            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-surface-muted px-2 py-1 font-mono font-semibold">
              <span>#{sku}</span>
            </span>
            <button
              type="button"
              onClick={onCopy}
              title={t("adminCopyFullSku")}
              aria-label={`${t("adminCopyFullSku")} ${sku}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-brand-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copied ? (
                <Check size={13} className="shrink-0 text-success" />
              ) : (
                <Copy size={13} className="shrink-0" />
              )}
            </button>
            <span className="inline-flex min-w-0 items-center gap-1 truncate rounded-full border border-border-subtle bg-surface-subtle px-2 py-1 text-secondary">
              <Tag size={10} className="shrink-0" />
              <span className="truncate">
                {product.category || t("dashboardGeneralCategory")}
              </span>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${stockClass}`}
            >
              {stockLabel}
            </span>
            {Number(product.discount) > 0 && (
              <span className="inline-flex min-h-6 items-center rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-accent">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>

        <div
          className={`mt-3 flex items-center gap-2 border-t border-border-subtle pt-3 ${isRow ? "sm:mt-2" : ""}`}
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${t("adminEditProduct")}: ${product.name}`}
            className="inline-flex min-h-10 min-w-10 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-action px-3 text-xs font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Pencil size={14} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{t("adminEditSku")}</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            aria-label={`${t("adminDeleteProduct")}: ${product.name}`}
            title={t("adminDeleteSku")}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-danger-border bg-danger-soft text-danger transition-colors hover:bg-danger hover:text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} className="shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
