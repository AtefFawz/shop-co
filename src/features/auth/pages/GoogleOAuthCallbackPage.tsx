"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useSocketStore } from "@/store/socketStore";
import { motion } from "framer-motion";

function OAuthContent() {
  const { t, direction } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  // تأمين نصوص الترجمة بـ Fallback ثابت في حال تأخر مزود اللغة في التحميل
  const verifiedText =
    t("authVerifiedSignedIn") ||
    (direction === "rtl" ? "تم التحقق وتسجيل الدخول" : "Verified & Signed In");
  const redirectingText =
    t("authRedirectingMessage") ||
    (direction === "rtl"
      ? "جارٍ توجيهك إلى سلة مشترياتك..."
      : "Taking you back to your shopping bag...");
  const welcomeText =
    t("authWelcomeBack") ||
    (direction === "rtl" ? "مرحباً بعودتك" : "Welcome back");
  const failedText =
    t("authGoogleFailedToast") ||
    (direction === "rtl"
      ? "فشل تسجيل الدخول. حاول مرة أخرى."
      : "Google Sign-In failed. Please try again.");

  useEffect(() => {
    // إخفاء الـ Scroll مؤقتاً أثناء التحويل لمنع اهتزاز الصفحة
    document.body.style.overflow = "hidden";

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
      toast.success(welcomeText);

      const timer = setTimeout(() => {
        document.body.style.overflow = "auto";
        if (role === "ADMIN" || role === "MANAGER") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 1300);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
      toast.error(failedText);
      router.push("/auth/signin");
    }
  }, [token, role, router, welcomeText, failedText]);

  return (
    <div
      dir={direction}
      className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 font-sans selection:bg-action selection:text-on-action"
    >
      {/* 3D Glassmorphism Architectural Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-8 text-center shadow-[0_24px_70px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl"
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-neutral-100 blur-2xl" />

        {/* Brand Header */}
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="font-mono text-2xl font-black uppercase tracking-tighter text-[#111111]"
        >
          SHOP.CO
        </motion.h1>

        {/* Minimalist Editorial Checkmark & Ring (3D Layered) */}
        <div className="relative mx-auto my-7 flex h-20 w-20 items-center justify-center">
          {/* Subtle Rotating Outline */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-neutral-300"
          />

          {/* Solid Black Action Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.3)]"
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

        {/* Translated Text Area (With Fallbacks) */}
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-black uppercase tracking-tight text-[#111111]"
        >
          {verifiedText}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1.5 text-[11px] font-bold text-neutral-500"
        >
          {redirectingText}
        </motion.p>

        {/* High-End Minimalist Progress Line */}
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-[#F4F3F4]">
          <motion.div
            initial={{ x: direction === "rtl" ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            className="h-full w-full rounded-full bg-[#111111]"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
        </div>
      }
    >
      <OAuthContent />
    </Suspense>
  );
}
