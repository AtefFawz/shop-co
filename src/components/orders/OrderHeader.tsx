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

export default function OrderHeader({
  order,
  isAdmin = false,
  updatingStatus = false,
  onStatusChange,
}: OrderHeaderProps) {
  const [copied, setCopied] = useState(false);

  const shortId = (order._id || "").slice(-6).toUpperCase();
  const totalUnits = (order.orderItems || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

  const handleCopyId = () => {
    navigator.clipboard?.writeText(order._id);
    setCopied(true);
    toast.success(`Order ID #${shortId} copied to clipboard`);
    setTimeout(() => setCopied(false), 1800);
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-6 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] sm:p-8">
      {/* Giant Background Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 select-none font-mono text-[130px] font-black leading-none tracking-tighter text-black/[0.025]"
      >
        #{shortId}
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left: Order Identifier & Timestamp */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
              <Package size={11} />
              OFFICIAL MANIFEST
            </span>

            {totalUnits > 0 && (
              <span className="rounded-full border border-neutral-200 bg-[#F8F8F8] px-3 py-1 font-mono text-[10px] font-extrabold text-neutral-600">
                {totalUnits} {totalUnits === 1 ? "Garment" : "Garments"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-[#111111] sm:text-3xl">
              Order #{shortId}
            </h1>

            <button
              type="button"
              onClick={handleCopyId}
              title="Copy full Order ID"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200/90 bg-[#F8F8F8] px-3 py-1.5 font-mono text-[10px] font-bold text-neutral-600 transition-all hover:border-black hover:bg-[#111111] hover:text-white active:scale-95"
            >
              <span className="max-w-[120px] truncate sm:max-w-none">
                {order._id}
              </span>
              {copied ? (
                <Check size={12} className="shrink-0 text-emerald-400" />
              ) : (
                <Copy size={12} className="shrink-0 opacity-60" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-400">
            <span className="inline-flex items-center gap-1.5 text-neutral-600">
              <CalendarDays size={14} className="text-[#111111]" />
              Placed on {formattedDate}
            </span>

            {typeof order.totalPrice === "number" && (
              <>
                <span>•</span>
                <span className="font-mono text-xs font-black text-[#111111]">
                  Total: {order.totalPrice.toLocaleString()} EGP
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
                aria-label="Change order status"
                className="cursor-pointer appearance-none rounded-2xl border-2 border-[#111111] bg-[#111111] py-3 pl-4 pr-10 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg transition-all hover:bg-neutral-800 focus:outline-none disabled:opacity-60"
              >
                <option value="Pending">Status: Pending</option>
                <option value="Shipped">Status: Shipped</option>
                <option value="Delivered">Status: Delivered</option>
                <option value="Cancelled">Status: Cancelled</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 text-white">
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
      bg: "border-amber-500/30 bg-amber-500/10 text-amber-800",
      dot: "bg-amber-500",
      icon: Clock,
      sub: "Preparing Dispatch",
    },
    Shipped: {
      bg: "border-sky-500/30 bg-sky-500/10 text-sky-800",
      dot: "bg-sky-500",
      icon: Truck,
      sub: "In Courier Transit",
    },
    Delivered: {
      bg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
      sub: "Fulfilled & Signed",
    },
    Cancelled: {
      bg: "border-rose-500/30 bg-rose-500/10 text-rose-700",
      dot: "bg-rose-500",
      icon: XCircle,
      sub: "Order Voided",
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

      <div className="text-left">
        <span className="block text-xs font-black uppercase tracking-wider leading-none">
          {status}
        </span>
        <span className="mt-0.5 block text-[9px] font-bold opacity-75">
          {active.sub}
        </span>
      </div>
    </div>
  );
}
