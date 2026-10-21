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
import { messages, type Locale, type MessageKey } from "@/shared/i18n/messages";
import { useRouter } from "next/navigation";

type LocaleContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey) => string;
};

const STORAGE_KEY = "shopco-language";
const LocaleContext = createContext<LocaleContextValue>({
  locale: "ar",
  direction: "rtl",
  setLocale: () => undefined,
  toggleLocale: () => undefined,
  t: (key) => messages.ar[key],
});

function applyLocale(locale: Locale, persist = true) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  root.dataset.locale = locale;

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // The language switch remains available if local storage is blocked.
    }
  }
  // Keep the current locale available to Server Components for correctly
  // translated first renders (for example, account detail pages).
  document.cookie = `${STORAGE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${
    window.location.protocol === "https:" ? "; Secure" : ""
  }`;
}

export function LocaleProvider({
  children,
  initialLocale = "ar",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // The cookie is the server-rendered source of truth. Only fall back to
    // localStorage for returning users who have no language cookie yet.
    const cookieLocale = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${STORAGE_KEY}=`))
      ?.split("=")[1];

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Keep the server-provided locale when storage is unavailable.
    }

    const resolvedLocale: Locale =
      cookieLocale === "en" || cookieLocale === "ar"
        ? cookieLocale
        : stored === "en"
          ? "en"
          : initialLocale;

    // Keep cookie, localStorage, and the document root synchronized.
    applyLocale(resolvedLocale, true);
    if (resolvedLocale !== locale) {
      setLocaleState(resolvedLocale);
    }
  }, [initialLocale, locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    applyLocale(nextLocale);
    setLocaleState(nextLocale);
    // Refresh Server Components that read the locale cookie (for example, server-rendered review sections).
    router.refresh();
  }, [router]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const t = useCallback((key: MessageKey) => messages[locale][key], [locale]);
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: locale === "ar" ? "rtl" : "ltr",
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, setLocale, toggleLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
