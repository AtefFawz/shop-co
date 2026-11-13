"use client";

import { useReducedMotion } from "framer-motion";
import { useReducedMotionPreference } from "@/shared/preferences/DisplayPreferencesProvider";

/** Combines the operating-system preference with the user's in-app choice. */
export function useAppReducedMotion(): boolean {
  const systemPreference = useReducedMotion();
  const inAppPreference = useReducedMotionPreference();
  return systemPreference === true || inAppPreference;
}
