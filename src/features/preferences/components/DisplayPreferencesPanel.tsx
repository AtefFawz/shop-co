"use client";

import {
  Accessibility,
  AlignLeft,
  Check,
  Eye,
  RotateCcw,
  Type,
  Waves,
  ZapOff,
} from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useDisplayPreferences } from "@/shared/preferences/DisplayPreferencesProvider";

const FONT_SIZE_OPTIONS = [
  { value: "small", labelKey: "displayFontSmall", sample: "A−" },
  { value: "standard", labelKey: "displayFontStandard", sample: "A" },
  { value: "large", labelKey: "displayFontLarge", sample: "A+" },
] as const;

const LINE_SPACING_OPTIONS = [
  { value: "standard", labelKey: "displaySpacingStandard" },
  { value: "comfortable", labelKey: "displaySpacingComfortable" },
] as const;

export function DisplayPreferencesPanel() {
  const { t } = useLocale();
  const { preferences, updatePreferences, resetPreferences } =
    useDisplayPreferences();

  const accessibilityOptions = [
    {
      key: "reduceMotion" as const,
      title: t("displayReduceMotion"),
      description: t("displayReduceMotionHint"),
      Icon: ZapOff,
    },
    {
      key: "highContrast" as const,
      title: t("displayHighContrast"),
      description: t("displayHighContrastHint"),
      Icon: Eye,
    },
  ];

  return (
    <section
      aria-labelledby="display-preferences-title"
      className="surface-panel overflow-hidden p-5 sm:p-6 lg:col-span-12"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-action">
            <Accessibility size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3
              id="display-preferences-title"
              className="text-base font-extrabold tracking-tight text-primary"
            >
              {t("displayPreferencesTitle")}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t("displayPreferencesDescription")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetPreferences}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-xs font-bold text-secondary transition hover:border-border-strong hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <RotateCcw size={14} aria-hidden="true" />
          {t("displayReset")}
        </button>
      </div>

      <div className="grid gap-6 pt-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Type size={16} className="text-muted" aria-hidden="true" />
              <h4 className="text-sm font-extrabold text-primary">
                {t("displayFontSizeTitle")}
              </h4>
            </div>

            <div
              role="group"
              aria-label={t("displayFontSizeTitle")}
              className="grid grid-cols-3 gap-2"
            >
              {FONT_SIZE_OPTIONS.map((option) => {
                const selected = preferences.fontSize === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      updatePreferences({ fontSize: option.value })
                    }
                    className={`flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                      selected
                        ? "border-action bg-brand-soft text-action shadow-sm"
                        : "border-border bg-surface text-secondary hover:border-border-strong hover:bg-surface-subtle"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`font-extrabold leading-none ${
                        option.value === "small"
                          ? "text-lg"
                          : option.value === "large"
                            ? "text-3xl"
                            : "text-2xl"
                      }`}
                    >
                      {option.sample}
                    </span>
                    <span className="text-xs font-bold">
                      {t(option.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {t("displayFontSizeHint")}
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <AlignLeft size={16} className="text-muted" aria-hidden="true" />
              <h4 className="text-sm font-extrabold text-primary">
                {t("displayLineSpacingTitle")}
              </h4>
            </div>
            <div
              role="group"
              aria-label={t("displayLineSpacingTitle")}
              className="grid grid-cols-2 gap-2"
            >
              {LINE_SPACING_OPTIONS.map((option) => {
                const selected = preferences.lineSpacing === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      updatePreferences({ lineSpacing: option.value })
                    }
                    className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                      selected
                        ? "border-action bg-brand-soft text-action"
                        : "border-border bg-surface text-secondary hover:border-border-strong hover:bg-surface-subtle"
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-muted">
              <Waves size={15} aria-hidden="true" />
              <span className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em]">
                {t("displayPreviewLabel")}
              </span>
            </div>
            <h4 className="text-xl font-extrabold tracking-tight text-primary">
              {t("displayPreviewHeading")}
            </h4>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-secondary">
              {t("displayPreviewBody")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-muted">
                {t("displayPreviewLabelSmall")}
              </span>
              <span className="rounded-full bg-action px-3 py-1.5 text-xs font-bold text-on-action">
                {t("displayPreviewAction")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {accessibilityOptions.map(({ key, title, description, Icon }) => {
              const enabled = preferences[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => updatePreferences({ [key]: !enabled })}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 text-start transition hover:border-border-strong hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-secondary">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-primary">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                      {description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                      enabled ? "bg-action" : "bg-surface-hover"
                    }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        enabled ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-success-soft px-3.5 py-3 text-xs leading-relaxed text-success">
        <Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>{t("displayPreferencesLocalNote")}</p>
      </div>
    </section>
  );
}
