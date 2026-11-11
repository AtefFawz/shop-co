"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const LAUNCH_SESSION_KEY = "shopco-pwa-launch-v2";
const LAUNCH_DURATION = 1550;

/** A short, standalone-only cold-start reveal for the installed SHOP.CO app. */
export default function PWAAppLaunchScreen() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (!isStandalone) return;

    try {
      if (window.sessionStorage.getItem(LAUNCH_SESSION_KEY) === "seen") return;
      window.sessionStorage.setItem(LAUNCH_SESSION_KEY, "seen");
    } catch {
      // A restricted storage context should not prevent the launch animation.
    }

    const startFrame = window.requestAnimationFrame(() => setVisible(true));
    const timeout = window.setTimeout(() => {
      setVisible(false);
      delete document.documentElement.dataset.pwaLaunch;
    }, reduceMotion ? 450 : LAUNCH_DURATION);

    return () => {
      window.cancelAnimationFrame(startFrame);
      window.clearTimeout(timeout);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          data-pwa-launch-screen="true"
          aria-label={isArabic ? "جاري تشغيل SHOP.CO" : "Starting SHOP.CO"}
          dir={isArabic ? "rtl" : "ltr"}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.42, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0b1020] px-6 text-white"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-[#6864ed]/20 blur-[100px]" />
            <div className="absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-[#277de5]/20 blur-[110px]" />
            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.65)_1px,transparent_1px)] [background-size:44px_44px]" />
            <motion.div
              className="absolute left-1/2 top-1/2 aspect-square w-[min(82vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
              animate={reduceMotion ? undefined : { rotate: 360, scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute left-1/2 top-1/2 aspect-square w-[min(68vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8f9cff]/15" />
          </div>

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(9px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center text-center"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.78, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-7 h-28 w-28 overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-1 shadow-[0_20px_90px_rgba(94,93,240,0.28)]"
            >
              <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-[#8882ff]/35 via-transparent to-[#3688ee]/30" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/shopco-512.png"
                alt=""
                width={112}
                height={112}
                className="relative h-full w-full rounded-[1.65rem] object-cover"
              />
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="text-[clamp(2.7rem,12vw,4rem)] font-black leading-none tracking-[-0.075em]"
            >
              SHOP<span className="text-[#8a8cff]">.</span>CO
            </motion.p>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              className="mt-4 text-[10px] font-bold uppercase tracking-[0.34em] text-white/55 sm:text-xs"
            >
              {isArabic ? "أسلوبك يبدأ من هنا" : "YOUR STYLE STARTS HERE"}
            </motion.p>

            <div className="mt-12 h-[3px] w-36 overflow-hidden rounded-full bg-white/10">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduceMotion ? 0.25 : 1.2, delay: 0.12, ease: "easeInOut" }}
                className="block h-full origin-left rounded-full bg-gradient-to-r from-[#8b78ff] to-[#48a4ff]"
              />
            </div>
            <p className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-white/35">
              {isArabic ? "جاري تجهيز تجربتك" : "PREPARING YOUR EXPERIENCE"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
