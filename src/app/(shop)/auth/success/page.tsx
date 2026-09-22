"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSocketStore } from "@/store/socketStore";
import { motion } from "framer-motion";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  useEffect(() => {
    if (token && role) {
      const isProd = process.env.NODE_ENV === "production";

      Cookies.set("token", token, {
        path: "/",
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });

      Cookies.set("role", role, {
        path: "/",
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });

      useSocketStore.getState().setSocketReady(true);
      toast.success("Login successful!");

      const timer = setTimeout(() => {
        if (role === "ADMIN" || role === "MANAGER") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      toast.error("Google authentication failed");
      router.push("/auth/signin");
    }
  }, [token, role, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F0F1] px-4 font-sans selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-black/5 bg-white p-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
      >
        {/* Brand Header */}
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-black uppercase tracking-tighter text-black"
        >
          SHOP.CO
        </motion.h1>

        {/* Minimalist Editorial Checkmark & Ring */}
        <div className="relative mx-auto my-7 flex h-20 w-20 items-center justify-center">
          {/* Subtle Rotating Outline */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-neutral-300"
          />

          {/* Solid Black Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg shadow-black/15"
          >
            <svg
              className="h-7 w-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Text Area matching the site's typography */}
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-extrabold uppercase tracking-tight text-black"
        >
          Verified & Signed In
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1.5 text-xs font-medium text-neutral-500"
        >
          Taking you back to your shopping cart...
        </motion.p>

        {/* High-End Minimalist Progress Line */}
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="h-full w-full rounded-full bg-black"
          />
        </div>
      </motion.div>
    </div>
  );
}
