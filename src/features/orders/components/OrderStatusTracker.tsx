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
import { useLocale } from "@/shared/i18n/LocaleProvider";

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
  const { t, locale, direction } = useLocale();
  // Calculate Estimated Delivery Window (Created Date + 4 Days)
  const estDelivery = React.useMemo(() => {
    const base = createdAt ? new Date(createdAt) : new Date();
    const target = new Date(base.getTime() + 4 * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [createdAt, locale]);

  if (status === "Cancelled") {
    return (
      <div dir={direction} className="flex flex-col justify-between gap-4 rounded-3xl border border-danger-border bg-danger-soft p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-danger text-on-danger shadow-[0_10px_24px_-6px_rgba(var(--danger-rgb),0.5)]">
            <XCircle size={24} />
          </div>

          <div>
            <span className="inline-block rounded-full bg-danger-soft px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-danger">
              {t("dispatchHalted")}
            </span>
            <p className="mt-1 text-base font-black uppercase tracking-tight text-danger">
              {t("orderCancelledTitle")}
            </p>
            <p className="mt-0.5 text-xs font-medium text-danger/90">
              {t("cancelledOrderDescription")}
            </p>
          </div>
        </div>

        {isAdmin && onSelectStatus && (
          <button
            type="button"
            disabled={updating}
            onClick={() => onSelectStatus("Pending")}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-action px-4 py-3 text-xs font-black uppercase tracking-widest text-on-action shadow-md transition-all hover:bg-action-hover disabled:opacity-50"
          >
            <RotateCcw size={14} />
            <span>{t("restorePending")}</span>
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
      code: "01",
      label: t("orderStageConfirmed"),
      desc: t("orderStagePackageInspection"),
      icon: Package,
    },
    {
      key: "Shipped",
      code: "02",
      label: t("orderStageShipped"),
      desc: t("orderStageCourierTransit"),
      icon: Truck,
    },
    {
      key: "Delivered",
      code: "03",
      label: t("orderStageDelivered"),
      desc:
        status === "Delivered"
          ? t("orderStageDeliveredDescription")
          : `${t("orderStageArrival")}: ${estDelivery}`,
      icon: CheckCircle2,
    },
  ];

  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.key === status),
  );
  const progressPercentage = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div dir={direction} className="space-y-6">
      {/* Desktop & Mobile 3D Pipeline */}
      <div className="relative pt-2">
        {/* Background Rail (Desktop) */}
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-1.5 rounded-full bg-surface-hover/80 md:block" />

        {/* Active Laser Progress Line (Desktop) */}
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-1.5 overflow-hidden rounded-full md:block">
          <div
            style={{ width: `${progressPercentage}%` }}
            className={`absolute inset-y-0 rounded-full bg-action transition-all duration-700 ease-out ${direction === "rtl" ? "right-0" : "left-0"}`}
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
                    ? "border-border bg-surface-subtle shadow-[0_14px_32px_-12px_rgba(var(--shadow-rgb),0.12)]"
                    : completed
                      ? "border-border/90 bg-surface hover:border-border-strong"
                      : "border-border/50 bg-surface-subtle/50 opacity-65 hover:opacity-100"
                }`}
              >
                {/* 3D Node Pedestal */}
                <div className="relative shrink-0">
                  {isCurrent && (
                    <span className="absolute -inset-1.5 animate-ping rounded-2xl bg-action/15" />
                  )}
                  <div
                    className={`relative flex h-13 w-13 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      completed
                        ? "border-border bg-action text-on-action shadow-[0_10px_24px_-6px_rgba(var(--shadow-rgb),0.4)]"
                        : "border-border bg-surface text-muted group-hover:border-border-strong"
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
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                      {step.code}
                    </span>

                    {isCurrent && (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-[8px] font-black tracking-wider text-success">
                        {t("statusActive")}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm font-black uppercase tracking-tight ${
                      completed ? "text-primary" : "text-muted"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-xs font-medium leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Estimated Delivery Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface-subtle px-4 py-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-secondary">
          <Clock size={14} className="text-primary" />
          <span>
            {status === "Delivered"
              ? t("completedCycle")
              : `${t("estimatedDeliveryWindow")}: ${estDelivery}`}
          </span>
        </div>

        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary">
          {t("progress")} · {Math.round(((currentIndex + 1) / steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
}
