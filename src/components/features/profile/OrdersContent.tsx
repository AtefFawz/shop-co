"use client";

import React, { useState, useMemo } from "react";
import { Package } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import OrderCard from "../OrderCard/OrderCard";
import { Pagination } from "@/components/common/Pagination.client";
import useData from "@/hooks/getData";

export default function OrdersContent() {
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
        <div className="h-14 w-full animate-pulse rounded-2xl bg-white" />
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-44 w-full animate-pulse rounded-3xl bg-white p-6"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeader icon={Package} title="Your Orders" count={total} />

        {/* Live Status Filter Pills */}
        {orders.length > 0 && (
          <div className="inline-flex flex-wrap rounded-xl border border-neutral-200/80 bg-white p-1 shadow-2xs">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  statusFilter === tab.id
                    ? "bg-[#111111] text-white shadow-2xs"
                    : "text-neutral-500 hover:text-[#111111]"
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
        <EmptyState
          message={
            orders.length === 0
              ? "You haven't placed any orders yet."
              : `No ${statusFilter} orders found on this page.`
          }
        />
      )}

      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
        </div>
      )}
    </div>
  );
}
