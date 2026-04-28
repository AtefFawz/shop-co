"use client";
import { useEffect } from "react";
import { useProduct } from "@/store/cardStore";

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;)\\s*${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const AuthWatcher = () => {
  const clearCart = useProduct((state) => state.clearCart);

  useEffect(() => {
    const token = getCookieValue("token");
    if (!token) {
      clearCart();
      localStorage.clear(); // Delete Local Storage
    }
  }, [clearCart]);

  return null;
};
