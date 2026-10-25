import type { MessageKey } from "@/shared/i18n/messages";

// components/layout/navbar/constants.ts
export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "On Sale", path: "/selling" },
  { name: "Category", path: "/category" },
  { name: "Brands", path: "/brand" },
];

const NAV_LABEL_KEYS: Readonly<Record<string, MessageKey>> = {
  "/": "navHome",
  "/selling": "navSale",
  "/category": "navCategory",
  "/brand": "navBrands",
};

export function getStorefrontNavLabel(
  path: string,
  t: (key: MessageKey) => string,
): string {
  const key = NAV_LABEL_KEYS[path];
  return key ? t(key) : path;
}
