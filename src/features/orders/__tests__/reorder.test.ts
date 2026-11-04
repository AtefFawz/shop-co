import { describe, expect, it } from "vitest";
import { messages } from "@/shared/i18n/messages";

const REORDER_KEYS = [
  "reorderAction",
  "reorderLoading",
  "reorderAdded",
  "reorderPartial",
  "reorderPricesUpdated",
  "reorderQuantityReduced",
  "reorderNothing",
  "reorderFailed",
] as const;

describe("reorder messages", () => {
  it("exist in both languages and are not empty", () => {
    for (const key of REORDER_KEYS) {
      expect(messages.en[key]).toBeTruthy();
      expect(messages.ar[key]).toBeTruthy();
      expect(messages.ar[key]).not.toBe(messages.en[key]);
    }
  });
});
