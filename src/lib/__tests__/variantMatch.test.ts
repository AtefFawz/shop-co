import { describe, expect, it } from "vitest";
import { colorFamily, toHex } from "@/lib/colorPalette";
import {
  normalizeSize,
  productHasColor,
  productHasSize,
} from "@/lib/variantMatch";

describe("toHex", () => {
  it("understands hex, short hex, rgb and colour words", () => {
    expect(toHex("#F00")).toBe("#ff0000");
    expect(toHex("rgb(0, 0, 0)")).toBe("#000000");
    expect(toHex("Black")).toBe("#000000");
    expect(toHex("أسود")).toBe("#000000");
    expect(toHex("not a colour")).toBeNull();
  });
});

describe("colour matching", () => {
  it("groups free-form values into the same palette family", () => {
    expect(colorFamily("black")).toBe("#000000");
    expect(colorFamily("#111111")).toBe("#000000");
    expect(productHasColor({ colors: ["black"] }, "#000000")).toBe(true);
    expect(productHasColor({ colors: "#fff, red" }, "#ffffff")).toBe(true);
    expect(productHasColor({ colors: ["red"] }, "#000000")).toBe(false);
    expect(productHasColor({ colors: [] }, "#000000")).toBe(false);
  });
});

describe("size matching", () => {
  it("normalises spellings", () => {
    expect(normalizeSize("Medium")).toBe("M");
    expect(normalizeSize("XXL")).toBe("2XL");
    expect(normalizeSize("x-large")).toBe("XL");
    expect(normalizeSize("32")).toBe("32");
  });

  it("matches arrays and comma separated strings", () => {
    expect(productHasSize({ size: ["Medium", "XL"] }, "M")).toBe(true);
    expect(productHasSize({ size: "s, m, xxl" }, "2XL")).toBe(true);
    expect(productHasSize({ size: ["Large"] }, "M")).toBe(false);
  });
});
