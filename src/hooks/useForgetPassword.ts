"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export type ResetStep = 1 | 2 | 3;

export const useForgetPassword = () => {
  const router = useRouter();

  const [step, setStep] = useState<ResetStep>(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "otp") {
      setFormData((prev) => ({
        ...prev,
        otp: value.replace(/\D/g, "").slice(0, 6),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (step === 1) {
        await api.post("auth/forget-password", {
          email: formData.email,
        });
        setStep(2);
      } else if (step === 2) {
        if (formData.otp.length !== 6) {
          setError("Please enter a valid 6-digit OTP");
          setIsLoading(false);
          return;
        }
        await api.post("auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        setStep(3);
      } else if (step === 3) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        await api.post("auth/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        });
        router.push("/auth/signin");
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.errorText ||
        err.response?.data?.message ||
        "Something went wrong, please try again.";

      setError(backendError);

      if (
        backendError.toLowerCase().includes("expired") ||
        backendError.toLowerCase().includes("too many")
      ) {
        setFormData((prev) => ({
          ...prev,
          otp: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    step,
    setStep,
    isLoading,
    error,
    setError,
    handleChange,
    submitAction,
  };
};
