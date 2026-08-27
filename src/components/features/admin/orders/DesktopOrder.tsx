import OrderStatusUpdater from "../OrderStatusUpdater";
import { Pagination } from "@/components/common/Pagination.client";
export type DesktopOrderProps = {
  orders: any[];
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
};
//  DESKTOP TABLE  (≥ md)
export const DeskTopOrder = ({
  orders,
  page,
  totalPages,
  goToPage,
}: DesktopOrderProps) => {
  return (
    <div>
      {orders.length > 0 && (
        <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Order ID", "Customer", "Items", "Total", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[10px] text-nowrap font-black uppercase tracking-[0.15em] text-gray-400"
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
                  <td className="px-2 xl:px-5 py-4">
                    <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-2 xl:px-5 py-4">
                    <p className="font-black text-sm text-gray-900 leading-tight">
                      {order.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-45">
                      {order.user?.email}
                    </p>
                  </td>

                  {/* Product images */}
                  <td className="px-2 xl:px-5 py-4">
                    <div className="flex -space-x-2">
                      {order.orderItems
                        ?.slice(0, 4)
                        .map((item: any, idx: number) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.product?.name}
                            title={item.product?.name}
                            className="w-7 h-7 xl:w-9 xl:h-9 rounded-xl border-2 border-white object-cover shadow-sm"
                          />
                        ))}
                      {order.orderItems?.length > 4 && (
                        <div className="w-9 h-9 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shadow-sm">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-2 xl:px-5 py-4">
                    <span className="font-black text-base text-gray-900">
                      ${order.totalPrice?.toLocaleString()}
                    </span>
                  </td>

                  {/* Status updater */}
                  <td className="px-2 xl:px-5 py-4">
                    <OrderStatusUpdater
                      orderId={order._id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Section */}
          <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
        </div>
      )}
    </div>
  );
};
