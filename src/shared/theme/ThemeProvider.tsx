"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";


export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  mounted: false,
  toggleTheme: () => undefined,
  setTheme: () => undefined,
});

const STORAGE_KEY = "shopco-theme";

function applyDocumentTheme(theme: Theme, persist = true) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The app can still switch themes when storage is unavailable.
    }
  }

  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  themeColor?.setAttribute("content", theme === "dark" ? "#101310" : "#f5f4ef");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme: Theme = root.classList.contains("dark") ? "dark" : "light";
    // The DOM class is the hydration-safe source of truth for the initial theme.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initialTheme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncWithSystem = (event: MediaQueryListEvent) => {
      let explicitChoice = false;
      try {
        explicitChoice = window.localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        // Treat blocked storage as no explicit choice.
      }

      if (!explicitChoice) {
        const nextTheme: Theme = event.matches ? "dark" : "light";
        applyDocumentTheme(nextTheme, false);
        setThemeState(nextTheme);
      }
    };

    media.addEventListener("change", syncWithSystem);
    return () => media.removeEventListener("change", syncWithSystem);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    applyDocumentTheme(nextTheme);
    setThemeState(nextTheme);

    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimer.current = null;
    }, 360);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, mounted, toggleTheme, setTheme }),
    [theme, mounted, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
