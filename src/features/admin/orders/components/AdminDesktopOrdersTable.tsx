"use client";
import { resolveImageUrl } from "@/lib/imageUrl";
import { getInitials } from "@/lib/initials";
import { createCurrencyFormatter } from "@/lib/formatCurrency";

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
import OrderStatusUpdater from "@/features/admin/orders/components/OrderStatusUpdater";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import type { AdminOrdersListProps } from "@/features/admin/orders/types";
import { AdminOrderRecord } from "@/types/domain";

export const AdminDesktopOrdersTable = ({
  orders,
  page,
  totalPages,
  goToPage,
  total,
  onOrderDeleted,
}: AdminOrdersListProps) => {
  const { t, locale, direction } = useLocale();
  const currencyFormatter = createCurrencyFormatter(locale, 0);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`${t("orderIdCopied")}: #${id.slice(-6).toUpperCase()}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (total <= 0) return null;

  return (
    <div dir={direction} className="hidden md:block">
      <div className="w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-subtle/70 text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                <th className="py-4 px-5">{t("adminOrderTimestamp")}</th>
                <th className="py-4 px-4">{t("adminCustomer")}</th>
                <th className="py-4 px-4">{t("adminManifestItems")}</th>
                <th className="py-4 px-4">{t("adminTotalValue")}</th>
                <th className="py-4 px-4">{t("adminFulfillmentStatus")}</th>
                <th className="py-4 px-5 text-end">{t("ordersInspect")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle text-xs">
              {orders.map((order) => {
                const shortId = (order._id || "").slice(-6).toUpperCase();
                const isExpanded = expandedOrderId === order._id;
                const itemsList: AdminOrderRecord["orderItems"] =
                  order.orderItems || [];
                const totalUnits = itemsList.reduce(
                  (acc, it) => acc + (Number(it.quantity || it.qty) || 1),
                  0,
                );
                const initials = getInitials(
                  order.user?.fullName || t("ordersGuestClient"),
                );

                return (
                  <React.Fragment key={order._id}>
                    <tr
                      className={`group transition-colors duration-200 ${
                        isExpanded
                          ? "bg-surface-subtle"
                          : "hover:bg-surface-subtle/80"
                      }`}
                    >
                      {/* 1. Order ID & Date */}
                      <td className="py-4 px-5 align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyId(order._id)}
                            title={t("ordersCopyOrderId")}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/80 bg-surface-muted px-2.5 py-1 font-mono text-xs font-black text-primary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
                          >
                            <span>#{shortId}</span>
                            {copiedId === order._id ? (
                              <Check size={11} className="text-success" />
                            ) : (
                              <Copy size={11} className="opacity-60" />
                            )}
                          </button>

                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
                            <Calendar size={10} />
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString(
                                  locale === "ar" ? "ar-EG" : "en-GB",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  },
                                )
                              : t("ordersRecent")}
                          </span>
                        </div>
                      </td>

                      {/* 2. Customer Profile */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action font-mono text-xs font-black text-on-action shadow-2xs">
                            {initials}
                          </div>
                          <div className="min-w-0 max-w-[190px] xl:max-w-[240px]">
                            <p className="truncate text-xs font-extrabold text-primary sm:text-sm">
                              {order.user?.fullName || t("ordersGuestClient")}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-muted">
                              <Mail size={10} className="shrink-0" />
                              <span className="truncate">
                                {order.user?.email || t("ordersNoEmail")}
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
                            title={t("ordersInspectItems")}
                          >
                            {itemsList
                              .slice(0, 4)
                              .map(
                                (
                                  item: AdminOrderRecord["orderItems"][number],
                                  idx: number,
                                ) => (
                                  <img
                                    key={idx}
                                    src={resolveImageUrl(
                                      item.image,
                                      "https://placehold.co/80x80/111111/FFFFFF?text=SKU",
                                    )}
                                    alt={
                                      item.product?.name ||
                                      t("adminProductDetails")
                                    }
                                    title={item.product?.name}
                                    className="h-9 w-9 rounded-xl border-2 border-surface bg-surface-muted object-cover shadow-xs transition-transform duration-300 hover:z-10 hover:scale-115"
                                  />
                                ),
                              )}
                            {itemsList.length > 4 && (
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-surface bg-action font-mono text-[10px] font-black text-on-action shadow-xs">
                                +{itemsList.length - 4}
                              </div>
                            )}
                          </div>

                          <span className="hidden rounded-lg bg-surface-muted px-2 py-1 font-mono text-[10px] font-bold text-secondary xl:inline-block">
                            {totalUnits}{" "}
                            {t(
                              totalUnits === 1
                                ? "ordersUnitSingular"
                                : "ordersUnitPlural",
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 4. Total Price */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-mono text-sm font-black text-primary sm:text-base">
                          {currencyFormatter.format(
                            Number(order.totalPrice || 0),
                          )}
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
                      <td className="py-4 px-5 text-end align-middle">
                        <button
                          type="button"
                          onClick={() => toggleExpand(order._id)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                            isExpanded
                              ? "border-border-strong bg-action text-on-action shadow-xs"
                              : "border-border bg-surface text-secondary hover:border-border-strong hover:text-primary"
                          }`}
                        >
                          <span>
                            {isExpanded
                              ? t("ordersHideManifest")
                              : t("ordersInspectManifest")}
                          </span>
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
                      <tr className="bg-surface-subtle/90">
                        <td colSpan={6} className="px-6 py-5">
                          <div className="rounded-2xl border border-border/80 bg-surface p-4 shadow-inner sm:p-5">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                              <div className="flex items-center gap-2">
                                <ShoppingBag
                                  size={14}
                                  className="text-primary"
                                />
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                                  {t("ordersInspectManifest")} · #{order._id}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-muted">
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
                              {itemsList.map(
                                (
                                  item: AdminOrderRecord["orderItems"][number],
                                  idx: number,
                                ) => {
                                  const qty =
                                    Number(item.quantity || item.qty) || 1;
                                  const unitPrice =
                                    Number(item.price || item.product?.price) ||
                                    0;
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-subtle p-2.5"
                                    >
                                      <img
                                        src={resolveImageUrl(
                                          item.image,
                                          "https://placehold.co/80x80/111111/FFFFFF?text=SKU",
                                        )}
                                        alt={
                                          item.product?.name ||
                                          t("userDetailProduct")
                                        }
                                        className="h-12 w-12 shrink-0 rounded-lg border border-surface bg-surface object-cover shadow-2xs"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-extrabold text-primary">
                                          {item.product?.name ||
                                            item.name ||
                                            t("userDetailCatalogGarment")}
                                        </p>
                                        <div className="mt-1 flex items-center justify-between font-mono text-[10px] font-bold text-muted">
                                          <span>
                                            {t("qty")}: {qty}
                                          </span>
                                          {unitPrice > 0 && (
                                            <span className="text-primary">
                                              {currencyFormatter.format(
                                                unitPrice,
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle bg-surface-subtle/70 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            <Layers size={14} className="text-primary" />
            <span>
              {t("ordersPaginationSummary")
                .replace("{page}", String(page))
                .replace("{pages}", String(totalPages))
                .replace("{total}", String(total))}
            </span>
          </div>

          <ClientPagination
            page={page}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </div>
      </div>
    </div>
  );
};
