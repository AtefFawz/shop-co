import api from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

export type ReorderUnavailableReason = "removed" | "out-of-stock" | "variant-unavailable" | "unavailable";

export type ReorderItem = {
  productId: string;
  product: Product;
  quantity: number;
  requestedQuantity: number;
  quantityAdjusted: boolean;
  size?: string;
  color?: string;
  unitPrice: number;
  previousPrice: number;
  priceChanged: boolean;
};

export type ReorderPlan = {
  items: ReorderItem[];
  unavailable: { productId: string; name: string; reason: ReorderUnavailableReason }[];
};

export async function fetchReorderPlan(orderId: string): Promise<ReorderPlan> {
  const response = await api.get(`order/${encodeURIComponent(orderId)}/reorder`);
  const data = response.data?.data as Partial<ReorderPlan> | undefined;
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    unavailable: Array.isArray(data?.unavailable) ? data.unavailable : [],
  };
}

/**
 * Puts the restorable lines of a past order into the bag. The server already priced
 * them at today's catalogue price and capped quantities at current stock; checkout
 * re-validates both, so nothing here is trusted for money or stock.
 */
export function addReorderToCart(plan: ReorderPlan): number {
  const { addItem } = useCartStore.getState();
  for (const item of plan.items) {
    const product = item.product;
    addItem({
      ...product,
      price: Number(product.price),
      discount: Number(product.discount) || 0,
      colors: item.color ? [item.color] : [],
      size: item.size ? [item.size] : [],
      count: item.quantity,
      isChose: true,
    });
  }
  return plan.items.length;
}
