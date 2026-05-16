import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://shop-co-jfqp.vercel.app/api/",
  withCredentials: true,
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

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired. Fetching a new one...");

        const res = await axios.post(
          `${api.defaults.baseURL}auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data?.data?.token;

        Cookies.set("token", newAccessToken, { path: "/" });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log(
          "Token refreshed successfully! Retrying original request...",
        );

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed. Redirecting to signin...");

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/auth/signin"
        ) {
          Cookies.remove("token", { path: "/" });
          Cookies.remove("role", { path: "/" });
          window.location.href = "/auth/signin";
        }

        toast.error("Your session has expired. Please sign in again.");
        return Promise.reject(refreshError);
      }
    }

    toast.error(msg);

    if (status === 500) {
      if (typeof window !== "undefined") {
        toast.error("Server is a bit tired, try again later!");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
