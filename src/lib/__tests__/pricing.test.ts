import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_DELIVERY_FEE,
  calculateDeliveryFee,
  calculateFinalPrice,
  calculateTotalPrice,
} from "@/lib/logicPricing";
import { getStockCount } from "@/lib/stock";

describe("delivery fee", () => {
  it("is free at/above the threshold and for empty carts", () => {
    expect(calculateDeliveryFee(0)).toBe(0);
    expect(calculateDeliveryFee(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(calculateDeliveryFee(FREE_SHIPPING_THRESHOLD - 1)).toBe(
      STANDARD_DELIVERY_FEE,
    );
  });
});

describe("totals", () => {
  it("applies discount before shipping", () => {
    expect(calculateFinalPrice(100, 50, 2, true)).toBe(100);
    expect(calculateFinalPrice(100, 50, 2, false)).toBe(200);
    const total = calculateTotalPrice([{ price: 100, count: 1, discount: 50, isSale: true }]);
    expect(total).toBe(50 + STANDARD_DELIVERY_FEE);
  });
});

describe("stock", () => {
  it("treats missing or invalid values as out of stock", () => {
    expect(getStockCount({ countInStock: 5 })).toBe(5);
    expect(getStockCount({ countInStock: undefined })).toBe(0);
    expect(getStockCount(null)).toBe(0);
    expect(getStockCount({ countInStock: -3 })).toBe(0);
  });
});
