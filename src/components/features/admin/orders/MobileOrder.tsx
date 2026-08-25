import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import OrderStatusUpdater from "../OrderStatusUpdater";
import { DesktopOrderProps } from "./DesktopOrder";

// دالة مساعدة لحساب الأرقام المعروضة لتكون الصفحة الحالية دائماً في المنتصف
const getVisiblePages = (current: number, total: number) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  // الصفحة الحالية في المنتصف تماماً
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const MobileOrders = ({
  orders = [],
  page = 1,
  totalPages = 1,
  goToPage,
}: DesktopOrderProps) => {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="md:hidden">
      {/* Orders List */}
      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Card top */}
              <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={15} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-gray-900 leading-tight truncate">
                      {order.user?.fullName || "Guest Customer"}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {order.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-gray-900 leading-none">
                    ${order.totalPrice?.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold mt-1">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mx-4 h-px bg-gray-100" />

              {/* Card bottom */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg shrink-0">
                    #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <div className="flex -space-x-1.5">
                    {order.orderItems
                      ?.slice(0, 3)
                      .map((item: any, idx: number) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt=""
                          className="w-7 h-7 rounded-lg border-2 border-white object-cover shadow-sm"
                        />
                      ))}
                    {order.orderItems?.length > 3 && (
                      <div className="w-7 h-7 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>

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

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-1.5 mt-5 py-3 px-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Prev */}
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center justify-center gap-1.5">
            {visiblePages.map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-6 text-center text-xs font-bold text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = page === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(Number(pageNum))}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
                    isCurrent
                      ? "bg-black text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export { MobileOrders };
