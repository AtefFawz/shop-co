import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://shop-co-jfqp.vercel.app/api/",
});

api.interceptors.request.use(
  async (config: any) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

// Handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.data || "Internal Server Error";
    toast.error(msg);
    return Promise.reject(error);
  },
);
api.interceptors.response.use(
  // src/lib/api.ts
  (response) => response,

  (error: any) => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (error.response && error.response.status === 401) {
      if (currentPath !== "/user/signin") {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("role", { path: "/" });
        window.location.href = "/user/signin";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
