import axios from "axios";

const isServer = typeof window === "undefined";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ======================
// REQUEST INTERCEPTOR
// ======================

api.interceptors.request.use(
  async (config) => {
    // لو الريكوست جاية من Retry بعد Refresh
    if ((config as any)._accessToken) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${(config as any)._accessToken}`;

      return config;
    }

    let token = "";

    if (isServer) {
      try {
        const { cookies } = await import("next/headers");

        const cookieStore = await cookies();

        token = cookieStore.get("token")?.value || "";
      } catch (err) {}
    } else {
      const Cookies = (await import("js-cookie")).default;

      token = Cookies.get("token") || "";
    }

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================
// RESPONSE INTERCEPTOR
// ======================

api.interceptors.response.use(
  (response) => {
    if ((response.config as any)?._retry) {
      delete (response.config as any)._retry;
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    const msg = error.response?.data?.message || "Something went wrong";

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest._accessToken = token;

            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {
        console.log(
          `🔒 Access token expired [${isServer ? "Server" : "Browser"}]`,
        );

        const cleanBaseURL = api.defaults.baseURL?.endsWith("/")
          ? api.defaults.baseURL.slice(0, -1)
          : api.defaults.baseURL;

        const refreshHeaders: Record<string, string> = {};

        if (isServer) {
          try {
            const { cookies } = await import("next/headers");

            const cookieStore = await cookies();

            const refreshToken = cookieStore.get("refreshToken")?.value;

            if (refreshToken) {
              refreshHeaders["Cookie"] = `refreshToken=${refreshToken}`;
            }
          } catch (err) {
            console.error("Failed reading server cookies:", err);
          }
        }

        const res = await axios.post(
          `${cleanBaseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: refreshHeaders,
          },
        );

        const newAccessToken = res.data?.data?.token;

        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        // Browser
        if (!isServer) {
          const Cookies = (await import("js-cookie")).default;

          const isProd = process.env.NODE_ENV === "production";

          Cookies.set("token", newAccessToken, {
            path: "/",
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
          });
        }

        processQueue(null, newAccessToken);

        isRefreshing = false;

        // أهم سطر في الحل كله
        originalRequest._accessToken = newAccessToken;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        isRefreshing = false;

        console.error("🚨 Refresh token failed");

        if (!isServer) {
          const Cookies = (await import("js-cookie")).default;

          const isProd = process.env.NODE_ENV === "production";

          Cookies.remove("token", {
            path: "/",
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
          });

          Cookies.remove("role", {
            path: "/",
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
          });

          localStorage.clear();

          window.location.replace("/auth/signin");
        }

        return Promise.reject(refreshError);
      }
    }

    if (!isServer) {
      const toast = (await import("react-hot-toast")).default;

      if (status === 500) {
        toast.error("Server is a bit tired, try again later!");
      } else {
        toast.error(msg);
      }
    } else {
      console.error(`🚨 Server API Error [${status}]: ${msg}`);
    }

    return Promise.reject(error);
  },
);

export default api;
