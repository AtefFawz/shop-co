// app/error.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Store,
  ChevronDown,
  Copy,
  Check,
  RefreshCw,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isResetting, setIsResetting] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("SHOP.CO Runtime Exception:", error);
  }, [error]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleRecovery = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 350);
  };

  const handleCopyError = () => {
    const logText = `Error: ${error?.message || "Unknown"}\nDigest: ${
      error?.digest || "N/A"
    }`;
    navigator.clipboard?.writeText(logText);
    setCopied(true);
    toast.success("Diagnostic report copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-surface-subtle px-4 py-12 text-center text-primary select-none"
    >
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS                                                  */}
      {/* ================================================================== */}
      <style>{`
        @keyframes pulseRing3D {
          0%, 100% {
            transform: translateZ(-25px) scale(0.96);
            opacity: 0.35;
          }
          50% {
            transform: translateZ(-25px) scale(1.06);
            opacity: 0.7;
          }
        }
        .animate-ring-3d {
          animation: pulseRing3D 4s ease-in-out infinite;
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]"
      />

      {/* Giant Extruded Background Watermark */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${tilt.x * -1.2}px, ${tilt.y * -1.2}px, 0)`,
        }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-200 ease-out"
      >
        <span className="font-mono text-[clamp(8rem,26vw,22rem)] font-black uppercase leading-none tracking-[-0.08em] text-primary/[0.03]">
          ERR//01
        </span>
      </div>

      {/* ================================================================== */}
      {/* 3D INTERACTIVE RECOVERY CONSOLE                                    */}
      {/* ================================================================== */}
      <div
        ref={stageRef}
        style={{ perspective: "1300px" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-[2.5rem] border-2 border-surface bg-surface/95 p-7 shadow-[0_30px_80px_-20px_rgba(var(--shadow-rgb),0.14)] backdrop-blur-xl transition-transform duration-200 ease-out sm:p-10"
        >
          {/* Depth Layer -1: Decorative Dashed Halo */}
          <div
            aria-hidden="true"
            className="animate-ring-3d pointer-events-none absolute -inset-3 rounded-[3rem] border border-dashed border-danger-border"
          />

          {/* Top Floating Status Badge (translateZ +30px) */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-danger-border bg-danger-soft px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-danger"
          >
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-danger" />
            <span>RUNTIME TELEMETRY INTERRUPTION</span>
          </div>

          {/* 3D Extruded Warning Cube (translateZ +45px) */}
          <div
            style={{ transform: "translateZ(45px)" }}
            className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-action text-on-action shadow-[0_18px_36px_-8px_rgba(var(--shadow-rgb),0.4)]"
          >
            <AlertTriangle size={32} className="text-rating" />
            <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-danger font-mono text-[10px] font-black text-on-danger">
              !
            </span>
          </div>

          {/* Headline & Reassurance Copy (translateZ +35px) */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="space-y-2.5"
          >
            <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
              Studio View Interrupted
            </h1>

            <p className="mx-auto max-w-sm text-xs font-medium leading-relaxed text-muted sm:text-[13px]">
              We encountered a temporary rendering anomaly while loading this
              view. Rest assured, your{" "}
              <strong className="font-bold text-primary">
                shopping bag &amp; session data remain 100% intact.
              </strong>
            </p>
          </div>

          {/* Primary & Secondary Recovery Actions (translateZ +40px) */}
          <div
            style={{ transform: "translateZ(40px)" }}
            className="mt-7 space-y-2.5"
          >
            <button
              type="button"
              onClick={handleRecovery}
              disabled={isResetting}
              className="group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-[0_16px_36px_-10px_rgba(var(--shadow-rgb),0.45)] transition-all hover:-translate-y-0.5 hover:bg-action-hover active:scale-98 disabled:opacity-60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <RotateCcw
                size={15}
                className={
                  isResetting
                    ? "animate-spin text-success"
                    : "transition-transform duration-500 group-hover:-rotate-180"
                }
              />
              <span>
                {isResetting ? "Re-Initializing Studio..." : "Try Again Now"}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-border/90 bg-surface-subtle py-3 text-[10px] font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-surface hover:text-primary"
              >
                <RefreshCw size={12} />
                <span>Hard Reload</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border/90 bg-surface-subtle py-3 text-[10px] font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-surface hover:text-primary"
              >
                <Store size={12} />
                <span>Flagship Home</span>
              </Link>
            </div>
          </div>

          {/* Collapsible Technical Diagnostic Log */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="mt-6 border-t border-border-subtle pt-4 text-left"
          >
            <button
              type="button"
              onClick={() => setShowLogs((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary"
            >
              <span className="inline-flex items-center gap-1.5">
                <Terminal size={12} />
                <span>Technical Telemetry</span>
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-300 ${
                  showLogs ? "rotate-180" : ""
                }`}
              />
            </button>

            {showLogs && (
              <div className="mt-3 rounded-2xl border border-border/80 bg-surface-subtle p-3.5 font-mono text-[10px] text-secondary animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border/70 pb-2">
                  <span className="font-bold text-primary">
                    DIGEST: {error?.digest || "LOCAL_RUNTIME_ERR"}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyError}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[9px] font-black uppercase text-primary shadow-2xs hover:bg-action hover:text-on-action"
                  >
                    {copied ? (
                      <>
                        <Check size={10} className="text-success" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={10} /> Copy Log
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 break-all text-[10px] leading-relaxed text-danger">
                  {error?.message ||
                    "Unexpected client-side exception occurred."}
                </p>
              </div>
            )}
          </div>

          {/* Bag Protection Assurance */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">
            <ShieldCheck size={13} className="text-success" />
            <span>Cart State Protected By Local Persistence</span>
          </div>
        </div>
      </div>
    </main>
  );
}
