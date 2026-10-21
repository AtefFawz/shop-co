/**
 * Formats all storefront amounts in Egyptian pounds (EGP).
 * Keep the locale limited to the app's supported language codes so that
 * server and browser output stay deterministic during hydration.
 */
export type CurrencyLocale = "ar" | "en";

export function formatCurrency(
  value: unknown,
  locale: CurrencyLocale = "en",
): string {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}
