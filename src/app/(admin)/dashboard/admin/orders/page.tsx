"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import OrderStatusUpdater from "@/components/features/admin/OrderStatusUpdater";
import { Package, Users, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/all");
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // const IMG = process.env.NEXT_PUBLIC_API_URL + "/uploads/";

  // ── Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]   py-8">
        <div className="max-w-6xl mx-auto space-y-3">
          {[...Array(orders.length)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]  ">
      <div className="max-w-6xl mx-auto space-y-6 ">
        {/* ── Header ── */}
        <div className="flex items-end justify-between gap-4 px-3 sm:px-6">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-400 inline-block" />
              Admin Panel
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-gray-900">
              All Orders
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={fetchAllOrders}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-black transition-all shadow-sm flex-shrink-0"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ── Empty state ── */}
        {orders.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Package size={24} className="text-gray-300" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-300">
              No orders found
            </p>
          </div>
        )}

        {/* ══════════════════════════════════
            DESKTOP TABLE  (≥ md)
        ══════════════════════════════════ */}
        {orders.length > 0 && (
          <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Order ID", "Customer", "Items", "Total", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-black text-sm text-gray-900 leading-tight">
                        {order.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                        {order.user?.email}
                      </p>
                    </td>

                    {/* Product images */}
                    <td className="px-5 py-4">
                      <div className="flex -space-x-2">
                        {order.orderItems
                          .slice(0, 4)
                          .map((item: any, idx: number) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.product?.name}
                              title={item.product?.name}
                              className="w-9 h-9 rounded-xl border-2 border-white object-cover shadow-sm"
                            />
                          ))}
                        {order.orderItems.length > 4 && (
                          <div className="w-9 h-9 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shadow-sm">
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <span className="font-black text-base text-gray-900">
                        ${order.totalPrice.toLocaleString()}
                      </span>
                    </td>

                    {/* Status updater */}
                    <td className="px-5 py-4">
                      <OrderStatusUpdater
                        orderId={order._id}
                        currentStatus={order.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════════════════════════════
            MOBILE CARDS  (< md)
        ══════════════════════════════════ */}
        {orders.length > 0 && (
          <div className="md:hidden space-y-3 ">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Card top */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                  {/* Left — customer info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users size={15} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-gray-900 leading-tight truncate">
                        {order.user?.fullName}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {order.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Right — price + date */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-gray-900 leading-none">
                      ${order.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-4 h-px bg-gray-100" />

                {/* Card bottom — images + status */}
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  {/* Order ID + product images */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg shrink-0">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <div className="flex -space-x-1.5">
                      {order.orderItems
                        .slice(0, 3)
                        .map((item: any, idx: number) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt=""
                            className="w-7 h-7 rounded-lg border-2 border-white object-cover shadow-sm"
                          />
                        ))}
                      {order.orderItems.length > 3 && (
                        <div className="w-7 h-7 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status updater */}
                  <div className="shrink-0">
                    <OrderStatusUpdater
                      orderId={order._id}
                      currentStatus={order.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
