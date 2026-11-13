"use client";

import {
  Bell,
  BellOff,
  Clock3,
  Smartphone,
  Volume2,
  VolumeX,
  Vibrate,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useNotificationPreferences } from "@/shared/preferences/NotificationPreferencesProvider";
import PWANotificationAccess from "@/shared/components/pwa/PWANotificationAccess";

type SwitchRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  Icon: LucideIcon;
  disabled?: boolean;
};

function SwitchRow({
  title,
  description,
  checked,
  onChange,
  Icon,
  disabled = false,
}: SwitchRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-surface-subtle p-3.5 text-start transition hover:border-border hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-primary">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
          checked ? "bg-action" : "bg-surface-hover"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export function NotificationPreferencesPanel() {
  const { t } = useLocale();
  const { preferences, updatePreferences } = useNotificationPreferences();

  const rows = [
    {
      key: "inAppBanners" as const,
      title: t("notificationInAppTitle"),
      description: t("notificationInAppHint"),
      Icon: preferences.inAppBanners ? Bell : BellOff,
      checked: preferences.inAppBanners,
    },
    {
      key: "orderUpdates" as const,
      title: t("notificationOrderTitle"),
      description: t("notificationOrderHint"),
      Icon: Smartphone,
      checked: preferences.orderUpdates,
      disabled: !preferences.inAppBanners,
    },
    {
      key: "soundEnabled" as const,
      title: t("notificationSoundTitle"),
      description: t("notificationSoundHint"),
      Icon: preferences.soundEnabled ? Volume2 : VolumeX,
      checked: preferences.soundEnabled,
    },
    {
      key: "vibrationEnabled" as const,
      title: t("notificationVibrationTitle"),
      description: t("notificationVibrationHint"),
      Icon: Vibrate,
      checked: preferences.vibrationEnabled,
    },
  ];

  return (
    <section
      aria-labelledby="notification-preferences-title"
      className="surface-panel overflow-hidden p-5 sm:p-6 lg:col-span-6"
    >
      <div className="flex items-start gap-3 border-b border-border-subtle pb-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-action">
          <Bell size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3
            id="notification-preferences-title"
            className="text-base font-extrabold tracking-tight text-primary"
          >
            {t("notificationPreferencesTitle")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {t("notificationPreferencesDescription")}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <PWANotificationAccess />
      </div>

      <div className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <SwitchRow
            key={row.key}
            title={row.title}
            description={row.description}
            checked={row.checked}
            Icon={row.Icon}
            disabled={row.disabled}
            onChange={() =>
              updatePreferences({ [row.key]: !preferences[row.key] })
            }
          />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border-subtle bg-surface-subtle p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary">
            <Clock3 size={16} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-primary">
                  {t("notificationQuietHoursTitle")}
                </h4>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {t("notificationQuietHoursHint")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.quietHoursEnabled}
                aria-label={t("notificationQuietHoursTitle")}
                onClick={() =>
                  updatePreferences({
                    quietHoursEnabled: !preferences.quietHoursEnabled,
                  })
                }
                className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  preferences.quietHoursEnabled ? "bg-action" : "bg-surface-hover"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    preferences.quietHoursEnabled
                      ? "translate-x-5 rtl:-translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="min-w-0 text-xs font-semibold text-secondary">
                <span className="mb-1.5 block">{t("notificationQuietFrom")}</span>
                <input
                  type="time"
                  value={preferences.quietHoursStart}
                  disabled={!preferences.quietHoursEnabled}
                  onChange={(event) =>
                    updatePreferences({ quietHoursStart: event.target.value })
                  }
                  className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none transition focus:border-action focus:ring-2 focus:ring-focus/30 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <label className="min-w-0 text-xs font-semibold text-secondary">
                <span className="mb-1.5 block">{t("notificationQuietUntil")}</span>
                <input
                  type="time"
                  value={preferences.quietHoursEnd}
                  disabled={!preferences.quietHoursEnabled}
                  onChange={(event) =>
                    updatePreferences({ quietHoursEnd: event.target.value })
                  }
                  className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none transition focus:border-action focus:ring-2 focus:ring-focus/30 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-success-soft px-3.5 py-3 text-xs leading-relaxed text-success">
        {t("notificationPreferencesLocalNote")}
      </p>
    </section>
  );
}
