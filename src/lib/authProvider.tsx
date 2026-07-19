"use client";
// import { cookies } from "next/headers";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import api from "./api";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setToken = useAuthStore((state) => state.setToken);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "api/auth/refresh-token",
        );

        console.log(res);
        setToken(res.data.accessToken);
      } catch {
        setToken(null);
      }
    };

    init();
  }, []);

  return children;
}
