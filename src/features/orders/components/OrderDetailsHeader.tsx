"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Package,
  Copy,
  Check,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  status: OrderStatus;
  createdAt: string;
  totalPrice?: number;
  orderItems?: any[];
};

interface OrderHeaderProps {
  order: Order;
  isAdmin?: boolean;
  updatingStatus?: boolean;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export default function OrderDetailsHeader({
  order,
  isAdmin = false,
  updatingStatus = false,
  onStatusChange,
}: OrderHeaderProps) {
  const { t, locale, direction } = useLocale();
  const [copied, setCopied] = useState(false);

  const shortId = (order._id || "").slice(-6).toUpperCase();
  const totalUnits = (order.orderItems || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

  const handleCopyId = async () => {
    if (!navigator.clipboard?.writeText) {
      toast.error(t("copyFailed"));
      return;
    }
    try {
      await navigator.clipboard.writeText(order._id);
      setCopied(true);
      toast.success(t("orderFullIdCopied"));
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : t("recent");

  return (
    <div dir={direction} className="relative overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-8">
      {/* Giant Background Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-6 -top-8 select-none font-mono text-[130px] font-black leading-none tracking-tighter text-primary/[0.025]"
      >
        #{shortId}
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left: Order Identifier & Timestamp */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
              <Package size={11} />
              {t("orderOfficialManifest")}
            </span>

            {totalUnits > 0 && (
              <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 font-mono text-[10px] font-extrabold text-secondary">
                {totalUnits} {totalUnits === 1 ? t("orderGarment") : t("orderGarments")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl">
              {t("orderOrderNumber")} #{shortId}
            </h1>

            <button
              type="button"
              onClick={handleCopyId}
              title={t("copyFullOrderId")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/90 bg-surface-subtle px-3 py-1.5 font-mono text-[10px] font-bold text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action active:scale-95"
            >
              <span className="max-w-[120px] truncate sm:max-w-none">
                {order._id}
              </span>
              {copied ? (
                <Check size={12} className="shrink-0 text-success" />
              ) : (
                <Copy size={12} className="shrink-0 opacity-60" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted">
            <span className="inline-flex items-center gap-1.5 text-secondary">
              <CalendarDays size={14} className="text-primary" />
              {t("orderPlacedOn")} {formattedDate}
            </span>

            {typeof order.totalPrice === "number" && (
              <>
                <span>•</span>
                <span className="font-mono text-xs font-black text-primary">
                  {t("estimatedTotal")}: {formatCurrency(order.totalPrice, locale)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Status Badge (Or Interactive Dropdown for Admin) */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && onStatusChange ? (
            <div className="relative inline-flex items-center">
              <select
                value={order.status}
                disabled={updatingStatus}
                onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
                aria-label={t("orderStatusLabel")}
                className="cursor-pointer appearance-none rounded-2xl border-2 border-border bg-action py-3 ps-4 pe-10 text-xs font-black uppercase tracking-[0.16em] text-on-action shadow-lg transition-all hover:bg-action-hover focus:outline-none disabled:opacity-60"
              >
                <option value="Pending">{t("orderStatusPending")}</option>
                <option value="Shipped">{t("orderStatusShipped")}</option>
                <option value="Delivered">{t("orderStatusDelivered")}</option>
                <option value="Cancelled">{t("orderStatusCancelled")}</option>
              </select>
              <span className="pointer-events-none absolute end-3.5 text-on-action">
                {updatingStatus ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ChevronDown size={14} />
                )}
              </span>
            </div>
          ) : null}

          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useLocale();
  const config: Record<
    OrderStatus,
    {
      bg: string;
      dot: string;
      icon: React.ElementType;
      sub: string;
    }
  > = {
    Pending: {
      bg: "border-warning-border bg-warning-soft text-warning",
      dot: "bg-warning",
      icon: Clock,
      sub: t("orderStatusDescriptionPending"),
    },
    Shipped: {
      bg: "border-info-border bg-info-soft text-info",
      dot: "bg-info",
      icon: Truck,
      sub: t("orderStatusDescriptionShipped"),
    },
    Delivered: {
      bg: "border-success-border bg-success-soft text-success",
      dot: "bg-success",
      icon: CheckCircle2,
      sub: t("orderStatusDescriptionDelivered"),
    },
    Cancelled: {
      bg: "border-danger-border bg-danger-soft text-danger",
      dot: "bg-danger",
      icon: XCircle,
      sub: t("orderStatusDescriptionCancelled"),
    },
  };

  const active = config[status] || config.Pending;
  const Icon = active.icon;

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 shadow-2xs ${active.bg}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {(status === "Pending" || status === "Shipped") && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${active.dot}`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active.dot}`}
        />
      </span>

      <Icon size={16} className="shrink-0" />

      <div className="text-start">
        <span className="block text-xs font-black uppercase tracking-wider leading-none">
          {{ Pending: t("orderStatusPending"), Shipped: t("orderStatusShipped"), Delivered: t("orderStatusDelivered"), Cancelled: t("orderStatusCancelled") }[status]}
        </span>
        <span className="mt-0.5 block text-[9px] font-bold opacity-75">
          {active.sub}
        </span>
      </div>
    </div>
  );
}
