import { Users } from "lucide-react";
import OrderStatusUpdater from "../OrderStatusUpdater";
import { DesktopOrderProps } from "./DesktopOrder";

import { Pagination } from "../../../common/Pagination.client";

const MobileOrders = ({
  orders = [],
  page = 1,
  totalPages = 1,
  goToPage,
}: DesktopOrderProps) => {
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
      {/* Pagination Section */}
      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
};

export { MobileOrders };
