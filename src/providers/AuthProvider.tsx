"use client";

import { useEffect } from "react";
import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.post("auth/refresh-token");

        setToken(res.data.data.token);
      } catch {
        setToken(null);
      }
    };

    init();
  }, [setToken]);

  return children;
}
