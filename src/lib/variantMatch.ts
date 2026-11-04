import { colorFamily, toHex } from "@/lib/colorPalette";

/**
 * Helpers for matching a product's free-text `colors` / `size` values against
 * the catalog filter. Admins type these values by hand ("M", "medium",
 * "X-Large", "#FF0000", "#f00"), so both sides are normalised first.
 */

export const SIZE_ORDER = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
] as const;

/** Waist/EU-style sizes used by pants and jeans. */
export const NUMERIC_SIZES = [
  "28", "30", "32", "34", "36", "38", "40", "42", "44", "46",
] as const;

export const ONE_SIZE = "ONE SIZE";

export type CanonicalSize = (typeof SIZE_ORDER)[number];

const SIZE_ALIASES: Record<string, string> = {
  xxs: "XXS", "xx-small": "XXS", "xxsmall": "XXS", "2xs": "XXS",
  xs: "XS", "x-small": "XS", xsmall: "XS", "extra small": "XS",
  s: "S", small: "S",
  m: "M", medium: "M",
  l: "L", large: "L",
  xl: "XL", "x-large": "XL", xlarge: "XL", "extra large": "XL",
  "2xl": "2XL", xxl: "2XL", "xx-large": "2XL", xxlarge: "2XL",
  "3xl": "3XL", xxxl: "3XL", "3x-large": "3XL",
  "4xl": "4XL", xxxxl: "4XL", "4x-large": "4XL",
  "one size": ONE_SIZE, onesize: ONE_SIZE, "free size": ONE_SIZE,
  freesize: ONE_SIZE, "مقاس واحد": ONE_SIZE,
};

/** Turns "Medium" / "m" / "XX-Large" into a canonical code, or the trimmed upper-case text. */
export function normalizeSize(value: unknown): string {
  if (typeof value !== "string") return "";
  const key = value.trim().toLowerCase();
  if (!key) return "";
  return SIZE_ALIASES[key] ?? value.trim().toUpperCase();
}

/** Normalises any colour spelling to "#rrggbb" (falls back to lower-case text). */
export function normalizeColor(value: unknown): string {
  if (typeof value !== "string") return "";
  return toHex(value) ?? value.trim().toLowerCase();
}

/** Accepts string[] | "a, b" | null (the shapes the API returns). */
export function toOptionList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

/**
 * True when the product has a colour in the same palette family as `color`.
 * "black", "#111" and "#000000" all match the Onyx swatch.
 */
export function productHasColor(
  product: { colors?: unknown },
  color: string,
): boolean {
  const wanted = colorFamily(color) ?? normalizeColor(color);
  return toOptionList(product.colors).some(
    (c) => (colorFamily(c) ?? normalizeColor(c)) === wanted,
  );
}

export function productHasSize(
  product: { size?: unknown },
  size: string,
): boolean {
  const wanted = normalizeSize(size);
  return toOptionList(product.size).some((s) => normalizeSize(s) === wanted);
}
