"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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

type StatusKey = "Pending" | "Shipped" | "Delivered" | "Cancelled";

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
      "border-amber-500/30 bg-amber-500/10 text-amber-800 hover:border-amber-500/60 hover:bg-amber-500/15",
    dotClass: "bg-amber-500",
    iconBgClass: "bg-amber-500/15 text-amber-700",
  },
  Shipped: {
    label: "Shipped",
    sub: "In transit with courier",
    step: 2,
    icon: Truck,
    pillClass:
      "border-sky-500/30 bg-sky-500/10 text-sky-800 hover:border-sky-500/60 hover:bg-sky-500/15",
    dotClass: "bg-sky-500",
    iconBgClass: "bg-sky-500/15 text-sky-700",
  },
  Delivered: {
    label: "Delivered",
    sub: "Fulfilled & received by client",
    step: 3,
    icon: CheckCircle2,
    pillClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 hover:border-emerald-500/60 hover:bg-emerald-500/15",
    dotClass: "bg-emerald-500",
    iconBgClass: "bg-emerald-500/15 text-emerald-700",
  },
  Cancelled: {
    label: "Cancelled",
    sub: "Order voided",
    step: 0,
    icon: XCircle,
    pillClass:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:border-rose-500/60 hover:bg-rose-500/15",
    dotClass: "bg-rose-500",
    iconBgClass: "bg-rose-500/15 text-rose-600",
  },
};

const normalizeStatus = (raw?: string): StatusKey => {
  const s = (raw || "").trim().toLowerCase();
  if (s === "shipped") return "Shipped";
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
      toast.success(`Order #${orderId.slice(-6).toUpperCase()} → ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
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
      toast.success(`Order #${orderId.slice(-6).toUpperCase()} deleted`);
      if (deletedOrderSuccess) deletedOrderSuccess();
      router.refresh();
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete order");
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
        } ${isOpen ? "ring-2 ring-black/15 scale-[1.02]" : ""}`}
      >
        <span className="flex items-center gap-2">
          {loading ? (
            <Loader2 size={13} className="animate-spin text-current" />
          ) : (
            <span className="relative flex h-2 w-2 shrink-0">
              {status === "Pending" || status === "Shipped" ? (
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
          <span>{activeConfig.label}</span>
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
                      : "bg-black/15"
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
            className="w-[248px] overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-2 text-[#111111] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.28)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#111111]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Dispatch Control
                </span>
              </div>
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-neutral-600">
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
                    className={`group flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl px-2.5 py-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-[#111111] text-white shadow-xs"
                        : "hover:bg-[#F4F3F4] text-[#111111]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? "bg-white/15 text-white"
                            : item.iconBgClass
                        }`}
                      >
                        <Icon size={14} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                          {item.label}
                        </p>
                        <p
                          className={`mt-1 truncate text-[9px] font-medium ${
                            isSelected ? "text-white/65" : "text-neutral-400"
                          }`}
                        >
                          {item.sub}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Danger Zone: 2-Step Safe Delete */}
            <div className="mt-1 border-t border-neutral-100 pt-1.5">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2 text-left text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                      <Trash2 size={14} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-black uppercase tracking-wider leading-none">
                        Delete Order
                      </span>
                      <span className="mt-1 block text-[9px] font-medium text-rose-400">
                        Remove permanently
                      </span>
                    </span>
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-2 animate-in fade-in duration-150">
                  <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-wider text-rose-700">
                    <AlertTriangle size={12} />
                    <span>Confirm Permanent Delete?</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 cursor-pointer rounded-xl border border-neutral-200 bg-white py-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteOrder}
                      className="flex-1 cursor-pointer rounded-xl bg-rose-600 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs hover:bg-rose-700"
                    >
                      Yes, Delete
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
