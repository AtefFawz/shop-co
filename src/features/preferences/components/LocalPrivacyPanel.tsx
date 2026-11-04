"use client";

import { useState } from "react";
import { Database, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useDisplayPreferences } from "@/shared/preferences/DisplayPreferencesProvider";
import { useNotificationPreferences } from "@/shared/preferences/NotificationPreferencesProvider";

export function LocalPrivacyPanel() {
  const { t } = useLocale();
  const { resetPreferences: resetDisplayPreferences } = useDisplayPreferences();
  const { resetPreferences: resetNotificationPreferences } =
    useNotificationPreferences();
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    if (resetting) return;
    if (!window.confirm(t("privacyResetConfirm"))) return;

    setResetting(true);
    try {
      resetDisplayPreferences();
      resetNotificationPreferences();
      window.localStorage.removeItem("shopco-profile-prefs");
      window.localStorage.removeItem("shopco_notif_sound");
      toast.success(t("privacyResetSuccess"));
    } catch {
      toast.error(t("privacyResetFailed"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <section
      aria-labelledby="local-privacy-title"
      className="surface-panel overflow-hidden p-5 sm:p-6 lg:col-span-6"
    >
      <div className="flex items-start gap-3 border-b border-border-subtle pb-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-action">
          <ShieldCheck size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3
            id="local-privacy-title"
            className="text-base font-extrabold tracking-tight text-primary"
          >
            {t("privacyPanelTitle")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {t("privacyPanelDescription")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/70 bg-surface-subtle p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary">
          <Database size={17} aria-hidden="true" />
        </span>
        <div>
          <h4 className="text-sm font-bold text-primary">
            {t("privacyLocalDataTitle")}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {t("privacyLocalDataHint")}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={resetting}
        onClick={handleReset}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-secondary transition hover:border-border-strong hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <RotateCcw size={15} aria-hidden="true" />
        {t("privacyResetAction")}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {t("privacyDataPreservedNote")}
      </p>
    </section>
  );
}
