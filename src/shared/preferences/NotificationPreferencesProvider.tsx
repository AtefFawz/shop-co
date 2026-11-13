"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  normalizeNotificationPreferences,
  type NotificationPreferences,
} from "@/shared/preferences/notificationPreferenceUtils";

export {
  DEFAULT_NOTIFICATION_PREFERENCES,
  isOrderStatusNotification,
  isQuietHoursActive,
  normalizeNotificationPreferences,
} from "@/shared/preferences/notificationPreferenceUtils";
export type { NotificationPreferences } from "@/shared/preferences/notificationPreferenceUtils";

interface NotificationPreferencesContextValue {
  preferences: NotificationPreferences;
  hydrated: boolean;
  updatePreferences: (patch: Partial<NotificationPreferences>) => void;
  resetPreferences: () => void;
}

const STORAGE_KEY = "shopco-notification-preferences";

const NotificationPreferencesContext =
  createContext<NotificationPreferencesContextValue | null>(null);

function readStoredPreferences(): NotificationPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeNotificationPreferences(JSON.parse(raw) as unknown);

    // Migrate the sound control used by older SHOP.CO builds.
    const legacySound = window.localStorage.getItem("shopco_notif_sound");
    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      soundEnabled: legacySound !== "muted",
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export function NotificationPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredPreferences();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) {
        setPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
        return;
      }
      try {
        setPreferences(
          normalizeNotificationPreferences(JSON.parse(event.newValue) as unknown),
        );
      } catch {
        setPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      // Keep the legacy notification header control in sync with this setting.
      window.localStorage.setItem(
        "shopco_notif_sound",
        preferences.soundEnabled ? "on" : "muted",
      );
    } catch {
      // Preferences remain active in memory if browser storage is unavailable.
    }
  }, [preferences, hydrated]);

  const updatePreferences = useCallback(
    (patch: Partial<NotificationPreferences>) => {
      setPreferences((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
  }, []);

  const value = useMemo(
    () => ({ preferences, hydrated, updatePreferences, resetPreferences }),
    [preferences, hydrated, updatePreferences, resetPreferences],
  );

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error(
      "useNotificationPreferences must be used within NotificationPreferencesProvider",
    );
  }
  return context;
}
