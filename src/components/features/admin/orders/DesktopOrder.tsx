"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  Calendar,
  Mail,
  ShoppingBag,
  MapPin,
  CreditCard,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import OrderStatusUpdater from "../OrderStatusUpdater";
import { Pagination } from "@/components/common/Pagination.client";

export type DesktopOrderProps = {
  orders: any[];
  page: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => void;
  onOrderDeleted?: () => void;
};

const getItemImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/80x80/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

export const DeskTopOrder = ({
  orders,
  page,
  totalPages,
  goToPage,
  total,
  onOrderDeleted,
}: DesktopOrderProps) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`Order #${id.slice(-6).toUpperCase()} copied`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (total <= 0) return null;

  return (
    <div className="hidden md:block">
      <div className="w-full overflow-hidden rounded-3xl border border-white/90 bg-white shadow-[0_14px_40px_-14px_rgba(0,0,0,0.07)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                <th className="py-4 px-5">Order / Timestamp</th>
                <th className="py-4 px-4">Customer Profile</th>
                <th className="py-4 px-4">Manifest (Items)</th>
                <th className="py-4 px-4">Total Value</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-5 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-xs">
              {orders.map((order) => {
                const shortId = (order._id || "").slice(-6).toUpperCase();
                const isExpanded = expandedOrderId === order._id;
                const itemsList: any[] = order.orderItems || [];
                const totalUnits = itemsList.reduce(
                  (acc, it) => acc + (Number(it.quantity || it.qty) || 1),
                  0,
                );
                const initials = (order.user?.fullName || "Guest")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <React.Fragment key={order._id}>
                    <tr
                      className={`group transition-colors duration-200 ${
                        isExpanded ? "bg-[#F8F8F8]" : "hover:bg-[#F8F8F8]/80"
                      }`}
                    >
                      {/* 1. Order ID & Date */}
                      <td className="py-4 px-5 align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyId(order._id)}
                            title="Click to copy full Order ID"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-black text-[#111111] transition-all hover:border-black hover:bg-[#111111] hover:text-white"
                          >
                            <span>#{shortId}</span>
                            {copiedId === order._id ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} className="opacity-60" />
                            )}
                          </button>

                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-400">
                            <Calendar size={10} />
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  },
                                )
                              : "Recent"}
                          </span>
                        </div>
                      </td>

                      {/* 2. Customer Profile */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] font-mono text-xs font-black text-white shadow-2xs">
                            {initials}
                          </div>
                          <div className="min-w-0 max-w-[190px] xl:max-w-[240px]">
                            <p className="truncate text-xs font-extrabold text-[#111111] sm:text-sm">
                              {order.user?.fullName || "Guest Client"}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-neutral-400">
                              <Mail size={10} className="shrink-0" />
                              <span className="truncate">
                                {order.user?.email || "No email provided"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Interactive 3D Item Stack */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => toggleExpand(order._id)}
                            className="flex cursor-pointer -space-x-2.5 transition-all duration-300 hover:space-x-1"
                            title="Click to inspect manifest items"
                          >
                            {itemsList
                              .slice(0, 4)
                              .map((item: any, idx: number) => (
                                <img
                                  key={idx}
                                  src={getItemImageUrl(item.image)}
                                  alt={item.product?.name || "Garment"}
                                  title={item.product?.name}
                                  className="h-9 w-9 rounded-xl border-2 border-white bg-neutral-100 object-cover shadow-xs transition-transform duration-300 hover:z-10 hover:scale-115"
                                />
                              ))}
                            {itemsList.length > 4 && (
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#111111] font-mono text-[10px] font-black text-white shadow-xs">
                                +{itemsList.length - 4}
                              </div>
                            )}
                          </div>

                          <span className="hidden rounded-lg bg-neutral-100 px-2 py-1 font-mono text-[10px] font-bold text-neutral-600 xl:inline-block">
                            {totalUnits} unit{totalUnits !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* 4. Total Price */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-mono text-sm font-black text-[#111111] sm:text-base">
                          ${Number(order.totalPrice || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* 5. Status Updater */}
                      <td className="py-4 px-4 align-middle">
                        <OrderStatusUpdater
                          orderId={order._id}
                          currentStatus={order.status}
                          deletedOrderSuccess={onOrderDeleted}
                        />
                      </td>

                      {/* 6. Expand Manifest Button */}
                      <td className="py-4 px-5 text-right align-middle">
                        <button
                          type="button"
                          onClick={() => toggleExpand(order._id)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                            isExpanded
                              ? "border-black bg-[#111111] text-white shadow-xs"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black"
                          }`}
                        >
                          <span>{isExpanded ? "Close" : "Inspect"}</span>
                          <ChevronDown
                            size={13}
                            className={`transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>

                    {/* ====================================================== */}
                    {/* EXPANDABLE 3D MANIFEST DRAWER ROW                      */}
                    {/* ====================================================== */}
                    {isExpanded && (
                      <tr className="bg-[#F8F8F8]/90">
                        <td colSpan={6} className="px-6 py-5">
                          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-inner sm:p-5">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                              <div className="flex items-center gap-2">
                                <ShoppingBag
                                  size={14}
                                  className="text-[#111111]"
                                />
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#111111]">
                                  Order Manifest · #{order._id}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-neutral-500">
                                {order.paymentMethod && (
                                  <span className="inline-flex items-center gap-1">
                                    <CreditCard size={12} />
                                    {order.paymentMethod}
                                  </span>
                                )}
                                {(order.shippingAddress?.city ||
                                  order.address) && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin size={12} />
                                    {order.shippingAddress?.city ||
                                      order.address}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Manifest Items Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {itemsList.map((item: any, idx: number) => {
                                const qty =
                                  Number(item.quantity || item.qty) || 1;
                                const unitPrice =
                                  Number(item.price || item.product?.price) ||
                                  0;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-[#F8F8F8] p-2.5"
                                  >
                                    <img
                                      src={getItemImageUrl(item.image)}
                                      alt={item.product?.name || "Item"}
                                      className="h-12 w-12 shrink-0 rounded-lg border border-white bg-white object-cover shadow-2xs"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs font-extrabold text-[#111111]">
                                        {item.product?.name ||
                                          item.name ||
                                          "Catalog Garment"}
                                      </p>
                                      <div className="mt-1 flex items-center justify-between font-mono text-[10px] font-bold text-neutral-500">
                                        <span>Qty: {qty}</span>
                                        {unitPrice > 0 && (
                                          <span className="text-[#111111]">
                                            ${unitPrice.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 bg-[#F8F8F8]/70 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <Layers size={14} className="text-[#111111]" />
            <span>
              Page <strong className="text-[#111111]">{page}</strong> of{" "}
              <strong className="text-[#111111]">{totalPages}</strong> ({total}{" "}
              total orders)
            </span>
          </div>

          <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
        </div>
      </div>
    </div>
  );
};
