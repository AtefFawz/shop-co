"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useSocketStore } from "@/store/socketStore";

function OAuthContent() {
  const { t, direction } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const isRTL = direction === "rtl";

  const verifiedText =
    t("authVerifiedSignedIn") ||
    (isRTL ? "تم التحقق وتسجيل الدخول" : "Verified & Signed In");

  const redirectingText =
    t("authRedirectingMessage") ||
    (isRTL
      ? "جارٍ توجيهك إلى سلة مشترياتك..."
      : "Taking you back to your shopping bag...");

  const welcomeText =
    t("authWelcomeBack") || (isRTL ? "مرحباً بعودتك" : "Welcome back");

  const failedText =
    t("authGoogleFailedToast") ||
    (isRTL
      ? "فشل تسجيل الدخول. حاول مرة أخرى."
      : "Google Sign-In failed. Please try again.");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let timer: ReturnType<typeof setTimeout> | undefined;

    const restoreOverflow = () => {
      document.body.style.overflow = previousOverflow;
    };

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

      timer = setTimeout(() => {
        restoreOverflow();

        if (role === "ADMIN" || role === "MANAGER") {
          router.replace("/dashboard");
        } else {
          router.replace("/");
        }
      }, 1300);
    } else {
      restoreOverflow();
      toast.error(failedText);
      router.replace("/auth/signin");
    }

    return () => {
      if (timer) clearTimeout(timer);
      restoreOverflow();
    };
  }, [token, role, router, welcomeText, failedText]);

  const entranceTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  const quickTransition = reduceMotion ? { duration: 0 } : { duration: 0.4 };

  return (
    <main
      dir={direction}
      className="
        relative isolate flex min-h-screen items-center justify-center
        overflow-hidden bg-surface-subtle px-4 py-10
        font-sans text-primary selection:bg-action
        selection:text-on-action
      "
    >
      {/* Subtle theme-aware architectural grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-grid-subtle
          bg-[size:3.5rem_3.5rem]
          [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,black_25%,transparent_100%)]
        "
      />

      {/* Ambient brand atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute left-1/2 top-1/2
          h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2
          rounded-full bg-brand-soft opacity-60 blur-[100px]
        "
      />

      <motion.section
        aria-labelledby="oauth-title"
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={entranceTransition}
        className="
          relative z-10 w-full max-w-sm overflow-hidden
          rounded-[2rem] border border-border
          bg-surface-raised p-7 text-center
          shadow-[var(--shadow-floating)]
          sm:p-9
        "
      >
        {/* Top highlight */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-x-10 top-0
            h-px bg-gradient-to-r
            from-transparent via-accent/60 to-transparent
          "
        />

        {/* Ambient card glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -end-8 -top-8
            h-32 w-32 rounded-full
            bg-brand-soft opacity-70 blur-3xl
          "
        />

        {/* Brand */}
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={quickTransition}
          className="
            relative font-mono text-2xl font-black
            uppercase tracking-[-0.08em] text-primary
          "
        >
          SHOP.CO
        </motion.h1>

        {/* Verification animation */}
        <div
          className="relative mx-auto my-8 flex h-20 w-20 items-center justify-center"
          aria-hidden="true"
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={
              reduceMotion
                ? undefined
                : {
                    repeat: Infinity,
                    duration: 12,
                    ease: "linear",
                  }
            }
            className="
              absolute inset-0 rounded-full
              border border-dashed border-border-strong
            "
          />

          <motion.div
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.15,
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }
            }
            className="
              relative flex h-14 w-14 items-center justify-center
              rounded-2xl border border-white/10
              bg-action text-on-action
              shadow-[0_12px_30px_-8px_rgba(var(--shadow-rgb),0.30)]
            "
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.5,
                  delay: reduceMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Status message */}
        <motion.h2
          id="oauth-title"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.2 }}
          className="
            text-lg font-extrabold tracking-tight text-primary
            sm:text-xl
          "
        >
          {verifiedText}
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.3 }}
          className="mt-2 text-xs font-medium leading-relaxed text-muted"
        >
          {redirectingText}
        </motion.p>

        {/* Progress indicator */}
        <div
          className="mt-8 h-1 w-full overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-label={redirectingText}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={100}
        >
          <motion.div
            initial={reduceMotion ? false : { x: isRTL ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.3,
                    ease: [0.65, 0, 0.35, 1],
                  }
            }
            className="
              h-full w-full rounded-full
              bg-gradient-to-r from-action to-accent
            "
          />
        </div>
      </motion.section>
    </main>
  );
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="
          flex min-h-screen items-center justify-center
          bg-surface-subtle
        "
        >
          <div
            role="status"
            aria-label="Loading"
            className="
              h-8 w-8 animate-spin rounded-full
              border-2 border-focus border-t-transparent
            "
          />
        </div>
      }
    >
      <OAuthContent />
    </Suspense>
  );
}
