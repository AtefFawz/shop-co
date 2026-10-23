"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const SESSION_KEY = "shopco-intro-seen-v1";
const INTRO_DURATION = 1850;

/** A one-time, skippable brand reveal shown only on the storefront landing page. */
export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  useEffect(() => {
    // Wait until the preference has been resolved before consuming the session key.
    if (reduceMotion === null || reduceMotion) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "seen") return;
      window.sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      // Storage may be disabled; the animation still works for this visit.
    }

    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    const timeout = window.setTimeout(() => setIsVisible(false), INTRO_DURATION);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsVisible(false);
        return;
      }

      // The intro is a modal layer with one actionable control; keep keyboard
      // focus inside it until the reveal exits.
      if (event.key === "Tab") {
        event.preventDefault();
        skipButtonRef.current?.focus();
      }
    };

    const focusFrame = window.requestAnimationFrame(() => skipButtonRef.current?.focus());
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isArabic ? "مرحبًا بك في شوب كو" : "Welcome to SHOP.CO"}
          dir={isArabic ? "rtl" : "ltr"}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#111210] px-5 text-[#f4f1e9]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 aspect-square w-[min(86vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -22 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 aspect-square w-[min(68vw,580px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9cad8d]/25"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(156,173,141,0.12),transparent_58%)]" />
            <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:56px_56px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center"
          >
            <div className="mb-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8c5a8] sm:text-xs">
              <Sparkles size={13} strokeWidth={1.5} />
              <span>{isArabic ? "اختيارات الموسم · ٢٠٢٦" : "THE SEASON EDIT · 2026"}</span>
            </div>

            <div className="overflow-hidden py-2">
              <motion.h2
                initial={{ y: "115%", rotateX: -40 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-[clamp(3.2rem,12vw,9.5rem)] leading-[0.82] tracking-[-0.085em]"
              >
                SHOP.CO<span className="align-top text-[0.22em] tracking-normal">®</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6 }}
              className="mt-7 max-w-xl text-xs leading-7 text-white/65 sm:text-sm"
            >
              {isArabic
                ? "أسلوبك، بطريقتك. اكتشف قطعًا مختارة بعناية لتعبّر عنك."
                : "A considered wardrobe. Distinctive pieces. A style that is entirely yours."}
            </motion.p>

            <div className="mt-10 h-px w-full max-w-xs overflow-hidden bg-white/15">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.45, delay: 0.1, ease: "linear" }}
                className="block h-full origin-left bg-[#b8c5a8]"
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-3 text-[9px] font-medium uppercase tracking-[0.3em] text-white/40"
            >
              {isArabic ? "اكتشف المجموعة" : "DISCOVER THE COLLECTION"}
            </motion.span>
          </motion.div>

          <button
            type="button"
            ref={skipButtonRef}
            onClick={() => setIsVisible(false)}
            className="absolute bottom-6 end-5 z-20 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8c5a8] sm:bottom-8 sm:end-8"
          >
            <span>{isArabic ? "تخطّي المقدمة" : "Skip intro"}</span>
            <ArrowUpRight size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
