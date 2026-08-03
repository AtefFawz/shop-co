import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { Package } from "lucide-react";
import OrderCard from "../OrderCard/OrderCard";
export default function OrdersContent({ orders, onRefresh }: any) {
  return (
    <div className="space-y-6 ">
      <SectionHeader
        icon={Package}
        title="Your Orders"
        count={orders?.length}
      />
      {orders?.length > 0 ? (
        orders.map((order: any) => (
          <OrderCard
            key={order._id}
            order={order}
            onReviewSuccess={onRefresh}
          />
        ))
      ) : (
        <EmptyState message="No orders yet." />
      )}
    </div>
  );
}
