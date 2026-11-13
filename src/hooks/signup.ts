"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { getApiErrorDetails } from "@/lib/errorUtils";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const useSignup = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: null as File | null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | File | null) => {
    setUser((current) => ({ ...current, [name]: value }));
  };

  const signAction = async () => {
    if (!user.fullName.trim() || !user.email.trim() || !user.password) {
      setError(locale === "ar" ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields.");
      return;
    }

    if (user.avatar) {
      const allowedAvatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
      if (!allowedAvatarTypes.has(user.avatar.type) || user.avatar.size > 5 * 1024 * 1024) {
        setError(locale === "ar"
          ? "صورة الحساب يجب أن تكون JPG أو PNG أو WebP وبحجم لا يتجاوز 5 ميجابايت."
          : "The avatar must be JPG, PNG or WebP and no larger than 5 MB.");
        return;
      }
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("fullName", user.fullName.trim());
    formData.append("email", user.email.trim().toLowerCase());
    formData.append("password", user.password);
    if (user.avatar instanceof File) formData.append("avatar", user.avatar);

    try {
      const response = await api.post("auth/signup", formData);
      const email = response.data?.data?.email || user.email.trim().toLowerCase();
      if (response.data?.data?.requiresEmailVerification !== true) {
        throw new Error(locale === "ar" ? "لم يتم تأكيد إرسال رمز التحقق." : "The verification request was not confirmed.");
      }
      toast.success(locale === "ar" ? "أرسلنا رمز التحقق إلى بريدك الإلكتروني." : "A verification code has been sent to your email.");
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (caught: unknown) {
      const details = getApiErrorDetails(caught);
      const message =
        details.response?.data?.message ||
        (locale === "ar" ? "تعذر إنشاء الحساب. حاول مرة أخرى." : "Unable to create your account. Please try again.");
      setError(String(message));
      toast.error(String(message));
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, handleChange, signAction };
};

export { useSignup };
