"use client";
import { useEffect } from "react";
import { useProduct } from "@/store/cardStore";
import Cookies from "js-cookie";

export const AuthWatcher = () => {
  const clearCart = useProduct((state) => state.clearCart);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      clearCart();
    }
  }, [clearCart]);

  return null;
};
