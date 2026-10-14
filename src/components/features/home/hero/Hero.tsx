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

import { itemShop, items, brands } from "@/data/shop/Shop";
import Screen from "@/assets/shop/screenShop.webp";

/* -------------------------------------------------------------------------- */
/*                               CONFIG & DATA                                */
/* -------------------------------------------------------------------------- */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const DYNAMIC_WORDS = ["YOUR STYLE.", "YOUR VIBE.", "YOUR ERA."];

const LOOKBOOK_EDITS = [
  {
    id: "01",
    tag: "Street Luxe Edit",
    title: "Oversized Monochrome Set",
    subtitle: "Heavyweight cotton · Tailored drop-shoulder",
    price: "$185.00",
    badge: "Trending #1",
    hotspotPos: { top: "38%", left: "58%" },
    fabric: "480GSM Organic Terry",
  },
  {
    id: "02",
    tag: "Minimalist Studio",
    title: "Structured Urban Outerwear",
    subtitle: "Weather-resistant weave · Clean silhouette",
    price: "$240.00",
    badge: "Editor's Pick",
    hotspotPos: { top: "48%", left: "36%" },
    fabric: "Japanese Tech Twill",
  },
  {
    id: "03",
    tag: "Season Essentials",
    title: "Contemporary Everyday Layer",
    subtitle: "Breathable luxury fabric · Relaxed fit",
    price: "$145.00",
    badge: "Limited Drop",
    hotspotPos: { top: "34%", left: "48%" },
    fabric: "Combed Supima Blend",
  },
];

const QUICK_TAGS = ["New Arrivals", "Streetwear", "Minimalist", "Winter '26"];

/* -------------------------------------------------------------------------- */
/*                            MAGNETIC 3D WRAPPER                             */
/* -------------------------------------------------------------------------- */

function Magnetic({
  children,
  strength = 0.28,
  reduceMotion,
}: {
  children: React.ReactNode;
  strength?: number;
  reduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         ANIMATED NUMBER COUNTER                            */
/* -------------------------------------------------------------------------- */

function AnimatedStatValue({ rawValue }: { rawValue: string }) {
  const numericMatch = rawValue.match(/[\d,]+/);
  const suffix = rawValue.replace(/[\d,]+/, "");
  const targetNumber = numericMatch
    ? parseInt(numericMatch[0].replace(/,/g, ""), 10)
    : 0;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!targetNumber) return;
    let startTime: number | null = null;
    const duration = 1800;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * targetNumber));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [targetNumber]);

  if (!targetNumber) return <>{rawValue}</>;

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                         3D KINETIC HEADLINE LINE                           */
/* -------------------------------------------------------------------------- */

