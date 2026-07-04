import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "../lib/api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const useSignup = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setUser({ ...user, [name]: value });
  };

  const signAction = async () => {
    if (!user.fullName || !user.email || !user.password) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/signup", user);

      const token = res.data?.data?.token || res.data?.token;
      const userData = res.data?.data?.user || res.data?.user;

      if (token) {
        const isProd = process.env.NODE_ENV === "production";

        Cookies.set("token", token, {
          path: "/",
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
        });

        if (userData?.role) {
          Cookies.set("role", userData.role, {
            path: "/",
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
          });
        }

        toast.success("Account created successfully!");

        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.data ||
        "An error occurred during signup. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, handleChange, signAction };
};

export { useSignup };
