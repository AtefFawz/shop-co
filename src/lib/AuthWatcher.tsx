"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { useSocketStore } from "@/store/socketStore";
import { hasSessionHint } from "@/lib/sessionHint";

export const AuthWatcher = () => {
  const pathname = usePathname();
  const hasSyncedSession = useRef(false);
  useEffect(() => {
    if (pathname.startsWith("/auth") || hasSyncedSession.current) return;
    hasSyncedSession.current = true;
    let active = true;
    const syncSession = async () => {
      try {
        // Without the hint this browser has never signed in (a guest). Probe once with
        // the current cookies but do not call refresh-token: guests would otherwise burn
        // the shared refresh rate limit on every page load.
        const response = await api.get("profile/me", { skipAuthRefresh: !hasSessionHint() });
        const user = response.data?.data?.user;
        if (!active || !user) return;
        useUserStore.getState().setUser(user);
        useSocketStore.getState().setSocketReady(true);
      } catch {
        if (!active) return;
        useUserStore.getState().clearUser();
        useSocketStore.getState().setSocketReady(false);
      }
    };
    void syncSession();
    return () => {
      active = false;
    };
  }, [pathname]);

  return null;
};
