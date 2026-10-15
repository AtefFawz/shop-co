"use client";

import React from "react";
import {
  Check,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface OrderStatusTrackerProps {
  status: OrderStatus;
  createdAt?: string;
  isAdmin?: boolean;
  updating?: boolean;
  onSelectStatus?: (newStatus: OrderStatus) => void;
}

export default function OrderStatusTracker({
  status,
  createdAt,
  isAdmin = false,
  updating = false,
  onSelectStatus,
}: OrderStatusTrackerProps) {
  // Calculate Estimated Delivery Window (Created Date + 4 Days)
  const estDelivery = React.useMemo(() => {
    const base = createdAt ? new Date(createdAt) : new Date();
    const target = new Date(base.getTime() + 4 * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [createdAt]);

  if (status === "Cancelled") {
    return (
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-rose-500/25 bg-rose-500/5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-[0_10px_24px_-6px_rgba(225,29,72,0.5)]">
            <XCircle size={24} />
          </div>

          <div>
            <span className="inline-block rounded-full bg-rose-500/15 px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-rose-700">
              DISPATCH HALTED
            </span>
            <p className="mt-1 text-base font-black uppercase tracking-tight text-rose-900">
              Order Cancelled
            </p>
            <p className="mt-0.5 text-xs font-medium text-rose-600/90">
              This order was voided and removed from the active fulfillment
              queue.
            </p>
          </div>
        </div>

        {isAdmin && onSelectStatus && (
          <button
            type="button"
            disabled={updating}
            onClick={() => onSelectStatus("Pending")}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-neutral-800 disabled:opacity-50"
          >
            <RotateCcw size={14} />
            <span>Restore to Pending</span>
          </button>
        )}
      </div>
    );
  }

  const steps: {
    key: OrderStatus;
    code: string;
    label: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    {
      key: "Pending",
      code: "STAGE // 01",
      label: "Order Confirmed & Queued",
      desc: "Quality inspection & luxury packaging at SHOP.CO Atelier",
      icon: Package,
    },
    {
      key: "Shipped",
      code: "STAGE // 02",
      label: "Dispatched With Courier",
      desc: "Handed over to express logistics partner for transit",
      icon: Truck,
    },
    {
      key: "Delivered",
      code: "STAGE // 03",
      label: "Delivered To Destination",
      desc:
        status === "Delivered"
          ? "Package signed and received by client"
          : `Estimated arrival by ${estDelivery}`,
      icon: CheckCircle2,
    },
  ];

  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.key === status),
  );
  const progressPercentage = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Desktop & Mobile 3D Pipeline */}
      <div className="relative pt-2">
        {/* Background Rail (Desktop) */}
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-1.5 rounded-full bg-neutral-200/80 md:block" />

        {/* Active Laser Progress Line (Desktop) */}
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-1.5 overflow-hidden rounded-full md:block">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="h-full rounded-full bg-[#111111] transition-all duration-700 ease-out"
          />
        </div>

        {/* 3 Stage Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const completed = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                onClick={() => {
                  if (isAdmin && onSelectStatus && !updating) {
                    onSelectStatus(step.key);
                  }
                }}
                className={`group relative flex items-start gap-4 rounded-3xl border p-4 transition-all duration-300 md:flex-col md:items-center md:p-5 md:text-center ${
                  isAdmin ? "cursor-pointer" : ""
                } ${
                  isCurrent
                    ? "border-[#111111] bg-[#F8F8F8] shadow-[0_14px_32px_-12px_rgba(0,0,0,0.12)]"
                    : completed
                      ? "border-neutral-200/90 bg-white hover:border-neutral-300"
                      : "border-neutral-200/50 bg-neutral-50/50 opacity-65 hover:opacity-100"
                }`}
              >
                {/* 3D Node Pedestal */}
                <div className="relative shrink-0">
                  {isCurrent && (
                    <span className="absolute -inset-1.5 animate-ping rounded-2xl bg-black/15" />
                  )}
                  <div
                    className={`relative flex h-13 w-13 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      completed
                        ? "border-[#111111] bg-[#111111] text-white shadow-[0_10px_24px_-6px_rgba(0,0,0,0.4)]"
                        : "border-neutral-200 bg-white text-neutral-400 group-hover:border-neutral-400"
                    }`}
                  >
                    {completed && index < currentIndex ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                </div>

                {/* Stage Metadata */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 md:justify-center">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      {step.code}
                    </span>

                    {isCurrent && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700">
                        Active
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm font-black uppercase tracking-tight ${
                      completed ? "text-[#111111]" : "text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-xs font-medium leading-relaxed text-neutral-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Estimated Delivery Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/70 bg-[#F8F8F8] px-4 py-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-neutral-600">
          <Clock size={14} className="text-[#111111]" />
          <span>
            {status === "Delivered"
              ? "Fulfillment cycle completed."
              : `Estimated Delivery Window: ${estDelivery}`}
          </span>
        </div>

        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#111111]">
          PROGRESS // {Math.round(((currentIndex + 1) / steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
}
