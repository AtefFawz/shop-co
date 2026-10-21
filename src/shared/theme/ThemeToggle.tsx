"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useLocale } from "@/shared/i18n/LocaleProvider";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export default function ThemeToggle({
  compact = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      aria-label={isDark ? t("themeSwitchToLight") : t("themeSwitchToDark")}
      aria-pressed={isDark}
      title={isDark ? t("themeSwitchToLight") : t("themeSwitchToDark")}
      onClick={toggleTheme}
      whileTap={reduceMotion ? undefined : { scale: 0.9, rotate: -8 }}
      className={`group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-surface text-secondary shadow-sm outline-none transition-colors duration-200 hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${compact ? "h-9 w-9" : "h-10 w-10"} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/10"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? theme : "initial"}
          initial={reduceMotion ? false : { opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, rotate: 40, scale: 0.7 }}
          transition={{ duration: 0.18 }}
          className="relative z-10 flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={compact ? 16 : 18} strokeWidth={1.9} />
          ) : (
            <Moon size={compact ? 16 : 18} strokeWidth={1.9} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
