"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type LocaleSwitcherProps = { compact?: boolean; className?: string };

export function LocaleSwitcher({
  compact = false,
  className = "",
}: LocaleSwitcherProps) {
  const { locale, toggleLocale, t } = useLocale();
  const nextLocale = locale === "ar" ? "en" : "ar";
  const switchLabel =
    nextLocale === "en" ? "Switch language to English" : "التبديل إلى العربية";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={switchLabel}
      title={switchLabel}
      className={`inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 text-xs font-bold text-secondary shadow-sm transition-colors hover:border-border-strong hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${compact ? "h-9 min-w-9 px-2" : "h-10 px-3.5"} ${className}`}
    >
      <Languages size={compact ? 15 : 16} aria-hidden="true" />
      <span>
        {compact ? (nextLocale === "en" ? "EN" : "عربي") : t("language")}
      </span>
    </button>
  );
}

export default LocaleSwitcher;
