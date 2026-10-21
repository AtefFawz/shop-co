"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  Loader2,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
  deletedOrderSuccess?: () => void;
}

type StatusKey = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: StatusKey;
    sub: string;
    step: number;
    icon: React.ElementType;
    pillClass: string;
    dotClass: string;
    iconBgClass: string;
  }
> = {
  Pending: {
    label: "Pending",
    sub: "Awaiting warehouse dispatch",
    step: 1,
    icon: Clock,
    pillClass:
      "border-warning-border bg-warning-soft text-warning hover:border-warning-border hover:bg-warning-soft",
    dotClass: "bg-warning",
    iconBgClass: "bg-warning-soft text-warning",
  },
  Processing: {
    label: "Processing",
    sub: "The order is being prepared",
    step: 1,
    icon: Clock,
    pillClass:
      "border-warning-border bg-warning-soft text-warning hover:border-warning-border hover:bg-warning-soft",
    dotClass: "bg-warning",
    iconBgClass: "bg-warning-soft text-warning",
  },
  Shipped: {
    label: "Shipped",
    sub: "In transit with courier",
    step: 2,
    icon: Truck,
    pillClass:
      "border-info-border bg-info-soft text-info hover:border-info-border hover:bg-info-soft",
    dotClass: "bg-info",
    iconBgClass: "bg-info-soft text-info",
  },
  Delivered: {
    label: "Delivered",
    sub: "Fulfilled & received by client",
    step: 3,
    icon: CheckCircle2,
    pillClass:
      "border-success-border bg-success-soft text-success hover:border-success-border hover:bg-success-soft",
    dotClass: "bg-success",
    iconBgClass: "bg-success-soft text-success",
  },
  Cancelled: {
    label: "Cancelled",
    sub: "Order voided",
    step: 0,
    icon: XCircle,
    pillClass:
      "border-danger-border bg-danger-soft text-danger hover:border-danger-border hover:bg-danger-soft",
    dotClass: "bg-danger",
    iconBgClass: "bg-danger-soft text-danger",
  },
};

