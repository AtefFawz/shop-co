import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";
export const OrderSummary = ({ items }: { items: Product[] }) => {
  const subtotal = items.reduce(
    (acc, item) =>
      acc + calculateFinalPrice(item.price, item.discount, item.count),
    0,
  );
  const deliveryFee = 15;

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
      <h3 className="text-xl font-bold mb-6">Order Summary</h3>
      <div className="space-y-4 border-b pb-4">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.name} x {item.count}
            </span>
            <span className="font-bold">${item.price * item.count}</span>
          </div>
        ))}
      </div>
      <div className="space-y-4 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold">${subtotal}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Delivery Fee</span>
          <span>+${deliveryFee}</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-4 border-t">
          <span>Total</span>
          <span>${subtotal + deliveryFee}</span>
        </div>
      </div>
    </div>
  );
};
