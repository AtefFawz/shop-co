import { describe, expect, it } from "vitest";
import { getSafeInternalRedirect } from "@/lib/safeRedirect";

describe("getSafeInternalRedirect", () => {
  it("keeps valid same-origin destinations and their query strings", () => {
    expect(getSafeInternalRedirect("/shop/details/cart/checkout?coupon=SAVE"))
      .toBe("/shop/details/cart/checkout?coupon=SAVE");
  });

  it("rejects external and protocol-relative destinations", () => {
    expect(getSafeInternalRedirect("https://example.com")).toBeNull();
    expect(getSafeInternalRedirect("//example.com/path")).toBeNull();
  });

  it("rejects auth, API, and backslash-based redirect paths", () => {
    expect(getSafeInternalRedirect("/auth/signin")).toBeNull();
    expect(getSafeInternalRedirect("/api/backend/order")).toBeNull();
    expect(getSafeInternalRedirect("/\\example.com")).toBeNull();
  });

  it("returns null for missing or malformed destinations", () => {
    expect(getSafeInternalRedirect(null)).toBeNull();
    expect(getSafeInternalRedirect("")).toBeNull();
    expect(getSafeInternalRedirect("checkout")).toBeNull();
  });
});