function Headline3DLine({
  text,
  delay = 0,
  reduceMotion,
}: {
  text: string;
  delay?: number;
  reduceMotion: boolean | null;
}) {
  return (
    <span className="block overflow-hidden whitespace-nowrap pb-[0.04em] [perspective:800px]">
      <motion.span
        initial={
          reduceMotion
            ? false
            : { y: "115%", rotateX: -65, opacity: 0, filter: "blur(6px)" }
        }
        animate={{ y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: reduceMotion ? 0 : 0.95,
          delay: reduceMotion ? 0 : delay,
          ease: EASE_OUT_EXPO,
        }}
        className="block origin-bottom will-change-transform text-[#111111]"
      >
        {text}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                       ROTATING 3D EDITORIAL STAMP                          */
/* -------------------------------------------------------------------------- */

function RotatingEditorialStamp({
  reduceMotion,
}: {
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/80 bg-white/85 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:h-28 sm:w-28">
      <motion.svg
        viewBox="0 0 100 100"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="h-full w-full p-1.5"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="fill-[#111111] text-[9.2px] font-black uppercase tracking-[0.21em]">
          <textPath href="#circlePath">
            SHOP.CO STUDIO • EDITION 2026 •
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white shadow-md">
        <Sparkles size={15} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         LUXURY 3D BRAND TICKER                             */
/* -------------------------------------------------------------------------- */

function BrandTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  const list = brands.filter(Boolean);
  if (!list.length) return null;

  return (
    <div
      aria-label="Featured luxury partners"
      className="relative z-20 overflow-hidden border-y border-white/10 bg-[#0A0A0A] py-4 text-white"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent sm:w-32" />

      <div className="Responsive mx-auto flex items-center gap-6 px-4 py-3 sm:px-8 lg:gap-10">
        <div className="relative z-20 hidden shrink-0 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
            Verified Houses
          </span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`flex w-max items-center ${
              reduceMotion ? "" : "animate-luxury-marquee"
            }`}
          >
            {[0, 1, 2].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy > 0 ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {list.map((brand, index) => (
                  <div
                    key={`${copy}-${index}-${brand}`}
                    className="group flex shrink-0 items-center"
                  >
                    <span className="cursor-default px-6 text-xl font-black uppercase tracking-[-0.03em] text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:text-white sm:px-9 sm:text-2xl lg:text-[26px]">
                      {brand}
                    </span>
                    <span className="text-xs text-white/20 transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 group-hover:text-white">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes luxury-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-luxury-marquee {
          animation: luxury-marquee 30s linear infinite;
        }
        @media (hover: hover) {
          .animate-luxury-marquee:hover {
            animation-play-state: paused;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-luxury-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function Hero() {
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

  const currentEdit = LOOKBOOK_EDITS[activeSlide];

  return (
    <>
      <div className="relative isolate overflow-hidden bg-[#F2F0F1] text-[#111111] selection:bg-[#111111] selection:text-white">
        {/* Architectural Perspective Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_85%_75%_at_50%_45%,#000_55%,transparent_100%)]"
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
          className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-white/95 blur-[115px]"
        />
        <motion.div
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }
          }
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[2%] top-[8%] h-[440px] w-[440px] rounded-full bg-white/85 blur-[130px]"
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
                className="group mb-5 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/85 px-4 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:border-black/25 hover:bg-white"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#111111]" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-neutral-900 sm:text-[11px]">
                  New Collection · 2026
                </span>
                <span className="h-3 w-px bg-neutral-300" />
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600">
                  <Sparkles
                    size={12}
                    className="text-neutral-900 transition-transform duration-500 group-hover:rotate-180"
                  />
                  3D Lookbook
                </span>
              </motion.div>

              {/* 3D Kinetic Display Headline */}
              <h1 className="w-full text-[clamp(2.4rem,5vw,4.85rem)] font-black uppercase leading-[0.94] tracking-[-0.055em]">
                <Headline3DLine
                  text="Find clothes"
                  delay={0.05}
                  reduceMotion={reduceMotion}
                />
                <Headline3DLine
                  text="that match"
                  delay={0.14}
                  reduceMotion={reduceMotion}
                />

                {/* 3D Flipping Dynamic Third Line */}
                <div className="relative mt-1 inline-flex items-center">
                  <div className="relative h-[1.08em] overflow-hidden [perspective:900px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={DYNAMIC_WORDS[wordIndex]}
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
                        className="block origin-center bg-linear-to-r from-neutral-900 via-neutral-500 to-neutral-400 bg-clip-text text-transparent will-change-transform"
                      >
                        {DYNAMIC_WORDS[wordIndex]}
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
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-linear-to-r from-[#111111] via-neutral-500 to-transparent sm:h-1"
                  />
                </div>
              </h1>

              {/* Editorial Description */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO }}
                className="mt-5 max-w-[52ch] text-pretty text-sm leading-[1.75] text-neutral-600 sm:text-[15px] sm:leading-[1.8]"
              >
                {itemShop.description}
              </motion.p>

              {/* Interactive Quick Filter Pills */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT_EXPO }}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <span className="mr-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">
                  Curated:
                </span>
                {QUICK_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href="/shop"
                    className="group relative overflow-hidden rounded-full border border-neutral-300/90 bg-white/75 px-3.5 py-1 text-[11px] font-bold text-neutral-700 shadow-2xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:bg-[#111111] hover:text-white hover:shadow-md"
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
                <Magnetic reduceMotion={reduceMotion} strength={0.25}>
                  <Link
                    href="/shop"
                    className="group relative inline-flex min-h-[52px] items-center justify-center gap-4 overflow-hidden rounded-full bg-[#111111] px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_38px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.6)] sm:min-h-[56px] sm:px-9"
                  >
                    {/* Animated light sweep */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="relative z-10">{itemShop.btnText}</span>
                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </Magnetic>

                <Magnetic reduceMotion={reduceMotion} strength={0.18}>
                  <Link
                    href="/shop"
                    className="group inline-flex min-h-[52px] items-center gap-3 rounded-full border border-neutral-300/90 bg-white/80 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-neutral-900 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-black hover:bg-white hover:shadow-md sm:min-h-[56px]"
                  >
                    <span>Explore Lookbook</span>
                    <MoveUpRight
                      size={15}
                      className="text-neutral-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                    />
                  </Link>
                </Magnetic>
              </motion.div>

              {/* Live Social Proof & Avatar Stack */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48, ease: EASE_OUT_EXPO }}
                className="mt-6 flex flex-wrap items-center gap-4 text-xs text-neutral-600"
              >
                <div className="flex items-center gap-2.5 rounded-full border border-black/5 bg-white/75 px-3.5 py-1.5 backdrop-blur-md">
                  <div className="flex -space-x-2">
                    {["S", "M", "A"].map((letter, idx) => (
                      <span
                        key={letter}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-black text-white ${
                          idx === 0
                            ? "bg-neutral-900"
                            : idx === 1
                              ? "bg-neutral-700"
                              : "bg-neutral-500"
                        }`}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-extrabold text-neutral-900">4.9/5</span>
                  <span className="text-[11px] text-neutral-500">
                    (12.4k+ reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
                  <ShieldCheck size={16} className="text-neutral-900" />
                  <span>100% Authentic Luxury</span>
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
                {items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/90 bg-white/70 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:bg-white hover:shadow-[0_16px_32px_rgba(0,0,0,0.07)] sm:p-4"
                  >
                    <span className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-black/[0.03] transition-transform duration-500 group-hover:scale-150" />
                    <p className="text-[clamp(1.35rem,2.6vw,2.15rem)] font-black leading-none tracking-[-0.05em] text-[#111111]">
                      <AnimatedStatValue rawValue={item.title} />
                    </p>
                    <p className="mt-1.5 text-[9px] font-bold uppercase leading-snug tracking-[0.1em] text-neutral-500 sm:text-[11px]">
                      {item.description}
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
                  className="pointer-events-none absolute -inset-4 z-0 m-auto aspect-square w-[98%] rounded-full border border-dashed border-neutral-400/45 sm:-inset-6"
                >
                  <span className="absolute left-[14%] top-[14%] h-3 w-3 rounded-full bg-[#111111] ring-4 ring-black/10" />
                  <span className="absolute bottom-[14%] right-[14%] h-2 w-2 rounded-full bg-neutral-500" />
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
                  className="relative z-10 aspect-[4/4.65] w-full overflow-hidden rounded-[2.2rem] border-2 border-white bg-[#F2F0F1] shadow-[0_35px_90px_-20px_rgba(0,0,0,0.22)] sm:rounded-[2.5rem]"
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
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[2.25rem_2.25rem]"
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
                    <span className="text-[clamp(3.8rem,7vw,5.6rem)] font-black uppercase leading-none tracking-[-0.06em] text-black/[0.065]">
                      SHOP.CO
                    </span>
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.45em] text-black/20">
                      ARCHIVE // 2026
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-neutral-900 shadow-xs backdrop-blur-md"
                      >
                        <Flame size={12} className="fill-black text-black" />
                        {currentEdit.badge}
                      </motion.span>
                    </AnimatePresence>

                    <span className="rounded-full border border-black/5 bg-white/80 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-neutral-700 backdrop-blur-md">
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
                        aria-label="Toggle outfit hotspot details"
                        className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#111111] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-110"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-60" />
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
                            className=" absolute left-10 -top-3 w-48 rounded-2xl border border-white/90 bg-white/95 p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">
                                {currentEdit.fabric}
                              </span>
                              <span className="rounded-md bg-[#111111] px-1.5 py-0.5 text-[10px] font-black text-white">
                                {currentEdit.price}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-[11px] font-extrabold text-neutral-900">
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
                    className="pointer-events-none absolute right-6 top-[20%] z-20 select-none text-3xl text-[#111111] drop-shadow-sm sm:text-4xl"
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
                    className="pointer-events-none absolute left-6 top-[48%] z-20 select-none text-xl text-neutral-800 sm:text-2xl"
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
                  <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-neutral-400">
                        Verified Quality
                      </p>
                      <p className="text-[11px] font-bold text-neutral-900">
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
                    className="group block rounded-2xl border border-white bg-white/95 p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        <ShoppingBag size={17} />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
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
                              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">
                                {currentEdit.tag}
                              </span>
                              <span className="text-xs font-black text-[#111111]">
                                {currentEdit.price}
                              </span>
                            </div>
                            <span className="mt-0.5 block truncate text-xs font-extrabold text-neutral-900">
                              {currentEdit.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-neutral-500">
                              {currentEdit.subtitle}
                            </span>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#111111] group-hover:text-white">
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
                      className="text-xl font-black tracking-[-0.05em] text-[#111111] sm:text-2xl"
                    >
                      {currentEdit.id}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs font-bold text-neutral-400">
                    / 0{LOOKBOOK_EDITS.length}
                  </span>
                  <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-widest text-neutral-400 sm:inline-block">
                    · Interactive 3D Stage
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {LOOKBOOK_EDITS.map((edit, index) => {
                    const isActive = activeSlide === index;
                    return (
                      <button
                        key={edit.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Select lookbook ${edit.title}`}
                        aria-current={isActive}
                        className={`group relative h-2 overflow-hidden rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-10 bg-neutral-300"
                            : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeSlideProgress3D"
                            className="absolute inset-0 rounded-full bg-[#111111]"
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
      <BrandTicker reduceMotion={reduceMotion} />
    </>
  );
}
