"use client";
import { useEffect } from "react";
import { useProduct } from "@/store/cardStore";
import Cookies from "js-cookie";

export const AuthWatcher = () => {
  const clearCart = useProduct((state) => state.clearCart);

  useEffect(() => {
    const role = Cookies.get("role");

    if (!role) {
      clearCart();
    }
  }, [clearCart]);

  return null;
};
