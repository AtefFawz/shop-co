"use client";

import { CalendarDays, Package } from "lucide-react";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  status: OrderStatus;
  createdAt: string;
};

export default function OrderHeader({ order }: { order: Order }) {
  return (
    <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <Package size={15} />
            Order
          </div>

          <h1 className="mt-1.5 break-all text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
            #{order._id}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <CalendarDays size={14} />
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    Shipped: "bg-blue-50 text-blue-700 ring-blue-200",
    Delivered: "bg-green-50 text-green-700 ring-green-200",
    Cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${styles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {status}
    </span>
  );
}
