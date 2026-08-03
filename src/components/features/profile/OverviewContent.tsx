import OrderCard from "../OrderCard/OrderCard";
import { Star, Package, CreditCard, ShoppingBag } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export default function OverviewContent({
  orders,
  reviews,
  onRefresh,
  goTo,
}: any) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Expenses"
          value={`$${orders?.reduce((a: any, o: any) => a + o.totalPrice, 0).toLocaleString()}`}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          label="Orders"
          value={orders?.length}
          icon={Package}
          color="orange"
        />
        <StatCard
          label="Reviews"
          value={reviews?.length}
          icon={Star}
          color="yellow"
        />
      </div>

      <section>
        <SectionHeader icon={ShoppingBag} title="Latest Activity" />
        <div className="space-y-4 mt-6">
          {orders?.slice(0, 2).map((order: any) => (
            <OrderCard
              key={order._id}
              order={order}
              onReviewSuccess={onRefresh}
            />
          ))}
          <button
            onClick={() => goTo("orders")}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-2 border-dashed border-gray-200 rounded-[24px]"
          >
            View All Activity →
          </button>
        </div>
      </section>
    </div>
  );
}

// StatCard component
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-50 flex items-center gap-4 shadow-sm ">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}
      >
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-xl font-black leading-none">{value || 0}</p>
      </div>
    </div>
  );
}
