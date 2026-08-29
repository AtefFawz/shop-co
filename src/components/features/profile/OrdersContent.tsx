"use client";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { Package } from "lucide-react";
import OrderCard from "../OrderCard/OrderCard";

import { Pagination } from "@/components/common/Pagination.client";
import useData from "@/hooks/getData";

export default function OrdersContent({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  const { data, page, totalPages, goToPage, refetch } =
    useData("profile/my-orders");

  const total = data?.pagination?.total;
  const order = data?.data?.orders ?? [];
  return (
    <div className="space-y-6 ">
      <SectionHeader icon={Package} title="Your Orders" count={total} />
      {order?.length > 0 ? (
        order.map((order: any) => (
          <OrderCard key={order._id} order={order} onReviewSuccess={refetch} />
        ))
      ) : (
        <EmptyState message="No orders yet." />
      )}
      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
}
