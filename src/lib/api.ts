import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSocketStore } from "@/store/socketStore";
import { useUserStore } from "@/store/userStore";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Treat a 401 as final: do not try to refresh the session and retry. */
    skipAuthRefresh?: boolean;
  }
}

const api = axios.create({
  baseURL: "/api/backend/",
  withCredentials: true,
  timeout: 20_000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

type RetryConfig = InternalAxiosRequestConfig & { _shopcoRetried?: boolean };
let refreshInFlight: Promise<void> | null = null;

const getLocale = () =>
  typeof document !== "undefined" && document.documentElement.dataset.locale === "en"
    ? "en"
    : "ar";

api.interceptors.request.use((config) => {
  // Normalize legacy leading-slash callers without bypassing the same-origin proxy.
  if (config.url) config.url = config.url.replace(/^\/+/, "");

  // Access and refresh tokens are HttpOnly cookies issued by the API.
  // Never read, copy, or attach credentials from JavaScript.
  config.headers.set("X-Locale", getLocale());
  config.withCredentials = true;
  return config;
});

async function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(
        "/api/auth/refresh-token",
        {},
        {
          withCredentials: true,
          timeout: 15_000,
          headers: {
            "Content-Type": "application/json",
            "X-Locale": getLocale(),
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      )
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  await refreshInFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      axios.isCancel(error) ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      return Promise.reject(error);
    }

    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url || "";
    const isSessionEndpoint =
      /auth\/(?:signin|signup|verify-email|resend-verification|google\/exchange|refresh-token|forget-password|verify-otp|reset-password)/i.test(url) ||
      url.includes("auth/logout");
    const isAuthFormEndpoint = /auth\/(?:signin|signup|verify-email|resend-verification|google\/exchange|forget-password|verify-otp|reset-password)/i.test(url);

    if (status === 401 && original && !original._shopcoRetried && !original.skipAuthRefresh && !isSessionEndpoint) {
      original._shopcoRetried = true;
      try {
        await refreshSession();
        // The backend rotated HttpOnly cookies in the refresh response. The
        // browser attaches the new access cookie automatically on this retry.
        return api(original);
      } catch (refreshError) {
        // Remove only obsolete, JS-readable cookies from older frontend releases.
        Cookies.remove("token", { path: "/" });
        Cookies.remove("role", { path: "/" });
        const hadAuthenticatedSession = useUserStore.getState().isAuthenticated;
        useUserStore.getState().clearUser();
        useSocketStore.getState().setSocketReady(false);

        // A guest's optional /profile/me probe is allowed to return 401 without
        // forcing a redirect. Only end a session that this app had established.
        if (
          hadAuthenticatedSession &&
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.assign("/auth/signin?reason=session-expired");
        }
        return Promise.reject(refreshError);
      }
    }

    if (status !== 401 && !isAuthFormEndpoint && typeof window !== "undefined") {
      const locale = getLocale();
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ||
        (locale === "ar"
          ? "حدث خطأ غير متوقع. حاول مرة أخرى."
          : "Something went wrong. Please try again.");
      console.error("API request failed:", status ?? "network error", message);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
