import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.config && (response.config as any)._retry) {
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
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              originalRequest.headers["authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔒 Access token expired. Fetching a new one...");

        const res = await axios.post(
          `${api.defaults.baseURL}auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data?.data?.token;
        Cookies.set("token", newAccessToken, { path: "/" });

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["authorization"] = `Bearer ${newAccessToken}`;
        }

        console.log(
          "🔓 Token refreshed successfully! Retrying original request...",
        );

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        console.error("🚨 Refresh token failed. Redirecting to signin...");

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/auth/signin"
        ) {
          Cookies.remove("token", { path: "/" });
          Cookies.remove("role", { path: "/" });
          localStorage.clear();
          window.location.href = "/auth/signin";
        }

        toast.error("Your session has expired. Please sign in again.");
        return Promise.reject(refreshError);
      }
    }

    if (status !== 401) {
      toast.error(msg);
    }

    if (status === 500) {
      if (typeof window !== "undefined") {
        toast.error("Server is a bit tired, try again later!");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
