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
  Sparkles,
  Star,
  ShieldCheck,
  ShoppingBag,
  Layers,
  Sun,
  Moon,
  Cpu,
  RotateCcw,
  Check,
  Eye,
} from "lucide-react";

import { itemShop, items, brands } from "@/data/shop/Shop";
import Screen from "@/assets/shop/screenShop.webp";

/* -------------------------------------------------------------------------- */
/*                                TYPES & CONFIG                              */
/* -------------------------------------------------------------------------- */

type StudioMode = "light" | "noir" | "blueprint";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

const DYNAMIC_HEADLINES = ["YOUR STYLE.", "YOUR VISION.", "YOUR LEGACY."];

const ARCHIVE_PIECES = [
  {
    id: "01",
    code: "ARC-01",
    name: "Structured Noir Denim Jacket",
    category: "Outerwear Atelier",
    price: "$240",
    stock: "In Stock • Milan",
    spec: "14oz Japanese Selvedge",
    pin: { x: "62%", y: "44%" },
    glow: "rgba(59, 130, 246, 0.22)",
    accentHex: "#3B82F6",
  },
  {
    id: "02",
    code: "ARC-02",
    name: "Heavyweight Studio Hoodie",
    category: "Core Essentials",
    price: "$165",
    stock: "Limited • Tokyo",
    spec: "480GSM Organic Cotton",
    pin: { x: "48%", y: "34%" },
    glow: "rgba(16, 185, 129, 0.22)",
    accentHex: "#10B981",
  },
  {
    id: "03",
    code: "ARC-03",
    name: "Titanium Aviator Frames",
    category: "Optical Archive",
    price: "$190",
    stock: "Few Left • Paris",
    spec: " Hand-Polished Beta Titanium",
    pin: { x: "52%", y: "18%" },
    glow: "rgba(245, 158, 11, 0.24)",
    accentHex: "#F59E0B",
  },
];

/* -------------------------------------------------------------------------- */
/*                     ICONIC SHOP.CO 4-POINT VECTOR STAR                     */
/* -------------------------------------------------------------------------- */

function FourPointStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 104 104"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                  5-COLUMN ARCHITECTURAL CURTAIN INTRO                      */
/* -------------------------------------------------------------------------- */

