import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://shop-co-jfqp.vercel.app/api/",
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
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "Something went wrong";

    toast.error(msg);
    if (status === 401) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/signin"
      ) {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("role", { path: "/" });
        window.location.href = "/auth/signin";
      }
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
