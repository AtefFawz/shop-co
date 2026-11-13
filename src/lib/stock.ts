import type { Product } from "@/types";

/**
 * Single rule for "how many can be bought": a missing or invalid countInStock
 * means 0 (out of stock). It used to default to 10, 10, 0 and 20 in four
 * different components, so the same product showed different availability.
 */
export function getStockCount(
  product?: Pick<Product, "countInStock"> | null,
): number {
  const value = Number(product?.countInStock);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
