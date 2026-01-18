import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";
export const Pricing = ({ product }: { product: Product[] }) => {
  const { total, subtotal } = product.reduce(
    (acc, item) => {
      const qty = item.count ?? 1;
      const originalPrice = item.price * qty;
      const finalPrice = calculateFinalPrice(item.price, item.discount, qty);

      return {
        subtotal: acc.subtotal + originalPrice,
        total: acc.total + finalPrice,
      };
    },
    { total: 0, subtotal: 0 },
  );
  const discountAmount = subtotal - total;

  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="font-bold text-xl">Order Summary</h1>

      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span>${subtotal}</span>
      </div>

      <div className="flex justify-between text-red-500">
        <span>Discount:</span>
        <span>-${discountAmount}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Delivery Fee:</span>
        <span>$15</span>
      </div>

      <hr />

      <div className="flex justify-between font-bold text-lg">
        <h4>Total:</h4>
        <h4>${total > 0 ? total + 15 : 0}</h4>
      </div>
    </div>
  );
};
