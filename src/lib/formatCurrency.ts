/** Keep currency formatting consistent across storefront and administration. */
export type CurrencyLocale = "ar" | "en";

export function createCurrencyFormatter(
  locale: CurrencyLocale = "en",
  maximumFractionDigits = 2,
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

export function formatCurrency(
  value: unknown,
  locale: CurrencyLocale = "en",
): string {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return createCurrencyFormatter(locale).format(safeAmount);
}
