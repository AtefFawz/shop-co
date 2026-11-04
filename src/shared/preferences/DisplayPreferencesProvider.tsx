"use client";

import { MotionConfig } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FontSizePreference = "small" | "standard" | "large";
export type LineSpacingPreference = "standard" | "comfortable";

export interface DisplayPreferences {
  fontSize: FontSizePreference;
  lineSpacing: LineSpacingPreference;
  reduceMotion: boolean;
  highContrast: boolean;
}

interface DisplayPreferencesContextValue {
  preferences: DisplayPreferences;
  hydrated: boolean;
  updatePreferences: (patch: Partial<DisplayPreferences>) => void;
  resetPreferences: () => void;
}

const STORAGE_KEY = "shopco-display-preferences";

export const DEFAULT_DISPLAY_PREFERENCES: DisplayPreferences = {
  fontSize: "standard",
  lineSpacing: "standard",
  reduceMotion: false,
  highContrast: false,
};

const DisplayPreferencesContext = createContext<DisplayPreferencesContextValue | null>(
  null,
);
const ReducedMotionPreferenceContext = createContext(false);

function normalizePreferences(value: unknown): DisplayPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_DISPLAY_PREFERENCES;
  }

  const candidate = value as Partial<DisplayPreferences>;

  return {
    fontSize:
      candidate.fontSize === "small" || candidate.fontSize === "large"
        ? candidate.fontSize
        : "standard",
    lineSpacing:
      candidate.lineSpacing === "comfortable" ? "comfortable" : "standard",
    reduceMotion: candidate.reduceMotion === true,
    highContrast: candidate.highContrast === true,
  };
}

function readStoredPreferences(): DisplayPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? normalizePreferences(JSON.parse(raw) as unknown)
      : DEFAULT_DISPLAY_PREFERENCES;
  } catch {
    return DEFAULT_DISPLAY_PREFERENCES;
  }
}

function applyPreferencesToDocument(preferences: DisplayPreferences) {
  const root = document.documentElement;
  root.dataset.fontSize = preferences.fontSize;
  root.dataset.lineSpacing = preferences.lineSpacing;
  root.dataset.reduceMotion = String(preferences.reduceMotion);
  root.dataset.highContrast = String(preferences.highContrast);
}

export function DisplayPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<DisplayPreferences>(
    DEFAULT_DISPLAY_PREFERENCES,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedPreferences = readStoredPreferences();

    // The early document script applies these values before the first paint.
    // This effect synchronizes React state with that already-applied state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(storedPreferences);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      let nextPreferences = DEFAULT_DISPLAY_PREFERENCES;
      if (event.newValue) {
        try {
          nextPreferences = normalizePreferences(
            JSON.parse(event.newValue) as unknown,
          );
        } catch {
          nextPreferences = DEFAULT_DISPLAY_PREFERENCES;
        }
      }

      setPreferences(nextPreferences);
      applyPreferencesToDocument(nextPreferences);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    applyPreferencesToDocument(preferences);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // The preferences still work for this tab if browser storage is blocked.
    }
  }, [preferences, hydrated]);

  const updatePreferences = useCallback(
    (patch: Partial<DisplayPreferences>) => {
      setPreferences((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_DISPLAY_PREFERENCES);
  }, []);

  const value = useMemo(
    () => ({ preferences, hydrated, updatePreferences, resetPreferences }),
    [preferences, hydrated, updatePreferences, resetPreferences],
  );

  return (
    <MotionConfig reducedMotion={preferences.reduceMotion ? "always" : "user"}>
      <DisplayPreferencesContext.Provider value={value}>
        <ReducedMotionPreferenceContext.Provider value={preferences.reduceMotion}>
          {children}
        </ReducedMotionPreferenceContext.Provider>
      </DisplayPreferencesContext.Provider>
    </MotionConfig>
  );
}

export function useDisplayPreferences() {
  const context = useContext(DisplayPreferencesContext);
  if (!context) {
    throw new Error(
      "useDisplayPreferences must be used within DisplayPreferencesProvider",
    );
  }
  return context;
}

export function useReducedMotionPreference() {
  return useContext(ReducedMotionPreferenceContext);
}
