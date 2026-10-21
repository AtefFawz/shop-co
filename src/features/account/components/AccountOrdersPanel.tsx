"use client";

import React, { useState, useMemo } from "react";
import { Package } from "lucide-react";
import { EmptyAccountState } from "@/features/account/components/EmptyAccountState";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import OrderCard from "@/features/orders/components/CustomerOrderCard";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";
import useData from "@/hooks/getData";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function AccountOrdersPanel() {
  const { t } = useLocale();
  const { data, loading, page, totalPages, goToPage, refetch } =
    useData("profile/my-orders");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const orders: any[] = data?.data?.orders ?? [];
  const total = data?.pagination?.total ?? orders.length;

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter(
      (o) => (o.status || "").toLowerCase() === statusFilter,
    );
  }, [orders, statusFilter]);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-surface" />
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-44 w-full animate-pulse rounded-3xl bg-surface p-6"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <AccountSectionHeader icon={Package} title={t("uiYourOrders")} count={total} />

        {/* Live Status Filter Pills */}
        {orders.length > 0 && (
          <div className="inline-flex flex-wrap rounded-xl border border-border/80 bg-surface p-1 shadow-2xs">
            {[
              { id: "all", label: t("uiFilterAll") },
              { id: "pending", label: t("uiFilterPending") },
              { id: "shipped", label: t("uiFilterShipped") },
              { id: "delivered", label: t("uiFilterDelivered") },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  statusFilter === tab.id
                    ? "bg-action text-on-action shadow-2xs"
                    : "text-muted hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <OrderCard
              key={order._id}
              order={order}
              onReviewSuccess={refetch}
            />
          ))}
        </div>
      ) : (
        <EmptyAccountState
          message={
            orders.length === 0
              ? t("uiNoOrdersYet")
              : t("uiNoStatusOrders").replace(
                  "{status}",
                  statusFilter === "pending"
                    ? t("uiFilterPending")
                    : statusFilter === "shipped"
                      ? t("uiFilterShipped")
                      : t("uiFilterDelivered"),
                )
          }
        />
      )}

      {totalPages > 1 && (
        <div className="pt-2">
          <ClientPagination page={page} totalPages={totalPages} goToPage={goToPage} />
        </div>
      )}
    </div>
  );
}
