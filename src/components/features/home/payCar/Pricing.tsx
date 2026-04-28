//  3. Pricing (Order Summary)
// ════════════════════════════════════════════════════════════
import { calculateFinalPrice } from "@/lib/logicPricing";
import { Product } from "@/types";
export const Pricing = ({ product }: { product: Product[] }) => {
  const { total, subtotal } = product.reduce(
    (acc, item) => {
      const qty = item.count ?? 1;
      return {
        subtotal: acc.subtotal + item.price * qty,
        total: acc.total + calculateFinalPrice(item.price, item.discount, qty),
      };
    },
    { total: 0, subtotal: 0 },
  );

  const discountAmount = subtotal - total;
  const delivery = 15;
  const grandTotal = total > 0 ? total + delivery : 0;

  const rows = [
    {
      label: "Subtotal",
      value: `$${subtotal.toFixed(2)}`,
      style: "text-gray-600",
    },
    {
      label: "Discount",
      value: `-$${discountAmount.toFixed(2)}`,
      style: "text-red-500",
    },
    {
      label: "Delivery",
      value: `$${delivery.toFixed(2)}`,
      style: "text-gray-600",
    },
  ];

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-base font-black uppercase tracking-tight text-gray-900">
        Order Summary
      </h2>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className={`text-sm font-medium ${r.style}`}>{r.label}</span>
            <span className={`text-sm font-bold ${r.style}`}>{r.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-tight text-gray-900">
          Total
        </span>
        <span className="text-xl font-black text-gray-900">
          ${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
