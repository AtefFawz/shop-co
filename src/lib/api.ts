import axios from "axios";
// @ts-ignore: no declaration file for 'js-cookie'
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api/backend/",
  validateStatus: (status) => status >= 200 && status < 400,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const msg = error.response?.data?.message || "Something went wrong";
    console.log(error);
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/signin") ||
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/api/backend/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data?.data?.token;

        if (newAccessToken) {
          Cookies.set("token", newAccessToken, { path: "/" });
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("🚨 Refresh Token Expired - Clearing session...");

        Cookies.remove("token", { path: "/" });

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/signin";
        }

        return Promise.reject(refreshError);
      }
    }

    //
    if (
      axios.isCancel(error) ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      return Promise.reject(error);
    }
    if (status !== 401 && typeof window !== "undefined") {
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

export default api;
