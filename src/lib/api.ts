import axios from "axios";
// @ts-ignore: no declaration file for 'js-cookie'
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api/backend/",
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
        const res = await axios.post(
          "/api/backend/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data?.data?.token;

        Cookies.set("token", newAccessToken, { path: "/" });

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("🚨  refresh Token is expired login...", refreshError);
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    if (status !== 401) {
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

export default api;
