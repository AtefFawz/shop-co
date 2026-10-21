"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
  Star,
  ShieldCheck,
  Flame,
  Layers,
  Plus,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

import {
  storefrontHeroContent,
  storefrontStats,
} from "@/features/home/data/storefrontContent";
import {
  DYNAMIC_WORDS,
  EASE_OUT_EXPO,
  LOOKBOOK_EDITS,
  QUICK_TAGS,
} from "@/features/home/data/lookbookContent";
import { MagneticInteraction } from "@/features/home/components/hero/MagneticInteraction";
import { AnimatedStatValue } from "@/features/home/components/hero/AnimatedStatValue";
import { Headline3DLine } from "@/features/home/components/hero/Headline3DLine";
import { RotatingEditorialStamp } from "@/features/home/components/hero/RotatingEditorialStamp";
import { FeaturedBrandTicker } from "@/features/home/components/hero/FeaturedBrandTicker";
import Screen from "@/assets/shop/screenShop.webp";
import { useLocale } from "@/shared/i18n/LocaleProvider";

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function StorefrontHero() {
  const { t, locale } = useLocale();
  const dynamicWords = [t("heroWord1"), t("heroWord2"), t("heroWord3")];
  const quickTags = locale === "ar"
    ? [t("newArrivals"), t("tagStreetwear"), t("tagMinimalist"), t("tagWinter")]
    : QUICK_TAGS;
  const statLabels = [t("statBrands"), t("statProducts"), t("statCustomers")];
  const localizedLookbook = locale === "ar"
    ? LOOKBOOK_EDITS.map((edit, index) => ({
        ...edit,
        tag: ["مختارات ستريت لوكس", "استوديو البساطة", "أساسيات الموسم"][index],
        title: ["إطلالة أحادية واسعة", "معطف حضري بتصميم متقن", "طبقات يومية عصرية"][index],
        subtitle: ["قطن ثقيل · قصة كتف منسدلة", "نسيج مقاوم للعوامل · تصميم انسيابي", "خامة فاخرة تسمح بالتهوية · قصة مريحة"][index],
        badge: ["الأكثر رواجًا", "اختيار المحررين", "كمية محدودة"][index],
        fabric: ["تيري عضوي 480 GSM", "نسيج تقني ياباني", "مزيج سوبيما ممشّط"][index],
      }))
    : LOOKBOOK_EDITS;
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [hotspotOpen, setHotspotOpen] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);

  /* ---------------- 3D Physics Tilt & Cursor Glare Values ----------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorXPx = useMotionValue(250);
  const cursorYPx = useMotionValue(250);

  const springConfig = { damping: 22, stiffness: 150, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // True 3D perspective rotations (degrees)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [11, -11]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-13, 13]);

  // Multi-plane parallax translations
  const modelShiftX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const modelShiftY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const watermarkShiftX = useTransform(smoothX, [-0.5, 0.5], [22, -22]);
  const watermarkShiftY = useTransform(smoothY, [-0.5, 0.5], [14, -14]);

  const floatCardX = useTransform(smoothX, [-0.5, 0.5], [-22, 22]);
  const floatCardY = useTransform(smoothY, [-0.5, 0.5], [-22, 22]);

  const floatBadgeX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const floatBadgeY = useTransform(smoothY, [-0.5, 0.5], [18, -18]);

  // Dynamic studio spotlight following mouse
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${cursorXPx}px ${cursorYPx}px, rgba(255,255,255,0.65), transparent 80%)`;

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    cursorXPx.set(e.clientX - rect.left);
    cursorYPx.set(e.clientY - rect.top);
  };

  const handleStageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* ---------------- Auto-Cycling Lookbook & 3D Headline Word -------------- */
  useEffect(() => {
    if (reduceMotion) return;
    const slideTimer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % LOOKBOOK_EDITS.length);
    }, 4800);

    const wordTimer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
    }, 3200);

    return () => {
      window.clearInterval(slideTimer);
      window.clearInterval(wordTimer);
    };
  }, [reduceMotion]);

  const currentEdit = localizedLookbook[activeSlide];

  return (
    <>
      <div className="relative isolate overflow-hidden bg-app text-primary selection:bg-action selection:text-on-action">
        {/* Architectural Perspective Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_85%_75%_at_50%_45%,#000_55%,transparent_100%)]"
        />

        {/* Ambient Moving Studio Orbs */}
        <motion.div
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 30, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-surface/95 blur-[115px]"
        />
        <motion.div
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }
          }
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[2%] top-[8%] h-[440px] w-[440px] rounded-full bg-surface/85 blur-[130px]"
        />

        {/* Main Section with your Responsive class + balanced vertical spacing */}
        <section className="Responsive relative  px-4 py-10! 2xl:pt-0! lg:pb-10! ">
          <div className="grid grid-cols-1 items-center gap-x-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* ================================================================ */}
            {/* LEFT COLUMN: 3D KINETIC TYPOGRAPHY & CONVERSION (7 COLUMNS)      */}
            {/* ================================================================ */}
            <div className="relative z-20 flex flex-col items-start lg:col-span-7">
              {/* Interactive Luxury Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className="group mb-5 inline-flex items-center gap-3 rounded-full border border-border-subtle bg-surface/85 px-4 py-1.5 shadow-[0_4px_16px_rgba(var(--shadow-rgb),0.04)] backdrop-blur-md transition-all duration-300 hover:border-border hover:bg-surface"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-action" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary sm:text-[11px]">
                  {t("heroCollection")}
                </span>
                <span className="h-3 w-px bg-surface-hover" />
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary">
                  <Sparkles
                    size={12}
                    className="text-primary transition-transform duration-500 group-hover:rotate-180"
                  />
                  {t("heroLookbook")}
                </span>
              </motion.div>

              {/* 3D Kinetic Display Headline */}
              <h1 className="w-full text-[clamp(2.4rem,5vw,4.85rem)] font-black uppercase leading-[0.94] tracking-[-0.055em]">
                <Headline3DLine
                  text={t("heroLine1")}
                  delay={0.05}
                  reduceMotion={reduceMotion}
                />
                <Headline3DLine
                  text={t("heroLine2")}
                  delay={0.14}
                  reduceMotion={reduceMotion}
                />

                {/* 3D Flipping Dynamic Third Line */}
                <div className="relative mt-1 inline-flex items-center">
                  <div className="relative h-[1.08em] overflow-hidden [perspective:900px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={dynamicWords[wordIndex]}
                        initial={
                          reduceMotion
                            ? false
                            : {
                                rotateX: -85,
                                y: "60%",
                                opacity: 0,
                                filter: "blur(6px)",
                              }
                        }
                        animate={{
                          rotateX: 0,
                          y: "0%",
                          opacity: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          rotateX: 85,
                          y: "-60%",
                          opacity: 0,
                          filter: "blur(6px)",
                        }}
                        transition={{
                          duration: 0.65,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="block origin-center bg-linear-to-r from-primary via-secondary to-muted bg-clip-text text-transparent will-change-transform"
                      >
                        {dynamicWords[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Animated Laser Underline */}
                  <motion.span
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0.55,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-linear-to-r from-action via-secondary to-transparent sm:h-1"
                  />
                </div>
              </h1>

              {/* Editorial Description */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO }}
                className="mt-5 max-w-[52ch] text-pretty text-sm leading-[1.75] text-secondary sm:text-[15px] sm:leading-[1.8]"
              >
                {t("heroDescription")}
              </motion.p>

              {/* Interactive Quick Filter Pills */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT_EXPO }}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <span className="mr-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                  {t("curated")}
                </span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag}
                    href="/shop"
                    className="group relative overflow-hidden rounded-full border border-border-strong/90 bg-surface/75 px-3.5 py-1 text-[11px] font-bold text-secondary shadow-2xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-action hover:text-on-action hover:shadow-md"
                  >
                    {tag}
                  </Link>
                ))}
              </motion.div>

              {/* Magnetic 3D CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
                className="mt-7 flex flex-wrap items-center gap-4"
              >
                <MagneticInteraction
                  reduceMotion={reduceMotion}
                  strength={0.25}
                >
                  <Link
                    href="/shop"
                    className="group relative inline-flex min-h-[52px] items-center justify-center gap-4 overflow-hidden rounded-full bg-action px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-on-action shadow-[0_18px_38px_-10px_rgba(var(--shadow-rgb),0.45)] transition-all duration-300 hover:shadow-[0_24px_48px_-10px_rgba(var(--shadow-rgb),0.6)] sm:min-h-[56px] sm:px-9"
                  >
                    {/* Animated light sweep */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="relative z-10">
                      {t("shopNow")}
                    </span>
                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-surface group-hover:text-primary">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </MagneticInteraction>

                <MagneticInteraction
                  reduceMotion={reduceMotion}
                  strength={0.18}
                >
                  <Link
                    href="/shop"
                    className="group inline-flex min-h-[52px] items-center gap-3 rounded-full border border-border-strong/90 bg-surface/80 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary shadow-xs backdrop-blur-md transition-all duration-300 hover:border-border-strong hover:bg-surface hover:shadow-md sm:min-h-[56px]"
                  >
                    <span>{t("heroExplore")}</span>
                    <MoveUpRight
                      size={15}
                      className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </Link>
                </MagneticInteraction>
              </motion.div>

              {/* Live Social Proof & Avatar Stack */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48, ease: EASE_OUT_EXPO }}
                className="mt-6 flex flex-wrap items-center gap-4 text-xs text-secondary"
              >
                <div className="flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface/75 px-3.5 py-1.5 backdrop-blur-md">
                  <div className="flex -space-x-2">
                    {["S", "M", "A"].map((letter, idx) => (
                      <span
                        key={letter}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface text-[10px] font-black text-on-action ${
                          idx === 0
                            ? "bg-action"
                            : idx === 1
                              ? "bg-surface-contrast"
                              : "bg-surface-hover"
                        }`}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <div className="flex text-warning">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-extrabold text-primary">4.9/5</span>
                  <span className="text-[11px] text-muted">
                    ({t("reviewCount")})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-secondary">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>{t("heroAuthentic")}</span>
                </div>
              </motion.div>

              {/* Interactive 3D Stat Cards with Animated Counters */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.56,
                  ease: EASE_OUT_EXPO,
                }}
                className="mt-7 grid w-full grid-cols-3 gap-3 sm:gap-4"
              >
                {storefrontStats.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-3.5 shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-border-subtle hover:bg-surface hover:shadow-[0_16px_32px_rgba(var(--shadow-rgb),0.07)] sm:p-4"
                  >
                    <span className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-action/[0.03] transition-transform duration-500 group-hover:scale-150" />
                    <p className="text-[clamp(1.35rem,2.6vw,2.15rem)] font-black leading-none tracking-[-0.05em] text-primary">
                      <AnimatedStatValue rawValue={item.title} />
                    </p>
                    <p className="mt-1.5 text-[9px] font-bold uppercase leading-snug tracking-[0.1em] text-muted sm:text-[11px]">
                      {statLabels[index]}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ================================================================ */}
            {/* RIGHT COLUMN: TRUE 3D HOLOGRAPHIC STAGE (5 COLUMNS)              */}
            {/* ================================================================ */}
            <div
              ref={stageRef}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              className="relative z-10 mx-auto w-full max-w-[500px] perspective-[1400px] lg:col-span-5 lg:max-w-none mt-20"
            >
              {/* 3D Tilt Container with preserve-3d */}
              <motion.div
                style={{
                  rotateX: reduceMotion ? 0 : rotateX,
                  rotateY: reduceMotion ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full"
              >
                {/* ------------------------------------------------------------ */}
                {/* DEPTH LAYER -1 (translateZ -35px): 3D Gyroscopic Orbit Rings */}
                {/* ------------------------------------------------------------ */}
                <motion.div
                  aria-hidden="true"
                  style={{ transform: "translateZ(-35px)" }}
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{
                    duration: 42,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="pointer-events-none absolute -inset-4 z-0 m-auto aspect-square w-[98%] rounded-full border border-dashed border-border-strong/45 sm:-inset-6"
                >
                  <span className="absolute left-[14%] top-[14%] h-3 w-3 rounded-full bg-action ring-4 ring-focus/10" />
                  <span className="absolute bottom-[14%] right-[14%] h-2 w-2 rounded-full bg-surface-hover" />
                </motion.div>

                {/* ------------------------------------------------------------ */}
                {/* DEPTH LAYER 0 (Base): Main Architectural Monolith Frame      */}
                {/* ------------------------------------------------------------ */}
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, scale: 0.92, rotateY: -12 }
                  }
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative z-10 aspect-[4/4.65] w-full overflow-hidden rounded-[2.2rem] border-2 border-surface bg-app shadow-[0_35px_90px_-20px_rgba(var(--shadow-rgb),0.22)] sm:rounded-[2.5rem]"
                >
                  {/* Dynamic Mouse-Following Studio Glare */}
                  <motion.div
                    aria-hidden="true"
                    style={{ background: glareBackground }}
                    className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay transition-opacity duration-300"
                  />

                  {/* Architectural Grid Inside Frame */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[2.25rem_2.25rem]"
                  />

                  {/* Giant 3D Parallax Watermark Behind Model */}
                  <motion.div
                    aria-hidden="true"
                    style={{
                      x: watermarkShiftX,
                      y: watermarkShiftY,
                    }}
                    className="pointer-events-none absolute inset-x-0 top-12 z-10 flex flex-col items-center select-none"
                  >
                    <span className="text-[clamp(3.8rem,7vw,5.6rem)] font-black uppercase leading-none tracking-[-0.06em] text-primary/[0.065]">
                      SHOP.CO
                    </span>
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.45em] text-primary/20">
                      {locale === "ar" ? "مختارات الموسم · ٢٠٢٦" : "ARCHIVE // 2026"}
                    </span>
                  </motion.div>

                  {/* Top HUD Frame Bar */}
                  <div className="relative z-30 flex items-center justify-between px-5 pt-4 sm:px-6 sm:pt-5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentEdit.badge}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/90 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary shadow-xs backdrop-blur-md"
                      >
                        <Flame
                          size={12}
                          className="fill-primary text-primary"
                        />
                        {currentEdit.badge}
                      </motion.span>
                    </AnimatePresence>

                    <span className="rounded-full border border-border-subtle bg-surface/80 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-secondary backdrop-blur-md">
                      LOOK / {currentEdit.id}
                    </span>
                  </div>

                  {/* ---------------------------------------------------------- */}
                  {/* THE HERO MODEL IMAGE - Full Bleed Seamless Integration     */}
                  {/* ---------------------------------------------------------- */}
                  <motion.div
                    style={{
                      x: modelShiftX,
                      y: modelShiftY,
                    }}
                    className="absolute inset-0 top-6 z-20"
                  >
                    <Image
                      src={Screen}
                      alt="SHOP.CO 3D Fashion Lookbook"
                      fill
                      priority
                      quality={95}
                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 600px"
                      className="object-cover object-top mix-blend-multiply transition-transform duration-700 ease-out hover:scale-[1.04]"
                    />
                  </motion.div>

                  {/* ---------------------------------------------------------- */}
                  {/* INTERACTIVE SHOPPABLE HOTSPOT ON THE MODEL                 */}
                  {/* ---------------------------------------------------------- */}
                  <motion.div
                    animate={{
                      top: currentEdit.hotspotPos.top,
                      left: currentEdit.hotspotPos.left,
                    }}
                    transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                    className="absolute z-30"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setHotspotOpen((prev) => !prev)}
                        aria-label={t("heroToggleHotspots")}
                        className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-action text-on-action shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.35)] transition-transform duration-300 hover:scale-110"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action opacity-60" />
                        <Plus
                          size={14}
                          className={`relative z-10 transition-transform duration-300 ${
                            hotspotOpen ? "rotate-45" : "rotate-0"
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {hotspotOpen && (
                          <motion.div
                            key={currentEdit.id}
                            initial={{ opacity: 0, scale: 0.88, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 8 }}
                            transition={{ duration: 0.25 }}
                            className=" absolute left-10 -top-3 w-48 rounded-2xl border border-border bg-surface/95 p-2.5 shadow-[0_16px_36px_rgba(var(--shadow-rgb),0.18)] backdrop-blur-xl"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">
                                {currentEdit.fabric}
                              </span>
                              <span className="rounded-md bg-action px-1.5 py-0.5 text-[10px] font-black text-on-action">
                                {currentEdit.price}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-[11px] font-extrabold text-primary">
                              {currentEdit.title}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* 3D Floating Sparkle Stars */}
                  <motion.span
                    aria-hidden="true"
                    animate={
                      reduceMotion
                        ? undefined
                        : { rotate: [0, 90, 180], scale: [1, 1.2, 1] }
                    }
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute right-6 top-[20%] z-20 select-none text-3xl text-primary drop-shadow-sm sm:text-4xl"
                  >
                    ✦
                  </motion.span>

                  <motion.span
                    aria-hidden="true"
                    animate={
                      reduceMotion
                        ? undefined
                        : { rotate: [180, 90, 0], scale: [1, 1.25, 1] }
                    }
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute left-6 top-[48%] z-20 select-none text-xl text-secondary sm:text-2xl"
                  >
                    ✦
                  </motion.span>

                  {/* Bottom Studio Vignette */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-linear-to-t from-black/25 via-black/5 to-transparent"
                  />
                </motion.div>

                {/* ------------------------------------------------------------ */}
                {/* DEPTH LAYER +2 (translateZ +65px): Rotating 3D Stamp         */}
                {/* ------------------------------------------------------------ */}
                <motion.div
                  style={{
                    x: floatBadgeX,
                    y: floatBadgeY,
                    transform: "translateZ(65px)",
                  }}
                  className="pointer-events-none absolute -left-4 -top-6 z-30 hidden sm:block lg:-left-8"
                >
                  <RotatingEditorialStamp reduceMotion={reduceMotion} />
                </motion.div>

                {/* ------------------------------------------------------------ */}
                {/* DEPTH LAYER +3 (translateZ +75px): Live Fabric Pill          */}
                {/* ------------------------------------------------------------ */}
                <motion.div
                  style={{
                    x: floatBadgeX,
                    y: floatBadgeY,
                    transform: "translateZ(75px)",
                  }}
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.45,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="absolute -left-2 bottom-[24%] z-30 hidden sm:block lg:-left-7"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-surface bg-surface/95 px-3.5 py-2.5 shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.12)] backdrop-blur-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-success-soft text-success">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                        Verified Quality
                      </p>
                      <p className="text-[11px] font-bold text-primary">
                        {currentEdit.fabric}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* ------------------------------------------------------------ */}
                {/* DEPTH LAYER +4 (translateZ +90px): 3D Floating Product Card  */}
                {/* ------------------------------------------------------------ */}
                <motion.div
                  style={{
                    x: floatCardX,
                    y: floatCardY,
                    transform: "translateZ(90px)",
                  }}
                  initial={reduceMotion ? false : { opacity: 0, y: 24, x: 16 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.6,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="absolute -bottom-5 right-2 z-30 w-[min(88%,315px)] sm:right-4 lg:-right-5"
                >
                  <Link
                    href="/shop"
                    className="group block rounded-2xl border border-surface bg-surface/95 p-3.5 shadow-[0_25px_60px_rgba(var(--shadow-rgb),0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-surface"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-action text-on-action shadow-md transition-transform duration-300 group-hover:scale-105">
                        <ShoppingBag size={17} />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-black text-on-success">
                          +
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentEdit.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.22 }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
                                {currentEdit.tag}
                              </span>
                              <span className="text-xs font-black text-primary">
                                {currentEdit.price}
                              </span>
                            </div>
                            <span className="mt-0.5 block truncate text-xs font-extrabold text-primary">
                              {currentEdit.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-muted">
                              {currentEdit.subtitle}
                            </span>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-secondary transition-all duration-300 group-hover:rotate-45 group-hover:bg-action group-hover:text-on-action">
                        <MoveUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Bottom Interactive Lookbook Switcher & Animated Progress */}
              <div className="mt-7 flex items-center justify-between px-1">
                <div className="flex items-baseline gap-1.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentEdit.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl font-black tracking-[-0.05em] text-primary sm:text-2xl"
                    >
                      {currentEdit.id}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs font-bold text-muted">
                    / 0{LOOKBOOK_EDITS.length}
                  </span>
                  <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-widest text-muted sm:inline-block">
                    · Interactive 3D Stage
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {localizedLookbook.map((edit, index) => {
                    const isActive = activeSlide === index;
                    return (
                      <button
                        key={edit.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`${t("heroLookbook")}: ${edit.title}`}
                        aria-current={isActive}
                        className={`group relative h-2 overflow-hidden rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-10 bg-surface-hover"
                            : "w-2.5 bg-surface-hover hover:bg-surface-hover"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeSlideProgress3D"
                            className="absolute inset-0 rounded-full bg-action"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Luxury Infinite Brand Ticker */}
      <FeaturedBrandTicker reduceMotion={reduceMotion} />
    </>
  );
}
