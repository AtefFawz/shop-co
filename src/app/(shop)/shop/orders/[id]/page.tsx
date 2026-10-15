"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  XCircle,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Crown,
  Clock,
  Truck,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
  Printer,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

import OrderHeader from "@/components/orders/OrderHeader";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";
import OrderItems from "@/components/orders/OrderItems";
import ShippingInformation from "@/components/orders/ShippingInformation";
import OrderDetailsSkeleton from "@/components/orders/OrderDetailsSkeleton";

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  _id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: string;
  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
  orderItems: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    product?: {
      _id?: string;
      name?: string;
      category?: string;
    };
  }[];
  shippingAddress: {
    address: string;
    city: string;
    phone: string;
  };
};

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Admin & Status Mutation States
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 1. Detect if current user is ADMIN / MANAGER
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Check localStorage first for instant detection
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          const raw = localStorage.getItem(key);
          if (
            raw &&
            (raw.includes('"ADMIN"') ||
              raw.includes('"admin"') ||
              raw.includes('"MANAGER"'))
          ) {
            setIsAdmin(true);
            return;
          }
        }
      } catch {
        // ignore storage errors
      }

      // Fallback: verify profile from API
      try {
        const res = await api.get("/users/me");
        const userObj =
          res.data?.data?.user || res.data?.user || res.data?.data;
        const role = (userObj?.role || "").toUpperCase();
        if (role === "ADMIN" || role === "MANAGER" || role === "MANGER") {
          setIsAdmin(true);
        }
      } catch {
        // Not admin or endpoint differs
      }
    };

    checkAdminRole();
  }, []);

  // 2. Fetch Order Data
  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!orderId) return;
      try {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        const res = await api.get(`/order/${orderId}`);
        const fetchedOrder = res.data?.data?.order || res.data?.order;
        setOrder(fetchedOrder);
        setError("");

        if (fetchedOrder?._id) {
          document.title = `Order #${fetchedOrder._id
            .slice(-6)
            .toUpperCase()} · Dossier | SHOP.CO™`;
        }
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load order telemetry",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // 3. Admin Live Status Update Handler
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || updatingStatus || newStatus === order.status) return;

    const previousStatus = order.status;
    // Optimistic UI update
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setUpdatingStatus(true);

    try {
      await api.patch(`/order/${orderId}`, { status: newStatus });
      toast.success(
        `Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}`,
      );
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
      setOrder((prev) => (prev ? { ...prev, status: previousStatus } : prev));
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 4. Admin Safe Delete Order Handler
  const handleDeleteOrder = async () => {
    if (!order || deleting) return;
    try {
      setDeleting(true);
      await api.delete(`/order/${orderId}`);
      toast.success(
        `Order #${orderId.slice(-6).toUpperCase()} permanently deleted`,
      );
      router.push("/dashboard/orders");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete order:", err);
      toast.error(err.response?.data?.message || "Failed to delete order");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <main className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#F4F3F4] px-5 py-12 text-[#111111]">
        <div className="w-full max-w-md rounded-[2.2rem] border border-white/90 bg-white p-8 text-center shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5">
            <XCircle size={30} />
          </div>

          <span className="mt-5 inline-block rounded-full bg-neutral-100 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
            ARCHIVE LOOKUP FAILED
          </span>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#111111]">
            Order Not Found
          </h2>

          <p className="mt-2 text-xs font-medium leading-relaxed text-neutral-500">
            {error ||
              "We couldn't locate this order manifest. It may have been removed or the ID is invalid."}
          </p>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 cursor-pointer rounded-2xl border border-neutral-200 bg-white py-3.5 text-xs font-black uppercase tracking-widest text-neutral-800 transition-all hover:border-black"
            >
              Go Back
            </button>
            <Link
              href="/shop"
              className="flex flex-1 items-center justify-center rounded-2xl bg-[#111111] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-neutral-800"
            >
              Visit Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-10">
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS & PRINT STYLES                                   */}
      {/* ================================================================== */}
      <style>{`
        @keyframes orderDossierUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .dossier-anim-1 { animation: orderDossierUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both; }
        .dossier-anim-2 { animation: orderDossierUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.09s both; }
        .dossier-anim-3 { animation: orderDossierUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
        .dossier-anim-4 { animation: orderDossierUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.21s both; }

        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-6">
        {/* ================================================================ */}
        {/* 1. TOP NAVIGATION & QUICK ACTIONS BAR                            */}
        {/* ================================================================ */}
        <div className="no-print dossier-anim-1 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/90 bg-white/90 p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-700 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Print Official Invoice Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200/90 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-neutral-700 transition-all hover:border-black hover:text-[#111111]"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Invoice</span>
            </button>

            {/* Sync Telemetry Button */}
            <button
              type="button"
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-xs transition-all hover:bg-neutral-800 disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin text-emerald-400" : ""}
              />
              <span>{refreshing ? "Syncing..." : "Sync Status"}</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. EXCLUSIVE ADMIN LIVE DISPATCH COMMAND CONSOLE                 */}
        {/* ================================================================ */}
        {isAdmin && (
          <div className="no-print dossier-anim-1 relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-r from-[#141418] via-[#111111] to-[#18181E] p-5 text-white shadow-[0_22px_50px_-12px_rgba(0,0,0,0.35)] sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-400 ring-1 ring-white/15">
                  <Crown size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
                      ADMIN COMMAND MODE ACTIVE
                    </span>
                    {updatingStatus && (
                      <Loader2
                        size={12}
                        className="animate-spin text-emerald-400"
                      />
                    )}
                  </div>
                  <h3 className="mt-0.5 text-sm font-black uppercase tracking-wide text-white sm:text-base">
                    Instant Order Status Override
                  </h3>
                  <p className="mt-0.5 text-xs text-white/55">
                    Click any fulfillment stage below to update this order in
                    real time.
                  </p>
                </div>
              </div>

              {/* Direct Status Switcher Buttons + Delete */}
              <div className="flex flex-wrap items-center gap-2">
                {ALL_STATUSES.map((st) => {
                  const isCurrent = order.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(st)}
                      className={`cursor-pointer rounded-2xl px-3.5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                        isCurrent
                          ? st === "Cancelled"
                            ? "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] ring-2 ring-white/40"
                            : "bg-white text-[#111111] shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                          : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {isCurrent ? `✓ ${st}` : st}
                    </button>
                  );
                })}

                <span className="mx-1 hidden h-6 w-px bg-white/15 sm:inline-block" />

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-400 transition-all hover:bg-rose-600 hover:text-white"
                  >
                    <Trash2 size={13} />
                    <span>Purge</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-500/40 bg-rose-950/60 p-1">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDeleteOrder}
                      className="cursor-pointer rounded-xl bg-rose-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-rose-500"
                    >
                      {deleting ? "Deleting..." : "Confirm Purge"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="cursor-pointer rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. ORDER HEADER BANNER                                           */}
        {/* ================================================================ */}
        <div className="dossier-anim-2">
          <OrderHeader
            order={order}
            isAdmin={isAdmin}
            updatingStatus={updatingStatus}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* ================================================================ */}
        {/* 4. 3D TELEMETRY STATUS TRACKER                                   */}
        {/* ================================================================ */}
        <div className="dossier-anim-3 overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-5 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-2 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-[#111111]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  LOGISTICS PIPELINE
                </span>
              </div>
              <h2 className="mt-1 text-lg font-black uppercase tracking-tight text-[#111111] sm:text-xl">
                Order Fulfillment Telemetry
              </h2>
            </div>

            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F3F4] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-600">
                <ShieldCheck size={13} className="text-emerald-600" />
                Admin Interactive Pipeline: Click any node to switch status
              </span>
            ) : (
              <span className="text-xs font-semibold text-neutral-400">
                Live courier &amp; warehouse synchronization
              </span>
            )}
          </div>

          <OrderStatusTracker
            status={order.status}
            createdAt={order.createdAt}
            isAdmin={isAdmin}
            updating={updatingStatus}
            onSelectStatus={handleStatusChange}
          />
        </div>

        {/* ================================================================ */}
        {/* 5. MANIFEST ITEMS (LEFT) + SHIPPING DOSSIER (RIGHT)              */}
        {/* ================================================================ */}
        <div className="dossier-anim-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
          <OrderItems items={order.orderItems} totalPrice={order.totalPrice} />

          <ShippingInformation
            shippingAddress={order.shippingAddress}
            customer={order.user}
            paymentMethod={order.paymentMethod}
            status={order.status}
          />
        </div>
      </div>
    </section>
  );
}