function ArchitecturalCurtain({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1250);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] grid grid-cols-5 overflow-hidden"
    >
      {[0, 1, 2, 3, 4].map((col) => (
        <motion.div
          key={col}
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{
            duration: 0.85,
            delay: 0.25 + col * 0.065,
            ease: CURTAIN_EASE,
          }}
          className="relative flex h-full flex-col justify-between border-r border-white/10 bg-[#08080A] p-4 text-white/30"
        >
          <span className="font-mono text-[9px] font-bold tracking-[0.2em]">
            0{col + 1} // ATELIER
          </span>
          {col === 2 && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="self-center whitespace-nowrap font-mono text-xs font-black uppercase tracking-[0.35em] text-white"
            >
              SHOP.CO // 2026
            </motion.div>
          )}
          <span className="font-mono text-[8px] tracking-widest">
            SYS.READY
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ANIMATED NUMBER COUNTER                          */
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
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
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
/*                          LUXURY 3D BRAND TICKER                            */
/* -------------------------------------------------------------------------- */

function BrandTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  const list = brands.filter(Boolean);
  if (!list.length) return null;

  return (
    <div
      aria-label="Featured luxury partners"
      className="relative z-20 overflow-hidden border-y border-white/10 bg-[#08080A] py-4 text-white sm:py-5"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#08080A] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#08080A] to-transparent sm:w-32" />

      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-6 px-4 sm:px-8">
        <div className="relative z-20 hidden shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-md lg:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[9.5px] font-black uppercase tracking-[0.2em] text-white/80">
            OFFICIAL HOUSES
          </span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`flex w-max items-center ${
              reduceMotion ? "" : "animate-shopco-marquee"
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
                    <span className="cursor-default px-6 text-lg font-black uppercase tracking-[-0.03em] text-white/55 transition-all duration-300 group-hover:scale-105 group-hover:text-white sm:px-10 sm:text-2xl lg:text-[26px]">
                      {brand}
                    </span>
                    <FourPointStar className="h-3 w-3 text-white/20 transition-transform duration-500 group-hover:rotate-90 group-hover:text-amber-400" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shopco-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-shopco-marquee {
          animation: shopco-marquee 28s linear infinite;
        }
        @media (hover: hover) {
          .animate-shopco-marquee:hover {
            animation-play-state: paused;
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

  // Interactive Engineering States
  const [studioMode, setStudioMode] = useState<StudioMode>("light");
  const [activePieceIdx, setActivePieceIdx] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [curtainActive, setCurtainActive] = useState(false);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [coords, setCoords] = useState({ x: 240, y: 180 });

  const stageRef = useRef<HTMLDivElement>(null);

  // Trigger Curtain once per session
  useEffect(() => {
    if (reduceMotion) return;
    const seen = sessionStorage.getItem("shopco_curtain_v2");
    if (!seen) {
      setCurtainActive(true);
      sessionStorage.setItem("shopco_curtain_v2", "1");
    }
  }, [reduceMotion]);

  // Auto-cycle dynamic headline word
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_HEADLINES.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  /* ---------------- Smooth Spring Physics & Mouse Tracking ---------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(200);
  const cursorY = useMotionValue(200);

  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 22, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 22, mass: 0.5 });

  const lensX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const lensY = useSpring(cursorY, { stiffness: 300, damping: 28 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const modelParallaxX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const modelParallaxY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${lensX}px ${lensY}px, rgba(255,255,255,0.45), transparent 80%)`;

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xPx = Math.round(e.clientX - rect.left);
    const yPx = Math.round(e.clientY - rect.top);

    cursorX.set(xPx);
    cursorY.set(yPx);
    setCoords({ x: xPx, y: yPx });

    if (!reduceMotion) {
      mouseX.set(xPx / rect.width - 0.5);
      mouseY.set(yPx / rect.height - 0.5);
    }
  };

  const handleStageLeave = () => {
    setIsHoveringStage(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const activePiece = ARCHIVE_PIECES[activePieceIdx];
  const isNoir = studioMode === "noir";
  const isBlueprint = studioMode === "blueprint";

  return (
    <>
      {/* ── الستارة السينمائية الافتتاحية (5-Column Curtain) ── */}
      <AnimatePresence>
        {curtainActive && (
          <ArchitecturalCurtain onComplete={() => setCurtainActive(false)} />
        )}
      </AnimatePresence>

      <section
        className={`relative isolate overflow-hidden transition-colors duration-700 ${
          isNoir
            ? "bg-[#09090B] text-white selection:bg-white selection:text-black"
            : isBlueprint
              ? "bg-[#ECEFF4] text-[#0F172A] selection:bg-blue-600 selection:text-white"
              : "bg-[#F2F0F1] text-[#111111] selection:bg-black selection:text-white"
        }`}
      >
        {/* ================================================================ */}
        {/* 1. ARCHITECTURAL GRID & DYNAMIC AMBIENT LIGHTING                 */}
        {/* ================================================================ */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isBlueprint
              ? "bg-[linear-gradient(to_right,#2563eb1a_1px,transparent_1px),linear-gradient(to_bottom,#2563eb1a_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] opacity-100"
              : isNoir
                ? "bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-100"
                : "bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-100"
          }`}
        />

        {/* Dynamic Studio Glow Behind Stage */}
        <motion.div
          aria-hidden="true"
          animate={{ background: activePiece.glow }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute right-[5%] top-[15%] h-[420px] w-[420px] rounded-full blur-[130px]"
        />

        {/* Blueprint CAD Measurement Lines (Only visible in Blueprint Mode) */}
        <AnimatePresence>
          {isBlueprint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 top-12 z-20 mx-auto hidden max-w-[1400px] justify-between border-b border-dashed border-blue-500/40 px-8 pb-1 font-mono text-[9.5px] font-bold text-blue-600 lg:flex"
            >
              <span>├──── X-AXIS: 1440PX MAX CONTAINER</span>
              <span>GOLDEN RATIO SPLIT // 7:5 COLUMNS</span>
              <span>
                CURSOR TELEMETRY: X:{coords.x} Y:{coords.y} ────┤
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto w-full max-w-[1400px] relative z-10 px-4 pt-5 pb-10 sm:px-6 sm:pt-8 lg:px-10 lg:pb-14">
          {/* ================================================================ */}
          {/* 2. TOP STUDIO ENGINEERING CONTROL BAR                            */}
          {/* ================================================================ */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-4 sm:mb-8">
            {/* Left: Season Telemetry */}
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9.5px] font-black uppercase tracking-[0.2em] ${
                  isNoir ? "bg-white text-black" : "bg-[#111111] text-white"
                }`}
              >
                <Sparkles size={10} className="text-amber-400" />
                ARCHIVE // 2026
              </span>

              <button
                type="button"
                onClick={() => setCurtainActive(true)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider transition ${
                  isNoir
                    ? "border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black"
                    : "border-black/10 bg-white/80 text-neutral-700 hover:bg-black hover:text-white"
                }`}
              >
                <RotateCcw size={10} />
                <span>Replay Reveal</span>
              </button>
            </div>

            {/* Right: Interactive Studio Lighting & CAD Mode Switcher */}
            <div
              role="group"
              aria-label="Studio Lighting Mode"
              className={`inline-flex items-center gap-1 rounded-full border p-1 backdrop-blur-xl ${
                isNoir
                  ? "border-white/15 bg-white/[0.06]"
                  : "border-black/10 bg-white/90 shadow-xs"
              }`}
            >
              {(
                [
                  { id: "light", label: "Studio", Icon: Sun },
                  { id: "noir", label: "Noir", Icon: Moon },
                  { id: "blueprint", label: "X-Ray CAD", Icon: Cpu },
                ] as const
              ).map(({ id, label, Icon }) => {
                const active = studioMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStudioMode(id)}
                    className={`relative flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider transition-colors ${
                      active
                        ? isNoir
                          ? "text-black"
                          : "text-white"
                        : isNoir
                          ? "text-white/60 hover:text-white"
                          : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="studioModeActivePill"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                        className={`absolute inset-0 rounded-full ${
                          isNoir
                            ? "bg-white"
                            : id === "blueprint"
                              ? "bg-blue-600"
                              : "bg-[#111111]"
                        }`}
                      />
                    )}
                    <Icon size={11} className="relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================ */}
          {/* 3. MAIN 12-COLUMN ASYMMETRIC RUNWAY WORKSPACE                    */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
            {/* ── LEFT 7 COLUMNS: KINETIC TYPOGRAPHY & LIVE SPEC CONSOLE ── */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Masked Editorial Headline */}
              <div className="w-full">
                <h1 className="text-[clamp(2.35rem,5.3vw,4.9rem)] font-black uppercase leading-[0.94] tracking-[-0.05em]">
                  <span className="block overflow-hidden pb-1">
                    <motion.span
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
                      className="block"
                    >
                      FIND CLOTHES
                    </motion.span>
                  </span>

                  <span className="block overflow-hidden pb-1">
                    <motion.span
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.08,
                        ease: EASE_OUT_EXPO,
                      }}
                      className="block"
                    >
                      THAT MATCHES
                    </motion.span>
                  </span>

                  {/* Interactive Click-to-Cycle 3D Capsule */}
                  <span className="mt-1.5 inline-flex flex-wrap items-center gap-3 sm:mt-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setWordIndex(
                          (prev) => (prev + 1) % DYNAMIC_HEADLINES.length,
                        )
                      }
                      title="Click to cycle headline"
                      className={`group relative inline-flex cursor-pointer items-center overflow-hidden rounded-2xl px-4 py-1.5 shadow-xl transition-transform active:scale-95 sm:rounded-3xl sm:px-6 sm:py-2 ${
                        isNoir
                          ? "bg-white text-black"
                          : isBlueprint
                            ? "bg-blue-600 text-white"
                            : "bg-[#111111] text-white"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={DYNAMIC_HEADLINES[wordIndex]}
                          initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
                          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                          className="block"
                        >
                          {DYNAMIC_HEADLINES[wordIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </span>
                </h1>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
                className={`mt-4 max-w-[54ch] text-xs font-medium leading-[1.75] sm:mt-5 sm:text-[15px] ${
                  isNoir ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {itemShop.description}
              </motion.p>

              {/* ── Interactive Garment Spec Console (Synced with Stage Pins) ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.28,
                  ease: EASE_OUT_EXPO,
                }}
                className={`mt-6 w-full max-w-xl rounded-3xl border p-4 backdrop-blur-xl transition-colors sm:p-5 ${
                  isNoir
                    ? "border-white/15 bg-white/[0.04]"
                    : isBlueprint
                      ? "border-blue-500/30 bg-white/90 shadow-sm"
                      : "border-black/10 bg-white/85 shadow-[0_14px_35px_rgba(0,0,0,0.04)]"
                }`}
              >
                {/* Piece Selector Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/10 pb-3">
                  <div className="flex items-center gap-1.5">
                    {ARCHIVE_PIECES.map((piece, idx) => {
                      const active = activePieceIdx === idx;
                      return (
                        <button
                          key={piece.id}
                          type="button"
                          onClick={() => setActivePieceIdx(idx)}
                          className={`cursor-pointer rounded-xl px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider transition-all ${
                            active
                              ? isNoir
                                ? "bg-white text-black shadow-sm"
                                : "bg-[#111111] text-white shadow-sm"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {piece.code}
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-mono text-[10px] font-bold text-emerald-500">
                    ● {activePiece.stock}
                  </span>
                </div>

                {/* Active Piece Details + Size Matrix */}
                <div className="mt-3.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-55">
                        {activePiece.category}
                      </span>
                      <span className="font-mono text-xs font-black text-amber-500">
                        {activePiece.price}
                      </span>
                    </div>
                    <h2 className="mt-0.5 truncate text-sm font-black uppercase tracking-tight sm:text-base">
                      {activePiece.name}
                    </h2>
                    <p className="mt-0.5 font-mono text-[10.5px] opacity-65">
                      Spec: {activePiece.spec}
                    </p>
                  </div>

                  {/* Interactive Size Selector */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    {["S", "M", "L", "XL"].map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border font-mono text-[10.5px] font-black transition-all ${
                            isSelected
                              ? isNoir
                                ? "border-white bg-white text-black"
                                : "border-black bg-black text-white"
                              : "border-current/15 opacity-65 hover:opacity-100"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* ── Primary CTAs ── */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.36,
                  ease: EASE_OUT_EXPO,
                }}
                className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
              >
                <Link
                  href="/shop"
                  className={`group inline-flex min-h-[52px] items-center justify-center gap-3.5 rounded-full px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] shadow-lg transition-all duration-300 active:scale-95 ${
                    isNoir
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-[#111111] text-white hover:bg-neutral-800"
                  }`}
                >
                  <ShoppingBag size={15} />
                  <span>{itemShop.btnText || "SHOP COLLECTION"}</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>

                <Link
                  href="/category"
                  className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 ${
                    isNoir
                      ? "border-white/20 bg-white/5 text-white hover:bg-white/15"
                      : "border-black/15 bg-white/80 text-black hover:border-black hover:bg-white"
                  }`}
                >
                  <Eye size={15} />
                  <span>Explore Lookbook</span>
                </Link>
              </motion.div>
            </div>

            {/* ================================================================ */}
            {/* RIGHT 5 COLUMNS: CLEAN INTERACTIVE STUDIO VIEWPORT               */}
            {/* ================================================================ */}
            <div className="relative mx-auto w-full max-w-[460px] [perspective:1400px] lg:col-span-5 lg:max-w-none">
              <motion.div
                ref={stageRef}
                onMouseEnter={() => setIsHoveringStage(true)}
                onMouseMove={handleStageMove}
                onMouseLeave={handleStageLeave}
                style={{
                  rotateX: reduceMotion ? 0 : rotateX,
                  rotateY: reduceMotion ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className={`group relative aspect-[4/4.65] w-full overflow-hidden rounded-[2rem] border-[3px] transition-colors duration-500 sm:rounded-[2.4rem] ${
                  isNoir
                    ? "border-white/20 bg-[#141418] shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                    : isBlueprint
                      ? "border-blue-600/50 bg-[#E2E8F0] shadow-[0_25px_60px_rgba(37,99,235,0.12)]"
                      : "border-white bg-[#EAE8E9] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)]"
                }`}
              >
                {/* Specular Mouse Glare */}
                <motion.div
                  aria-hidden="true"
                  style={{ background: spotlightBg }}
                  className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay"
                />

                {/* Top Camera HUD Bar Inside Frame (Does not block faces) */}
                <div className="pointer-events-none absolute inset-x-4 top-4 z-30 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: activePiece.accentHex }}
                    />
                    {activePiece.code} // {selectedSize}
                  </span>

                  <span className="rounded-full bg-white/85 px-2.5 py-1 font-mono text-[9px] font-black text-black backdrop-blur-md">
                    {isBlueprint
                      ? `X:${coords.x} Y:${coords.y}`
                      : "60FPS // 3D"}
                  </span>
                </div>

                {/* Iconic SHOP.CO 4-Point Stars */}
                <FourPointStar
                  className={`pointer-events-none absolute top-14 right-5 z-10 h-12 w-12 transition-colors duration-500 sm:h-16 sm:w-16 ${
                    isNoir
                      ? "text-white/20"
                      : isBlueprint
                        ? "text-blue-600/30"
                        : "text-black"
                  }`}
                />
                <FourPointStar
                  className={`pointer-events-none absolute top-[44%] left-5 z-10 h-7 w-7 transition-colors duration-500 sm:h-9 sm:w-9 ${
                    isNoir
                      ? "text-white/20"
                      : isBlueprint
                        ? "text-blue-600/30"
                        : "text-black"
                  }`}
                />

                {/* Hero Model Image */}
                <motion.div
                  style={{ x: modelParallaxX, y: modelParallaxY }}
                  className="absolute inset-0 top-6 z-20"
                >
                  <Image
                    src={Screen}
                    alt="SHOP.CO Flagship Lookbook"
                    fill
                    priority
                    sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 560px"
                    className={`object-cover object-top transition-all duration-500 ${
                      isNoir
                        ? "brightness-95 contrast-110"
                        : isBlueprint
                          ? "contrast-125 saturate-50"
                          : "mix-blend-multiply"
                    }`}
                  />
                </motion.div>

                {/* Minimal Numbered Hotspot Pins (No giant popups blocking the model) */}
                {ARCHIVE_PIECES.map((piece, idx) => {
                  const isSelected = activePieceIdx === idx;
                  return (
                    <button
                      key={piece.id}
                      type="button"
                      onClick={() => setActivePieceIdx(idx)}
                      style={{ left: piece.pin.x, top: piece.pin.y }}
                      aria-label={`Select ${piece.name}`}
                      className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 font-mono text-[10px] font-black transition-all duration-300 ${
                        isSelected
                          ? "scale-125 border-white bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                          : "border-white/80 bg-white/85 text-black hover:scale-110"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className="relative z-10">{piece.id}</span>
                    </button>
                  );
                })}

                {/* Custom Spring Cursor Follower (Desktop Only) */}
                <AnimatePresence>
                  {isHoveringStage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      style={{ left: lensX, top: lensY }}
                      className="pointer-events-none absolute z-40 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/65 px-3 py-1 font-mono text-[8.5px] font-black uppercase tracking-widest text-white backdrop-blur-md lg:flex"
                    >
                      {activePiece.price}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Clean Bottom Docked Bar Inside Stage */}
                <div className="absolute inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-2xl border border-white/40 bg-black/80 px-4 py-2.5 text-white backdrop-blur-xl">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-black uppercase tracking-wider text-white">
                      {activePiece.name}
                    </p>
                    <p className="font-mono text-[9.5px] text-white/65">
                      {activePiece.spec} • Size {selectedSize}
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="ml-3 flex h-8 shrink-0 items-center gap-1 rounded-xl bg-white px-3 font-mono text-[10px] font-black uppercase text-black transition hover:bg-emerald-400"
                  >
                    <span>{activePiece.price}</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 4. ARCHITECTURAL BENTO TELEMETRY DOCK WITH SVG SPARKLINES        */}
          {/* ================================================================ */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  isNoir
                    ? "border-white/10 bg-white/[0.04] hover:border-white/25"
                    : "border-black/10 bg-white/85 shadow-2xs hover:border-black/25 hover:bg-white"
                }`}
              >
                <div>
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-45">
                    0{index + 1} // VERIFIED METRIC
                  </span>
                  <p className="mt-1 font-mono text-2xl font-black tracking-tight sm:text-3xl">
                    <AnimatedStatValue rawValue={item.title} />
                  </p>
                  <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wider opacity-65">
                    {item.description}
                  </p>
                </div>

                {/* Mini Animated SVG Trend Sparkline */}
                <div className="flex flex-col items-end gap-1">
                  <svg
                    width="54"
                    height="24"
                    viewBox="0 0 54 24"
                    fill="none"
                    className="text-emerald-500"
                  >
                    <path
                      d="M2 20L14 14L25 17L38 7L52 3"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-mono text-[9px] font-bold text-emerald-500">
                    +18.4%
                  </span>
                </div>
              </div>
            ))}

            {/* 4th Bento Cell: Flagship Authenticity Guarantee */}
            <Link
              href="/shop"
              className={`group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
                isNoir
                  ? "bg-white text-black"
                  : "bg-[#111111] text-white shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                  <span className="ml-1 font-mono text-xs font-black">
                    4.9/5
                  </span>
                </div>
                <p className="mt-1 text-sm font-black uppercase tracking-tight">
                  Flagship Guarantee
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold opacity-70">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  100% Verified Authentic
                </p>
              </div>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-current/10 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Infinite Brand Ticker */}
      <BrandTicker reduceMotion={reduceMotion} />
    </>
  );
}
