"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Shirt,
  Tag,
  Scissors,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const FASHION_STEPS = [
  "CURATING 2026 RUNWAY COLLECTION",
  "TAILORING OVERSIZED SILHOUETTES",
  "VERIFYING 200+ LUXURY HOUSES",
  "PREPARING YOUR FITTING ROOM",
];

const ORBIT_GARMENTS = [
  {
    angle: 0,
    tag: "LOOK // 01",
    name: "HEAVYWEIGHT HOODIE",
    price: "$185",
    icon: Shirt,
  },
  {
    angle: 90,
    tag: "BESPOKE // 02",
    name: "ITALIAN WOOL COAT",
    price: "$320",
    icon: Scissors,
  },
  {
    angle: 180,
    tag: "ARCHIVE // 03",
    name: "LIMITED STREET DROP",
    price: "$145",
    icon: Tag,
  },
  {
    angle: 270,
    tag: "AUTHENTIC // 04",
    name: "VERIFIED DESIGNER",
    price: "100%",
    icon: CheckCircle2,
  },
];

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Tuned to complete 0% -> 100% smoothly in ~2.2 seconds
  useEffect(() => {
    const startTime = performance.now();
    const duration = 2100; // 2.1 seconds

    let rafId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    rafId = requestAnimationFrame(updateProgress);

    const stepTimer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % FASHION_STEPS.length);
    }, 550);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(stepTimer);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 26;
    const y = (e.clientY / window.innerHeight - 0.5) * -26;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-screen w-full flex-col justify-between overflow-hidden bg-app px-6 py-8 text-primary select-none"
    >
      {/* ================================================================== */}
      {/* GPU 3D KEYFRAMES (LIGHT MODE ATELIER ENGINE)                       */}
      {/* ================================================================== */}
      <style>{`
        .atelier-perspective {
          perspective: 1200px;
          perspective-origin: 50% 48%;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        /* 1. Moving 3D Studio Runway Grid */
        @keyframes studioRunway {
          0% {
            background-position: 0px 0px, 0px 0px;
          }
          100% {
            background-position: 0px 56px, 56px 0px;
          }
        }

        .studio-floor {
          background-image: 
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
          background-size: 56px 56px;
          transform: rotateX(75deg) translateZ(-170px);
          animation: studioRunway 1.6s linear infinite;
        }

        /* 2. 3D Designer Shopping Bag Rotation & Float */
        @keyframes bagFloatSpin {
          0% {
            transform: translateY(-8px) rotateX(-10deg) rotateY(0deg) rotateZ(-2deg);
          }
          50% {
            transform: translateY(10px) rotateX(8deg) rotateY(180deg) rotateZ(2deg);
          }
          100% {
            transform: translateY(-8px) rotateX(-10deg) rotateY(360deg) rotateZ(-2deg);
          }
        }

        .animate-3d-bag {
          animation: bagFloatSpin 8s cubic-bezier(0.37, 0, 0.63, 1) infinite;
        }

        /* 3. Popping Couture Hanger & Price Tag from inside the Bag */
        @keyframes hangerPop {
          0%, 100% {
            transform: translateY(-38px) rotateY(0deg) scale3d(0.92, 0.92, 0.92);
          }
          50% {
            transform: translateY(-64px) rotateY(-180deg) scale3d(1.08, 1.08, 1.08);
          }
        }

        .animate-hanger-pop {
          animation: hangerPop 4s ease-in-out infinite;
        }

        /* 4. 3D Orbiting Garment Lookbook Cards */
        @keyframes garmentCarousel {
          0% {
            transform: rotateX(-6deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(-6deg) rotateY(-360deg);
          }
        }

        .animate-garment-orbit {
          animation: garmentCarousel 14s linear infinite;
        }

        /* 5. Tailor Measuring Tape Rings */
        @keyframes tapeRing1 {
          0%   { transform: rotateX(72deg) rotateY(14deg) rotateZ(0deg); }
          100% { transform: rotateX(72deg) rotateY(14deg) rotateZ(360deg); }
        }
        @keyframes tapeRing2 {
          0%   { transform: rotateX(-68deg) rotateY(-20deg) rotateZ(360deg); }
          100% { transform: rotateX(-68deg) rotateY(-20deg) rotateZ(0deg); }
        }

        .tape-ring-1 { animation: tapeRing1 9s linear infinite; }
        .tape-ring-2 { animation: tapeRing2 12s linear infinite; }

        /* 6. Dynamic Floor Shadow */
        @keyframes shadowPulse {
          0%, 100% {
            transform: rotateX(90deg) translateZ(-115px) scale(0.85);
            opacity: 0.16;
          }
          50% {
            transform: rotateX(90deg) translateZ(-115px) scale(1.15);
            opacity: 0.28;
          }
        }

        .bag-floor-shadow {
          animation: shadowPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* ================================================================== */}
      {/* 1. LIGHT-MODE ARCHITECTURAL STUDIO BACKDROP                        */}
      {/* ================================================================== */}
      <div
        aria-hidden="true"
        className="atelier-perspective pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="studio-floor absolute inset-x-[-50%] bottom-[-35%] h-[95%] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,#000_45%,transparent_90%)]" />
      </div>

      {/* Soft White Studio Lighting Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface/95 blur-[110px]"
      />

      {/* Giant Editorial Background Watermark */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${tilt.x * -0.7}px, ${tilt.y * -0.7}px, 0)`,
        }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-200 ease-out"
      >
        <span className="text-[clamp(6rem,20vw,18rem)] font-black uppercase leading-none tracking-[-0.07em] text-primary/[0.035]">
          SHOP.CO
        </span>
      </div>

      {/* ================================================================== */}
      {/* 2. TOP EDITORIAL ATELIER BAR                                       */}
      {/* ================================================================== */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-3 rounded-full border border-border-subtle bg-surface/85 px-4 py-2 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-action" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
            SHOP.CO · ATELIER
          </span>
        </div>

        <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted sm:flex">
          <Scissors size={12} className="text-secondary" />
          <span>3D INTERACTIVE LOOKBOOK</span>
        </div>

        <span className="rounded-full border border-border-subtle bg-surface/85 px-3.5 py-1.5 font-mono text-[10px] font-extrabold tracking-[0.18em] text-secondary shadow-2xs">
          COLLECTION // 26
        </span>
      </div>

      {/* ================================================================== */}
      {/* 3. CENTERPIECE: 3D LUXURY SHOPPING BAG & ORBITING GARMENT RACK     */}
      {/* ================================================================== */}
      <div className="atelier-perspective relative z-20 my-auto flex flex-col items-center justify-center py-4">
        {/* Interactive Mouse-Tilt 3D Stage */}
        <div
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          }}
          className="preserve-3d relative flex h-[340px] w-[340px] items-center justify-center transition-transform duration-150 ease-out sm:h-[380px] sm:w-[380px]"
        >
          {/* -------------------------------------------------------------- */}
          {/* A. TAILOR MEASURING TAPE ORBIT RINGS                           */}
          {/* -------------------------------------------------------------- */}
          <div className="tape-ring-1 preserve-3d pointer-events-none absolute h-76 w-76 rounded-full border-2 border-dashed border-border-subtle sm:h-84 sm:w-84">
            <span className="absolute -top-2 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-action text-[8px] font-bold text-on-action shadow-md">
              ✦
            </span>
          </div>

          <div className="tape-ring-2 preserve-3d pointer-events-none absolute h-64 w-64 rounded-full border border-border-subtle sm:h-72 sm:w-72">
            <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-action" />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* B. 3D ORBITING LOOKBOOK GARMENT TAGS                           */}
          {/* -------------------------------------------------------------- */}
          <div className="animate-garment-orbit preserve-3d pointer-events-none absolute inset-0 flex items-center justify-center">
            {ORBIT_GARMENTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    transform: `rotateY(${item.angle}deg) translateZ(172px)`,
                  }}
                  className="preserve-3d absolute flex items-center gap-2.5 rounded-2xl border border-border-subtle bg-surface px-3.5 py-2.5 shadow-[0_14px_34px_rgba(var(--shadow-rgb),0.10)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-action text-on-action">
                    <Icon size={14} />
                  </span>
                  <div className="pr-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[8px] font-bold tracking-[0.16em] text-muted">
                        {item.tag}
                      </span>
                      <span className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] font-black tracking-[0.08em] text-primary">
                      {item.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* C. THE 3D LUXURY SHOP.CO SHOPPING BAG (TRUE VOLUMETRIC 3D)     */}
          {/* -------------------------------------------------------------- */}
          <div className="animate-3d-bag preserve-3d relative flex h-[126px] w-[104px] items-center justify-center">
            {/* 1. POPPING 3D COUTURE HANGER & GOLDEN TAG ABOVE THE BAG */}
            <div className="animate-hanger-pop preserve-3d absolute inset-x-0 top-0 flex flex-col items-center">
              {/* Custom 3D Coat Hanger SVG */}
              <svg
                viewBox="0 0 64 40"
                className="h-11 w-16 stroke-primary drop-shadow-md"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M32 10 C32 5, 39 5, 39 10 C39 14, 32 15, 32 19" />
                <path d="M32 19 L6 34 C3 35.5, 4 38, 8 38 L56 38 C60 38, 61 35.5, 58 34 L32 19 Z" />
              </svg>
              <span className=" -mt-2 rounded-full border border-border-subtle bg-surface px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
                NEW SEASON
              </span>
            </div>

            {/* 2. 3D ARCHED BAG HANDLES (FRONT & BACK HANDLES) */}
            <div
              style={{ transform: "translateY(-68px) translateZ(18px)" }}
              className="pointer-events-none absolute h-10 w-12 rounded-t-full border-4 border-b-0 border-border"
            />
            <div
              style={{ transform: "translateY(-68px) translateZ(-18px)" }}
              className="pointer-events-none absolute h-10 w-12 rounded-t-full border-4 border-b-0 border-border-strong"
            />

            {/* 3. BAG FRONT FACE (104px wide x 126px high, translateZ 32px) */}
            <div
              style={{ transform: "rotateY(0deg) translateZ(32px)" }}
              className="absolute inset-0 flex flex-col items-center justify-between rounded-b-2xl rounded-t-md border-2 border-white/20 bg-action p-3.5 text-on-action shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.25)]"
            >
              {/* Bag Rope Eyelets */}
              <div className="flex w-full justify-around px-3">
                <span className="h-2 w-2 rounded-full border border-border-subtle bg-action-hover" />
                <span className="h-2 w-2 rounded-full border border-border-subtle bg-action-hover" />
              </div>

              {/* Center Brand Print */}
              <div className="text-center">
                <span className="block text-[15px] font-black tracking-[-0.04em] text-on-action">
                  SHOP.CO
                </span>
                <span className="mt-0.5 block text-[7px] font-bold uppercase tracking-[0.28em] text-on-action/50">
                  LUXURY BAG
                </span>
              </div>

              {/* Bottom Barcode Strip */}
              <div className="flex w-full items-center justify-between border-t border-white/15 pt-1.5 text-[7px] font-mono text-on-action/50">
                <span>EST. 2026</span>
                <Sparkles size={10} className="text-on-action" />
              </div>
            </div>

            {/* 4. BAG BACK FACE (translateZ -32px) */}
            <div
              style={{ transform: "rotateY(180deg) translateZ(32px)" }}
              className="absolute inset-0 flex flex-col items-center justify-between rounded-b-2xl rounded-t-md border-2 border-white/20 bg-action p-3.5 text-on-action shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.25)]"
            >
              <div className="flex w-full justify-around px-3">
                <span className="h-2 w-2 rounded-full border border-border-subtle bg-action-hover" />
                <span className="h-2 w-2 rounded-full border border-border-subtle bg-action-hover" />
              </div>

              <div className="text-center">
                <ShoppingBag size={22} className="mx-auto text-on-action" />
                <span className="mt-1.5 block text-[8px] font-black uppercase tracking-[0.22em] text-on-action/80">
                  FIND YOUR STYLE
                </span>
              </div>

              <span className="text-[7px] font-mono tracking-widest text-on-action/40">
                EDITION // 04
              </span>
            </div>

            {/* 5. BAG RIGHT GUSSET SIDE (64px wide, positioned at X = +52px) */}
            <div
              style={{
                width: "64px",
                left: "20px",
                transform: "rotateY(90deg) translateZ(52px)",
              }}
              className="absolute inset-y-0 flex flex-col items-center justify-center rounded-b-xl border border-border-subtle bg-surface text-primary shadow-inner"
            >
              <span className="[writing-mode:vertical-rl] text-[9px] font-black uppercase tracking-[0.28em] text-primary">
                SHOP.CO
              </span>
            </div>

            {/* 6. BAG LEFT GUSSET SIDE (64px wide, positioned at X = -52px) */}
            <div
              style={{
                width: "64px",
                left: "20px",
                transform: "rotateY(-90deg) translateZ(52px)",
              }}
              className="absolute inset-y-0 flex flex-col items-center justify-center rounded-b-xl border border-border-subtle bg-surface text-primary shadow-inner"
            >
              <span className="[writing-mode:vertical-rl] text-[9px] font-black uppercase tracking-[0.28em] text-primary">
                2026 EDIT
              </span>
            </div>

            {/* 7. BAG BOTTOM BASE */}
            <div
              style={{
                height: "64px",
                top: "31px",
                transform: "rotateX(-90deg) translateZ(63px)",
              }}
              className="absolute inset-x-0 rounded-lg bg-action"
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* D. 3D FLOOR SHADOW UNDER THE BAG                               */}
          {/* -------------------------------------------------------------- */}
          <div className="bag-floor-shadow pointer-events-none absolute h-28 w-28 rounded-full bg-action blur-xl" />
        </div>

        {/* ================================================================ */}
        {/* 4. FOREGROUND BRAND PROGRESS & STITCHING TRACK                   */}
        {/* ================================================================ */}
        <div className="mt-4 flex w-full max-w-md flex-col items-center text-center">
          <div className="flex w-full items-end justify-between px-1">
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.24em] text-muted">
                <Sparkles size={11} className="text-primary" />
                ATELIER STATUS
              </span>
              <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] text-primary">
                {FASHION_STEPS[stepIndex]}
              </span>
            </div>

            <div className="text-right font-mono">
              <span className="text-3xl font-black leading-none tracking-tighter text-primary sm:text-4xl">
                {String(progress).padStart(2, "0")}
              </span>
              <span className="text-sm font-extrabold text-muted">%</span>
            </div>
          </div>

          {/* Tailor Measuring Tape Progress Bar */}
          <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full border border-border-subtle bg-surface p-0.5 shadow-inner">
            <div
              style={{ width: `${progress}%` }}
              className="relative h-full rounded-full bg-action transition-all duration-75 ease-out"
            />
          </div>

          {/* Ruler Ticks Under Progress Bar */}
          <div className="mt-2 flex w-full justify-between px-1 font-mono text-[8px] font-bold tracking-[0.2em] text-muted">
            <span>00 CM</span>
            <span>25 CM</span>
            <span>50 CM</span>
            <span>75 CM</span>
            <span className="text-primary">100 CM</span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 5. BOTTOM EDITORIAL FOOTER                                         */}
      {/* ================================================================== */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between border-t border-border-subtle pt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
        <span>FIND CLOTHES THAT MATCH YOUR STYLE</span>
        <span className="hidden sm:inline">200+ INTERNATIONAL BRANDS</span>
        <span className="text-primary">SHOP.CO™</span>
      </div>
    </div>
  );
}