const normalizeStatus = (raw?: string): StatusKey => {
  const s = (raw || "").trim().toLowerCase();
  if (s === "processing" || s === "in progress") return "Processing";
  if (s === "shipped" || s === "in transit" || s === "out for delivery") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled" || s === "canceled") return "Cancelled";
  return "Pending";
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  deletedOrderSuccess,
}: Props) {
  const router = useRouter();
  const { t, direction } = useLocale();
  const getStatusLabel = (value: StatusKey) => {
    switch (value) {
      case "Pending": return t("statusPending");
      case "Processing": return t("statusProcessing");
      case "Shipped": return t("statusShipped");
      case "Delivered": return t("statusDelivered");
      case "Cancelled": return t("statusCancelled");
    }
  };
  const getStatusDescription = (value: StatusKey) => {
    switch (value) {
      case "Pending": return t("orderStatusDescriptionPending");
      case "Processing": return t("orderStatusDescriptionProcessing");
      case "Shipped": return t("orderStatusDescriptionShipped");
      case "Delivered": return t("orderStatusDescriptionDelivered");
      case "Cancelled": return t("orderStatusDescriptionCancelled");
    }
  };
  const [status, setStatus] = useState<StatusKey>(() =>
    normalizeStatus(currentStatus),
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    left: number;
    openUpwards: boolean;
  }>({ top: 0, left: 0, openUpwards: false });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStatus(normalizeStatus(currentStatus));
  }, [currentStatus]);

  // Calculate exact screen position for the 3D Portal Menu
  const updateMenuPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 248;
    const menuHeight = 310;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < menuHeight && rect.top > menuHeight;

    const left = Math.min(
      Math.max(12, rect.right - menuWidth),
      window.innerWidth - menuWidth - 12,
    );

    const top = openUpwards ? rect.top - 8 : rect.bottom + 8;

    setMenuCoords({ top, left, openUpwards });
  };

  const toggleMenu = () => {
    if (loading) return;
    if (!isOpen) {
      updateMenuPosition();
      setConfirmDelete(false);
    }
    setIsOpen((prev) => !prev);
  };

  // Close menu on outside click, scroll, or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
        setConfirmDelete(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setConfirmDelete(false);
      }
    };

    const handleScrollOrResize = () => {
      updateMenuPosition();
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Handle Status Update (PATCH)
  const handleStatusChange = async (newStatus: StatusKey) => {
    if (newStatus === status || loading) {
      setIsOpen(false);
      return;
    }

    const previousStatus = status;
    setStatus(newStatus);
    setIsOpen(false);
    setLoading(true);

    try {
      await api.patch(`/order/${orderId}`, { status: newStatus });
      toast.success(`${t("ordersUpdatedStatus")}: #${orderId.slice(-6).toUpperCase()} · ${getStatusLabel(newStatus)}`);
      router.refresh();
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || t("ordersUpdateStatusFailed"));
      setStatus(previousStatus);
    } finally {
      setLoading(false);
    }
  };

  // Handle Order Deletion (DELETE)
  const handleDeleteOrder = async () => {
    if (loading) return;
    setLoading(true);
    setIsOpen(false);

    try {
      await api.delete(`/order/${orderId}`);
      toast.success(`${t("ordersDeleted")}: #${orderId.slice(-6).toUpperCase()}`);
      if (deletedOrderSuccess) deletedOrderSuccess();
      router.refresh();
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || t("ordersDeleteFailed"));
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const activeConfig = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const ActiveIcon = activeConfig.icon;

  return (
    <>
      {/* ================================================================== */}
      {/* 1. INTERACTIVE 3D STATUS PILL TRIGGER                              */}
      {/* ================================================================== */}
      <button
        ref={triggerRef}
        type="button"
        disabled={loading}
        onClick={toggleMenu}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group relative inline-flex min-w-[138px] cursor-pointer items-center justify-between gap-2.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-2xs transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[148px] sm:px-3.5 sm:py-2 ${
          activeConfig.pillClass
        } ${isOpen ? "ring-2 ring-focus/15 scale-[1.02]" : ""}`}
      >
        <span className="flex items-center gap-2">
          {loading ? (
            <Loader2 size={13} className="animate-spin text-current" />
          ) : (
            <span className="relative flex h-2 w-2 shrink-0">
              {status === "Pending" || status === "Processing" || status === "Shipped" ? (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${activeConfig.dotClass}`}
                />
              ) : null}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${activeConfig.dotClass}`}
              />
            </span>
          )}

          <ActiveIcon size={12} className="shrink-0 opacity-80" />
          <span>{getStatusLabel(status)}</span>
        </span>

        {/* Right Chevron + Mini 3-Step Dots */}
        <span className="flex items-center gap-1.5">
          {activeConfig.step > 0 && (
            <span className="hidden items-center gap-0.5 sm:flex">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1 w-1 rounded-full transition-all ${
                    s <= activeConfig.step
                      ? activeConfig.dotClass
                      : "bg-action/15"
                  }`}
                />
              ))}
            </span>
          )}

          <ChevronDown
            size={12}
            className={`shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
            }`}
          />
        </span>
      </button>

      {/* ================================================================== */}
      {/* 2. 3D FLOATING PORTAL COMMAND MENU (NEVER CLIPPED BY TABLES)       */}
      {/* ================================================================== */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            dir={direction}
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuCoords.top,
              left: menuCoords.left,
              transform: menuCoords.openUpwards
                ? "translateY(-100%)"
                : "translateY(0)",
              zIndex: 9999,
            }}
            className="w-[248px] overflow-hidden rounded-3xl border border-border-subtle bg-surface/95 p-2 text-primary shadow-[0_28px_70px_-12px_rgba(var(--shadow-rgb),0.28)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                  {t("ordersDispatchControl")}
                </span>
              </div>
              <span className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[9px] font-bold text-secondary">
                #{orderId.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Status Options List */}
            <div className="my-1 space-y-1">
              {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((key) => {
                const item = STATUS_CONFIG[key];
                const Icon = item.icon;
                const isSelected = status === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleStatusChange(key)}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl px-2.5 py-2 text-start transition-all duration-200 ${
                      isSelected
                        ? "bg-action text-on-action shadow-xs"
                        : "hover:bg-surface-subtle text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? "bg-white/15 text-on-action"
                            : item.iconBgClass
                        }`}
                      >
                        <Icon size={14} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                          {getStatusLabel(key)}
                        </p>
                        <p
                          className={`mt-1 truncate text-[9px] font-medium ${
                            isSelected ? "text-on-action/65" : "text-muted"
                          }`}
                        >
                          {getStatusDescription(key)}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-on-success">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Danger Zone: 2-Step Safe Delete */}
            <div className="mt-1 border-t border-border-subtle pt-1.5">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2 text-start text-danger transition-colors hover:bg-danger-soft"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-danger-soft text-danger">
                      <Trash2 size={14} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-black uppercase tracking-wider leading-none">
                        {t("ordersDeleteAction")}
                      </span>
                      <span className="mt-1 block text-[9px] font-medium text-danger">
                        {t("ordersDeletePermanent")}
                      </span>
                    </span>
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl border border-danger-border bg-danger-soft p-2 animate-in fade-in duration-150">
                  <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-wider text-danger">
                    <AlertTriangle size={12} />
                    <span>{t("ordersConfirmDelete")}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 cursor-pointer rounded-xl border border-border bg-surface py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary hover:bg-surface-subtle"
                    >
                      {t("orderCancel")}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteOrder}
                      className="flex-1 cursor-pointer rounded-xl bg-danger py-1.5 text-[10px] font-black uppercase tracking-wider text-on-danger shadow-xs hover:bg-danger"
                    >
                      {t("ordersYesDelete")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
