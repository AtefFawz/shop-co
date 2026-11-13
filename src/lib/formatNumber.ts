import type { Locale } from "@/shared/i18n/messages";

/** Format integer/count values consistently across Arabic and English UI. */
export function formatNumber(value: number, locale: Locale): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
    safeValue,
  );
}
