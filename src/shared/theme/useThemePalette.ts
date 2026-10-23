"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/shared/theme/ThemeProvider";

/**
 * Resolves design tokens to concrete colors for canvas/WebGL libraries that
 * cannot consume CSS variables directly. CSS remains the source of truth.
 */
export interface ResolvedThemePalette {
  primary: string;
  secondary: string;
  onActionMuted: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  action: string;
  actionHover: string;
  accent: string;
  success: string;
  successBright: string;
  onSuccess: string;
  danger: string;
  dangerBright: string;
  onDanger: string;
  warning: string;
  warningBright: string;
  onWarning: string;
  info: string;
  infoBright: string;
  onInfo: string;
  rating: string;
}

const FALLBACK: ResolvedThemePalette = {
  primary: "#1c1c1f",
  secondary: "#505159",
  onActionMuted: "#b9b9bf",
  surface: "#ffffff",
  surfaceRaised: "#ffffff",
  border: "#e2dfdb",
  borderStrong: "#cfcbc5",
  action: "#19191c",
  actionHover: "#303035",
  accent: "#64779b",
  success: "#20764b",
  successBright: "#299762",
  onSuccess: "#ffffff",
  danger: "#b8324b",
  dangerBright: "#ff8599",
  onDanger: "#ffffff",
  warning: "#916119",
  warningBright: "#f1c86d",
  onWarning: "#ffffff",
  info: "#286b99",
  infoBright: "#84c9f5",
  onInfo: "#ffffff",
  rating: "#d49a18",
};

function readToken(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function useThemePalette(): ResolvedThemePalette {
  const { theme } = useTheme();
  const readPalette = (): ResolvedThemePalette => ({
    primary: readToken("--text-primary", FALLBACK.primary),
    secondary: readToken("--text-secondary", FALLBACK.secondary),
    onActionMuted: readToken("--text-on-action-muted", FALLBACK.onActionMuted),
    surface: readToken("--surface", FALLBACK.surface),
    surfaceRaised: readToken("--surface-raised", FALLBACK.surfaceRaised),
    border: readToken("--border", FALLBACK.border),
    borderStrong: readToken("--border-strong", FALLBACK.borderStrong),
    action: readToken("--action", FALLBACK.action),
    actionHover: readToken("--action-hover", FALLBACK.actionHover),
    accent: readToken("--accent", FALLBACK.accent),
    success: readToken("--success", FALLBACK.success),
    successBright: readToken("--success-bright", FALLBACK.successBright),
    onSuccess: readToken("--text-on-success", FALLBACK.onSuccess),
    danger: readToken("--danger", FALLBACK.danger),
    dangerBright: readToken("--danger-bright", FALLBACK.dangerBright),
    onDanger: readToken("--text-on-danger", FALLBACK.onDanger),
    warning: readToken("--warning", FALLBACK.warning),
    warningBright: readToken("--warning-bright", FALLBACK.warningBright),
    onWarning: readToken("--text-on-warning", FALLBACK.onWarning),
    info: readToken("--info", FALLBACK.info),
    infoBright: readToken("--info-bright", FALLBACK.infoBright),
    onInfo: readToken("--text-on-info", FALLBACK.onInfo),
    rating: readToken("--rating", FALLBACK.rating),
  });

  const [palette, setPalette] = useState<ResolvedThemePalette>(readPalette);

  useEffect(() => {
    // The theme class is set synchronously by ThemeProvider before this effect.
    setPalette(readPalette());
    // readPalette only reads the current CSS custom properties.
  }, [theme]);

  return palette;
}
