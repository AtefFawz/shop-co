"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSocketStore } from "@/store/socketStore";
import { useUserStore } from "@/store/userStore";
import { getApiErrorDetails } from "@/lib/errorUtils";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const useLogin = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setUser((current) => ({ ...current, [name]: value }));
  };

  const submitAction = async () => {
    setIsLoading(true);
    setError("");

    if (!user.email.trim() || !user.password) {
      setError(locale === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور." : "Please enter your email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("auth/signin", {
        email: user.email.trim().toLowerCase(),
        password: user.password,
      });
      const userData = response.data?.data?.user;
      if (!userData || typeof userData.role !== "string") {
        throw new Error(locale === "ar" ? "استجابة تسجيل الدخول غير مكتملة." : "The sign-in response was incomplete.");
      }

      useUserStore.getState().setUser(userData);
      useSocketStore.getState().setSocketReady(true);
      toast.success(locale === "ar" ? "تم تسجيل الدخول بنجاح." : "Login successful!");

      router.refresh();
      router.replace(["ADMIN", "MANAGER"].includes(userData.role.toUpperCase()) ? "/dashboard" : "/");
    } catch (caught: unknown) {
      const details = getApiErrorDetails(caught);
      const status = details.response?.status;
      const message =
        details.response?.data?.message ||
        details.response?.data?.data ||
        (locale === "ar" ? "تعذر تسجيل الدخول. حاول مرة أخرى." : "Unable to sign in. Please try again.");
      setError(String(message));
      if (status === 403 && /verify your email|verify.*email/i.test(String(message))) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(user.email.trim().toLowerCase())}`);
      }
      toast.error(String(message));
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, submitAction, handleChange };
};

export { useLogin };
