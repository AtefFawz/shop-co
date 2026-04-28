"use client";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);

  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await api.patch(`/order/${orderId}`, { status: newStatus });

      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus} 🎉`);
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update status");

      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyles = (s: string) => {
    switch (s) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="relative inline-block w-full min-w-24">
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`appearance-none w-full px-2 lg:px-3 py-1.5 border text-[10px] md:text-xs font-bold rounded-full cursor-pointer focus:outline-none transition-all
          ${getBadgeStyles(status)} 
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}`}
      >
        <option value="Pending">⏳ Pending</option>
        <option value="Shipped">🚚 Shipped</option>
        <option value="Delivered">✅ Delivered</option>
        <option value="Cancelled">❌ Cancelled</option>
      </select>

      {!loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="lg:w-3 lg:h-3 w-2 h-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
