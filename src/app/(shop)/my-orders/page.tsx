"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import OrderCard from "@/components/features/OrderCard/OrderCard";
import Link from "next/link";
import { Package, ShoppingBag, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("order/");
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] px-3 sm:px-6 pt-28 sm:pt-32 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          {/* Card skeletons */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen  bg-[#F8F8F8] px-3 sm:px-6 pt-28 sm:pt-32 pb-16">
      <div className="container mx-auto px-4 ">
        <div className="max-w-7xl space-y-6 sm:space-y-8 ">
          {/* ── Page Header ── */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
                <span className="w-4 h-px bg-gray-400 inline-block" />
                Account
              </p>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-gray-900">
                My Orders
              </h1>
              {orders.length > 0 && (
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              )}
            </div>

            {orders.length > 0 && (
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-black transition-all shadow-sm shrink-0"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>

          {/* ── Empty State ── */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 sm:p-20 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Package size={28} className="text-gray-300" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest text-gray-400 mb-1">
                  No orders yet
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  You haven't placed any orders yet.
                </p>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-2 bg-black text-white px-7 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-px active:translate-y-0"
              >
                <ShoppingBag size={14} />
                Start Shopping
              </Link>
            </div>
          ) : (
            /* ── Orders List ── */
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onReviewSuccess={fetchOrders}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
