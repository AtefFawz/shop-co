"use client";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const useLogin = () => {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setUser({ ...user, [name]: value });
  };

  const submitAction = async () => {
    setIsLoading(true);
    setError("");

    if (!user.email || !user.password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("auth/signin", user);
      const { token, user: userData } = response.data.data;

      if (token) {
        const isProd = process.env.NODE_ENV === "production";

        Cookies.set("token", token, {
          path: "/",
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
        });

        Cookies.set("role", userData.role, {
          path: "/",
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
        });

        toast.success("Login successful!");

        if (userData.role === "ADMIN" || userData.role === "MANAGER") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Signin handle error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.data ||
        "An error occurred during signin. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, submitAction, handleChange };
};

export { useLogin };
