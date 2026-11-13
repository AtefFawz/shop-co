import { describe, expect, it } from "vitest";
import { canAdminDeleteOrder, canCustomerDeleteOrder } from "@/lib/orderRules";

describe("order deletion rules", () => {
  it("lets customers delete only pending orders", () => {
    expect(canCustomerDeleteOrder("Pending")).toBe(true);
    expect(canCustomerDeleteOrder("pending")).toBe(true);
    for (const status of ["Shipped", "Delivered", "Cancelled", "Processing", "", undefined, null]) {
      expect(canCustomerDeleteOrder(status)).toBe(false);
    }
  });

  it("lets admins delete pending or cancelled orders, never financial records", () => {
    expect(canAdminDeleteOrder("Pending")).toBe(true);
    expect(canAdminDeleteOrder("Cancelled")).toBe(true);
    expect(canAdminDeleteOrder("Shipped")).toBe(false);
    expect(canAdminDeleteOrder("Delivered")).toBe(false);
    expect(canAdminDeleteOrder("Processing")).toBe(false);
  });
});
