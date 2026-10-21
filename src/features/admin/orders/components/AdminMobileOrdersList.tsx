"use client";

import React, { useState } from "react";
import { Copy, Check, ChevronDown, Calendar, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import OrderStatusUpdater from "@/features/admin/orders/components/OrderStatusUpdater";
import { DesktopOrderProps } from "@/features/admin/orders/components/AdminDesktopOrdersTable";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const getItemImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/80x80/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

const AdminMobileOrdersList = ({
  orders = [],
  page = 1,
  totalPages = 1,
  onOrderDeleted,
  goToPage,
}: DesktopOrderProps) => {
  const { t, locale, direction } = useLocale();
  const currencyFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-EG",
    { style: "currency", currency: "EGP", maximumFractionDigits: 0 },
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`${t("orderIdCopied")}: #${id.slice(-6).toUpperCase()}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div dir={direction} className="space-y-4 md:hidden">
      {orders.length > 0 && (
        <div className="space-y-3.5">
          {orders.map((order: any) => {
            const shortId = (order._id || "").slice(-6).toUpperCase();
            const isExpanded = expandedId === order._id;
            const itemsList: any[] = order.orderItems || [];
            const initials = (order.user?.fullName || t("ordersGuestClient"))
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_10px_28px_-10px_rgba(var(--shadow-rgb),0.07)] transition-all duration-300"
              >
                {/* Card Top: Customer & Total Price */}
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action font-mono text-xs font-black text-on-action">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black leading-tight text-primary">
                        {order.user?.fullName || t("ordersGuestClient")}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
                        {order.user?.email || t("ordersNoEmail")}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-end">
                    <p className="font-mono text-lg font-black leading-none text-primary">
                      {currencyFormatter.format(Number(order.totalPrice || 0))}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-muted">
                      <Calendar size={10} />
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            locale === "ar" ? "ar-EG" : "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : t("ordersRecent")}
                    </p>
                  </div>
                </div>

                <div className="mx-4 h-px bg-surface-muted" />

                {/* Card Middle: ID, Item Thumbnails & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopyId(order._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-2.5 py-1 font-mono text-[10px] font-black text-primary"
                    >
                      <span>#{shortId}</span>
                      {copiedId === order._id ? (
                        <Check size={10} className="text-success" />
                      ) : (
                        <Copy size={10} className="text-muted" />
                      )}
                    </button>

                    <div className="flex gap-1">
                      {itemsList.slice(0, 3).map((item: any, idx: number) => (
                        <img
                          key={idx}
                          src={getItemImageUrl(item.image)}
                          alt=""
                          className="h-8 w-8 rounded-lg border-2 border-surface bg-surface-muted object-cover shadow-2xs"
                        />
                      ))}
                      {itemsList.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-surface bg-action font-mono text-[9px] font-black text-on-action">
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
                <div className="border-t border-border-subtle bg-surface-subtle/70 px-4 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === order._id ? null : order._id,
                      )
                    }
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-widest text-secondary"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <ShoppingBag size={11} />
                      {isExpanded
                        ? t("ordersHideManifest")
                        : `${t("ordersInspectManifest")} (${itemsList.length} ${t(itemsList.length === 1 ? "ordersUnitSingular" : "ordersUnitPlural")})`}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 border-t border-border/60 pt-2.5 pb-1">
                      {itemsList.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 rounded-xl bg-surface p-2 shadow-2xs"
                        >
                          <img
                            src={getItemImageUrl(item.image)}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-extrabold text-primary">
                              {item.product?.name ||
                                item.name ||
                                t("adminProductDetails")}
                            </p>
                            <p className="font-mono text-[10px] font-bold text-muted">
                              {t("qty")}: {item.quantity || item.qty || 1}
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
      <div className="rounded-2xl border border-surface bg-surface p-3 shadow-xs">
        <ClientPagination page={page} totalPages={totalPages} goToPage={goToPage} />
      </div>
    </div>
  );
};

export { AdminMobileOrdersList };
