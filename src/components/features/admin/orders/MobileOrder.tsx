"use client";

import React, { useState } from "react";
import { Copy, Check, ChevronDown, Calendar, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import OrderStatusUpdater from "../OrderStatusUpdater";
import { DesktopOrderProps } from "./DesktopOrder";
import { Pagination } from "@/components/common/Pagination.client";

const getItemImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/80x80/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

const MobileOrders = ({
  orders = [],
  page = 1,
  totalPages = 1,
  onOrderDeleted,
  goToPage,
}: DesktopOrderProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`Order #${id.slice(-6).toUpperCase()} copied`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4 md:hidden">
      {orders.length > 0 && (
        <div className="space-y-3.5">
          {orders.map((order: any) => {
            const shortId = (order._id || "").slice(-6).toUpperCase();
            const isExpanded = expandedId === order._id;
            const itemsList: any[] = order.orderItems || [];
            const initials = (order.user?.fullName || "Guest")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-white/90 bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.07)] transition-all duration-300"
              >
                {/* Card Top: Customer & Total Price */}
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] font-mono text-xs font-black text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black leading-tight text-[#111111]">
                        {order.user?.fullName || "Guest Customer"}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-400">
                        {order.user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-lg font-black leading-none text-[#111111]">
                      ${Number(order.totalPrice || 0).toLocaleString()}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                      <Calendar size={10} />
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Recent"}
                    </p>
                  </div>
                </div>

                <div className="mx-4 h-px bg-neutral-100" />

                {/* Card Middle: ID, Item Thumbnails & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopyId(order._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 font-mono text-[10px] font-black text-[#111111]"
                    >
                      <span>#{shortId}</span>
                      {copiedId === order._id ? (
                        <Check size={10} className="text-emerald-500" />
                      ) : (
                        <Copy size={10} className="text-neutral-400" />
                      )}
                    </button>

                    <div className="flex -space-x-2">
                      {itemsList.slice(0, 3).map((item: any, idx: number) => (
                        <img
                          key={idx}
                          src={getItemImageUrl(item.image)}
                          alt=""
                          className="h-8 w-8 rounded-lg border-2 border-white bg-neutral-100 object-cover shadow-2xs"
                        />
                      ))}
                      {itemsList.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white bg-[#111111] font-mono text-[9px] font-black text-white">
                          +{itemsList.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <OrderStatusUpdater
                      orderId={order._id}
                      currentStatus={order.status}
                      deletedOrderSuccess={onOrderDeleted}
                    />
                  </div>
                </div>

                {/* Collapsible Mobile Manifest Toggle */}
                <div className="border-t border-neutral-100 bg-[#F8F8F8]/70 px-4 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === order._id ? null : order._id,
                      )
                    }
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-600"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <ShoppingBag size={11} />
                      {isExpanded
                        ? "Hide Order Manifest"
                        : `Inspect Manifest (${itemsList.length} items)`}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 border-t border-neutral-200/60 pt-2.5 pb-1">
                      {itemsList.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-2xs"
                        >
                          <img
                            src={getItemImageUrl(item.image)}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-extrabold text-[#111111]">
                              {item.product?.name ||
                                item.name ||
                                "Catalog Garment"}
                            </p>
                            <p className="font-mono text-[10px] font-bold text-neutral-400">
                              Qty: {item.quantity || item.qty || 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Pagination */}
      <div className="rounded-2xl border border-white bg-white p-3 shadow-xs">
        <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
      </div>
    </div>
  );
};

export { MobileOrders };
