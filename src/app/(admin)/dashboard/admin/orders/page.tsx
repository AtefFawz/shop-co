"use client";
import { Package, RefreshCw } from "lucide-react";
import useData from "@/hooks/getData";
import { MobileOrders } from "@/components/features/admin/orders/MobileOrder";
import { DeskTopOrder } from "@/components/features/admin/orders/DesktopOrder";

export default function AdminOrdersPage() {
  const { loading, data, page, totalPages, goToPage, refetch } =
    useData("/order/all");

  const orders =
    (data as unknown as { data?: { orders?: any[] } })?.data?.orders ?? [];
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 px-3 sm:px-6 pt-6">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-400 inline-block" />
              Admin Panel
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-gray-900">
              All Orders
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {data?.pagination?.total ?? 0} order
              {data?.pagination?.total !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-black transition-all shadow-sm shrink-0 disabled:opacity-60"
          >
            <RefreshCw
              size={13}
              className={loading ? "animate-spin text-black" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 px-3 sm:px-6">
            {[...Array(data?.results)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* ── Empty state ── */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center mx-3 sm:mx-6">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Package size={24} className="text-gray-300" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-300">
                  No orders found
                </p>
              </div>
            ) : (
              <>
                <DeskTopOrder
                  orders={orders}
                  goToPage={goToPage}
                  totalPages={totalPages}
                  page={page}
                />
                <MobileOrders
                  orders={orders}
                  goToPage={goToPage}
                  page={page}
                  totalPages={totalPages}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
