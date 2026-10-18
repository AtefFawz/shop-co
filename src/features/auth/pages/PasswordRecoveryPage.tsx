"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaKey,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaFingerprint,
  FaClock,
} from "react-icons/fa";
import { useForgetPassword } from "@/hooks/useForgetPassword";

const STEPS = [
  { num: 1, label: "Identity", sub: "Your email" },
  { num: 2, label: "Verify", sub: "6-digit code" },
  { num: 3, label: "Security", sub: "New password" },
];

type OtpStatus = "idle" | "success" | "error";

export default function PasswordRecoveryPage() {
  const {
    formData,
    step,
    setStep,
    isLoading,
    error,
    setError,
    handleChange,
    submitAction,
  } = useForgetPassword();

  // visualStep بيسمحلنا نعرض أنيميشن النجاح في الخطوة 2 لمدة ثانية ونص قبل ما ننقل بصرياً للخطوة 3
  const [visualStep, setVisualStep] = useState<number>(step);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [errorShakeKey, setErrorShakeKey] = useState<number>(0);

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);

  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlight = useMotionTemplate`
    radial-gradient(
      520px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.08),
      transparent 80%
    )
  `;

  // 1. مراقبة انتقال المراحل وتشغيل أنيميشن النجاح لمدة 1.45 ثانية قبل النقل لصفحة الريست
  useEffect(() => {
    if (step === 3 && visualStep === 2) {
      setOtpStatus("success");
      const timer = window.setTimeout(() => {
        setVisualStep(3);
        setOtpStatus("idle");
      }, 1450);
      return () => window.clearTimeout(timer);
    } else {
      setVisualStep(step);
      if (step !== 2) setOtpStatus("idle");
    }
  }, [step, visualStep]);

  // 2. مراقبة حدوث خطأ في الخطوة التانية وتشغيل أنيميشن الرفض اللطيف
  useEffect(() => {
    if (visualStep === 2 && error && !isLoading) {
      setOtpStatus("error");
      setErrorShakeKey((prev) => prev + 1);

      const timer = window.setTimeout(() => {
        setOtpStatus("idle");
      }, 1100);
      return () => window.clearTimeout(timer);
    }
  }, [error, isLoading, visualStep]);

  // 3. تشغيل عداد الـ 10 دقائق في الخطوة التانية والتالتة
  useEffect(() => {
    if (step === 1) {
      setTimeLeft(600);
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setError("Session expired (10m limit). Please request a new code.");
          setStep(1);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, setError, setStep]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const hasMinLength = formData.newPassword.length >= 6;
  const hasNumber = /\d/.test(formData.newPassword);
  const passwordsMatch =
    formData.newPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  const strengthScore = [hasMinLength, hasNumber, passwordsMatch].filter(
    Boolean,
  ).length;

  const completionPercentage =
    visualStep === 1
      ? formData.email.includes("@")
        ? 33
        : 12
      : visualStep === 2
        ? otpStatus === "success"
          ? 66
          : 33 + Math.round((formData.otp.length / 6) * 33)
        : 66 + Math.round((strengthScore / 3) * 34);

  const currentStepTitle =
    {
      1: "Forgot Password?",
      2:
        otpStatus === "success"
          ? "Code Verified!"
          : otpStatus === "error"
            ? "Invalid Code"
            : "Verify Your Email",
      3: "Create New Password",
    }[visualStep] ?? "Forgot Password?";

  const currentStepDescription =
    {
      1: "Enter your registered email address and we'll dispatch a 6-digit recovery code.",
      2: "Enter the 6-digit cryptographic code sent to your inbox.",
      3: "Choose a strong, unique password to lock and secure your account.",
    }[visualStep] ?? "";

  const inputVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : direction * 16,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: reduceMotion ? 0 : 0.25 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : direction * -16,
      transition: { duration: reduceMotion ? 0 : 0.15 },
    }),
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full overflow-x-clip bg-surface-subtle text-primary antialiased selection:bg-action selection:text-on-action"
    >
      <header className="relative overflow-hidden bg-action px-4 pb-4 pt-5 text-on-action sm:px-8 sm:pb-16 sm:pt-6 lg:hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-lg items-center justify-between">
          <Link
            href="/"
            className="text-lg font-black tracking-[-0.06em] sm:text-xl"
          >
            SHOP.CO
          </Link>

          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 backdrop-blur-md">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                otpStatus === "error"
                  ? "animate-ping bg-danger"
                  : "animate-pulse bg-success-bright"
              }`}
            />
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-on-action sm:text-[10px]">
              0{visualStep} / 03
            </span>
          </div>
        </div>
      </header>

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-12">
        {/* ================= LEFT PANEL (6 Columns) ================= */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-action p-10 text-on-action lg:col-span-6 lg:flex xl:p-14 2xl:p-18">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{ background: spotlight }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
            }}
          />

          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/4 blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.span
              key={`watermark-${visualStep}`}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 0.035, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.06 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none tracking-tighter text-on-action text-[clamp(11rem,16vw,19rem)]"
            >
              0{visualStep}
            </motion.span>
          </AnimatePresence>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-2xl font-black tracking-[-0.07em] transition-opacity hover:opacity-80 xl:text-[1.7rem]"
            >
              SHOP.CO
            </Link>

            <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3.5 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-on-action-muted backdrop-blur-md">
              <span
                className={`h-1.5 w-1.5 animate-ping rounded-full ${
                  otpStatus === "error" ? "bg-danger-bright" : "bg-success-bright"
                }`}
              />
              <FaShieldAlt
                className={
                  otpStatus === "error" ? "text-danger-bright" : "text-success-bright"
                }
                size={11}
              />
              {otpStatus === "success"
                ? "Access Granted"
                : otpStatus === "error"
                  ? "Access Denied"
                  : "Encrypted Vault"}
            </span>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto max-w-lg py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-copy-${visualStep}-${otpStatus}`}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                <div
                  className={`mb-5 inline-flex items-center gap-2 rounded-md px-3 py-1 shadow-sm transition-colors ${
                    otpStatus === "success"
                      ? "bg-success text-on-success"
                      : otpStatus === "error"
                        ? "bg-danger text-on-danger"
                        : "bg-surface text-primary"
                  }`}
                >
                  <FaFingerprint size={11} />
                  <span className="text-[9.5px] font-black uppercase tracking-[0.2em]">
                    {otpStatus === "success"
                      ? "Identity Confirmed"
                      : otpStatus === "error"
                        ? "Verification Failed"
                        : `Security Protocol 0${visualStep}`}
                  </span>
                </div>

                <h2 className="text-[clamp(1.85rem,2.8vw,2.9rem)] font-black uppercase leading-[1.06] tracking-[-0.04em] text-on-action">
                  {visualStep === 1 && (
                    <>
                      Your Account.
                      <br />
                      <span className="text-on-action-muted">Your Control.</span>
                    </>
                  )}

                  {visualStep === 2 && (
                    <>
                      {otpStatus === "success"
                        ? "Access Granted."
                        : otpStatus === "error"
                          ? "Code Rejected."
                          : formData.otp.length === 6
                            ? "Code Ready."
                            : `${6 - formData.otp.length} Digits Left.`}
                      <br />
                      <span
                        className={
                          otpStatus === "success"
                            ? "text-success-bright"
                            : otpStatus === "error"
                              ? "text-danger-bright"
                              : "text-on-action-muted"
                        }
                      >
                        {otpStatus === "success"
                          ? "Unlocking Vault..."
                          : otpStatus === "error"
                            ? "Check & Try Again."
                            : "Verify Identity."}
                      </span>
                    </>
                  )}

                  {visualStep === 3 && (
                    <>
                      {passwordsMatch ? "Vault Locked." : "A Fresh Start."}
                      <br />
                      <span className="text-on-action-muted">A Stronger Key.</span>
                    </>
                  )}
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-on-action-muted xl:text-sm">
                  {visualStep === 1 &&
                    "Recover access to your Shop.co account through a time-locked, cryptographic verification flow."}
                  {visualStep === 2 &&
                    "Each digit you enter locks a security node below. Complete all 6 nodes before the timer expires."}
                  {visualStep === 3 &&
                    "Set your new password and fulfill all security checks to seal your credentials."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Live Cryptographic Console Card */}
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl xl:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-on-action-muted">
                    Target Identity
                  </p>
                  <p className="mt-1 truncate font-mono text-xs font-semibold text-on-action xl:text-[13px]">
                    {formData.email || "awaiting_email_input..."}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl border border-white/15 bg-action/60 px-3 py-1.5 text-right">
                  <p className="text-[8.5px] font-bold uppercase tracking-widest text-on-action-muted">
                    Completion
                  </p>
                  <p className="mt-0.5 font-mono text-xs font-black text-on-action xl:text-sm">
                    {completionPercentage}%
                  </p>
                </div>
              </div>

              {/* 6-Node Live Key Matrix */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.14em] text-on-action-muted">
                  <span>6-Node Key Matrix</span>
                  <span
                    className={`font-mono ${
                      otpStatus === "success"
                        ? "text-success-bright"
                        : otpStatus === "error"
                          ? "text-danger-bright"
                          : "text-on-action"
                    }`}
                  >
                    {visualStep === 1
                      ? "STANDBY"
                      : visualStep === 2
                        ? otpStatus === "success"
                          ? "6 / 6 VERIFIED"
                          : otpStatus === "error"
                            ? "MISMATCH"
                            : `${formData.otp.length} / 6 LOCKED`
                        : "VERIFIED"}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const isLit =
                      (visualStep === 1 && formData.email.length > idx * 3) ||
                      (visualStep === 2 && formData.otp.length > idx) ||
                      visualStep === 3;

                    return (
                      <motion.div
                        key={idx}
                        animate={{
                          backgroundColor:
                            otpStatus === "success"
                              ? "var(--success)"
                              : otpStatus === "error"
                                ? "var(--danger)"
                                : isLit
                                  ? "var(--action)"
                                  : "color-mix(in srgb, var(--text-primary) 7%, transparent)",
                          scale:
                            otpStatus === "success" ? 1.06 : isLit ? 1.03 : 1,
                          y: otpStatus === "success" ? -3 : isLit ? -1.5 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 18,
                          delay: otpStatus === "success" ? idx * 0.05 : 0,
                        }}
                        className={`flex h-8.5 items-center justify-center rounded-lg border border-white/15 font-mono text-xs font-black xl:h-9 ${
                          otpStatus === "success"
                            ? "text-on-success"
                            : otpStatus === "error"
                              ? "text-on-danger"
                              : isLit
                                ? "text-on-action"
                                : "text-primary"
                        }`}
                      >
                        {otpStatus === "success" ? (
                          <FaCheck size={10} />
                        ) : otpStatus === "error" ? (
                          <FaTimes size={10} />
                        ) : isLit ? (
                          "•"
                        ) : (
                          ""
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full transition-colors ${
                    otpStatus === "success"
                      ? "bg-success-bright"
                      : otpStatus === "error"
                        ? "bg-danger-bright"
                        : "bg-surface"
                  }`}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-on-action-muted">
            <span>© 2026 SHOP.CO</span>
            <span className="flex items-center gap-1.5 text-on-action-muted">
              <FaLock size={10} className="text-on-action" />
              256-Bit Bcrypt Protected
            </span>
          </div>
        </aside>

        {/* ================= RIGHT PANEL (6 Columns - Form Area) ================= */}
        <div className="relative -mt-8 flex min-w-0 items-center justify-center px-3.5 pb-8 sm:px-6 lg:col-span-6 lg:mt-0 lg:p-10 xl:p-14">
          <div className="w-full max-w-[460px]">
            {/* Form Card */}
            <motion.div
              key={`card-shake-${errorShakeKey}`}
              animate={
                error && !reduceMotion
                  ? { x: [0, -8, 8, -5, 5, -2, 2, 0] }
                  : { x: 0 }
              }
              transition={{ type: "tween", duration: 0.38 }}
              className={`relative overflow-hidden rounded-[22px] border bg-surface p-5 shadow-[0_20px_60px_rgba(var(--shadow-rgb),0.07)] transition-colors duration-300 sm:rounded-[28px] sm:p-8 md:p-9 ${
                otpStatus === "success"
                  ? "border-success-border ring-4 ring-success/10"
                  : otpStatus === "error"
                    ? "border-danger-border ring-4 ring-danger/10"
                    : "border-border/90"
              }`}
            >
              {/* Top Progress Line */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-surface-muted">
                <motion.div
                  className={`h-full transition-colors duration-300 ${
                    otpStatus === "success"
                      ? "bg-success"
                      : otpStatus === "error"
                        ? "bg-danger"
                        : "bg-action"
                  }`}
                  animate={{
                    width: `${
                      otpStatus === "success" ? 100 : (visualStep / 3) * 100
                    }%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 25,
                  }}
                />
              </div>

              {/* Refined Stepper */}
              <div className="mb-6 grid grid-cols-3 gap-2 pt-1.5 sm:mb-7 sm:gap-2.5">
                {STEPS.map((item) => {
                  const active = visualStep === item.num;
                  const completed =
                    visualStep > item.num ||
                    (item.num === 2 && otpStatus === "success");

                  return (
                    <div
                      key={item.num}
                      aria-current={active ? "step" : undefined}
                      className={`min-w-0 rounded-xl border p-2.5 transition-all duration-300 sm:rounded-2xl sm:p-3 ${
                        item.num === 2 && otpStatus === "success"
                          ? "border-success-border bg-success text-on-success shadow-[0_8px_20px_rgba(var(--success-rgb),0.25)]"
                          : item.num === 2 && otpStatus === "error"
                            ? "border-danger-border bg-danger text-on-danger shadow-[0_8px_20px_rgba(var(--danger-rgb),0.25)]"
                            : active
                              ? "border-border-strong bg-action text-on-action shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.14)]"
                              : completed
                                ? "border-border-subtle bg-surface-muted text-primary"
                                : "border-border/70 bg-surface-subtle/60 text-muted"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={`font-mono text-[9.5px] font-bold sm:text-[10px] ${
                            active && otpStatus === "idle"
                              ? "text-muted"
                              : ""
                          }`}
                        >
                          0{item.num}
                        </span>

                        {completed ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                              item.num === 2 && otpStatus === "success"
                                ? "bg-surface text-success"
                                : "bg-action text-on-action"
                            }`}
                          >
                            <FaCheck size={7} />
                          </motion.span>
                        ) : active ? (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              otpStatus === "error"
                                ? "bg-surface animate-ping"
                                : "bg-success-bright"
                            }`}
                          />
                        ) : null}
                      </div>

                      <p className="truncate text-[9.5px] font-black uppercase tracking-[0.06em] sm:text-[10.5px] sm:tracking-[0.08em]">
                        {item.label}
                      </p>

                      <p
                        className={`mt-0.5 hidden truncate text-[9px] sm:block ${
                          item.num === 2 && otpStatus !== "idle"
                            ? "text-on-action/80"
                            : active
                              ? "text-muted"
                              : "text-muted"
                        }`}
                      >
                        {item.sub}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${visualStep}-${otpStatus}`}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 6,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: reduceMotion ? 0 : -5,
                  }}
                  transition={{ duration: 0.18 }}
                  className="mb-6"
                >
                  <div
                    className={`mb-2 inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-on-action transition-colors sm:text-[9.5px] ${
                      otpStatus === "success"
                        ? "bg-success"
                        : otpStatus === "error"
                          ? "bg-danger"
                          : "bg-action"
                    }`}
                  >
                    {otpStatus === "success"
                      ? "Verified"
                      : otpStatus === "error"
                        ? "Try Again"
                        : `Step 0${visualStep}`}
                  </div>

                  <h1
                    className={`text-[clamp(1.25rem,3.2vw,1.75rem)] font-black uppercase leading-[1.15] tracking-[-0.03em] transition-colors ${
                      otpStatus === "success"
                        ? "text-success"
                        : otpStatus === "error"
                          ? "text-danger"
                          : "text-primary"
                    }`}
                  >
                    {currentStepTitle}
                  </h1>

                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted sm:text-[13px]">
                    {visualStep === 2 ? (
                      otpStatus === "success" ? (
                        <span className="font-semibold text-success">
                          Cryptographic match confirmed. Redirecting to password
                          setup...
                        </span>
                      ) : (
                        <>
                          Verification code dispatched to{" "}
                          <span className="break-all font-semibold text-primary underline decoration-border-strong underline-offset-4">
                            {formData.email}
                          </span>
                        </>
                      )
                    ) : (
                      currentStepDescription
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Error Banner */}
              <AnimatePresence>
                {error && otpStatus !== "success" && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <div className="rounded-xl border border-danger-border bg-danger-soft px-3.5 py-2.5 text-center text-[11.5px] font-bold leading-5 text-danger sm:text-xs">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={submitAction} className="space-y-5">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={`form-${visualStep}`}
                    custom={1}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    {visualStep === 1 && (
                      <Field
                        label="Email Address"
                        icon={<FaEnvelope size={11} />}
                      >
                        <div
                          className={`relative flex items-center rounded-xl border transition-all duration-200 sm:rounded-2xl ${
                            focusedField === "email"
                              ? "border-border-strong bg-surface ring-4 ring-focus/[0.05]"
                              : "border-border bg-surface-subtle/80 hover:border-border-strong"
                          }`}
                        >
                          <span
                            className={`pl-3.5 transition-colors sm:pl-4 ${
                              focusedField === "email"
                                ? "text-primary"
                                : "text-muted"
                            }`}
                          >
                            <FaEnvelope size={13} />
                          </span>
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="name@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            className="h-11 w-full rounded-xl bg-transparent px-3 text-[13px] font-medium text-primary outline-none placeholder:font-normal placeholder:text-muted sm:h-12 sm:rounded-2xl sm:text-sm"
                          />
                        </div>
                      </Field>
                    )}

                    {visualStep === 2 && (
                      <Field
                        label="6-Digit Verification Code"
                        icon={<FaKey size={11} />}
                        rightElement={
                          <motion.div
                            key={otpStatus}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold sm:text-[11px] ${
                              otpStatus === "success"
                                ? "bg-success text-on-success"
                                : otpStatus === "error"
                                  ? "bg-danger text-on-danger"
                                  : timeLeft < 60
                                    ? "animate-pulse bg-danger text-on-danger"
                                    : "bg-action text-on-action"
                            }`}
                          >
                            {otpStatus === "success" ? (
                              <>
                                <FaCheck size={9} />
                                MATCHED
                              </>
                            ) : otpStatus === "error" ? (
                              <>
                                <FaTimes size={9} />
                                INVALID
                              </>
                            ) : (
                              <>
                                <FaClock size={9} />
                                {formatTime(timeLeft)}
                              </>
                            )}
                          </motion.div>
                        }
                      >
                        <motion.div
                          key={`otp-grid-${errorShakeKey}`}
                          animate={
                            otpStatus === "error" && !reduceMotion
                              ? { x: [0, -10, 10, -7, 7, -3, 3, 0] }
                              : { x: 0 }
                          }
                          transition={{ type: "tween", duration: 0.42 }}
                          className="relative overflow-hidden rounded-2xl p-0.5"
                        >
                          {/* شعاع المسح الأخضر عند نجاح الـ OTP */}
                          <AnimatePresence>
                            {otpStatus === "success" && !reduceMotion && (
                              <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  type: "tween",
                                  duration: 0.85,
                                  ease: "easeInOut",
                                }}
                                className="pointer-events-none absolute inset-y-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-success/40 to-transparent skew-x-12"
                              />
                            )}
                          </AnimatePresence>

                          <input
                            type="text"
                            name="otp"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            autoFocus
                            required
                            disabled={otpStatus === "success" || isLoading}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            aria-label="Six-digit verification code"
                            value={formData.otp}
                            onChange={(event) => {
                              if (otpStatus !== "idle") setOtpStatus("idle");
                              if (error) setError("");

                              const value = event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);

                              handleChange({
                                ...event,
                                target: {
                                  ...event.target,
                                  name: "otp",
                                  value,
                                },
                              } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            onFocus={() => setFocusedField("otp")}
                            onBlur={() => setFocusedField(null)}
                            className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-default"
                          />

                          <div
                            aria-hidden="true"
                            className="grid grid-cols-6 gap-1.5 sm:gap-2.5"
                          >
                            {Array.from({ length: 6 }).map((_, index) => {
                              const digit = formData.otp[index] || "";
                              const isCurrent =
                                focusedField === "otp" &&
                                otpStatus === "idle" &&
                                index === Math.min(formData.otp.length, 5);

                              return (
                                <motion.div
                                  key={index}
                                  animate={{
                                    scale:
                                      otpStatus === "success"
                                        ? 1.06
                                        : otpStatus === "error"
                                          ? 0.96
                                          : digit
                                            ? 1.03
                                            : isCurrent
                                              ? 1.02
                                              : 1,
                                    y:
                                      otpStatus === "success"
                                        ? -4
                                        : digit || isCurrent
                                          ? -1.5
                                          : 0,
                                    rotate:
                                      otpStatus === "error"
                                        ? index % 2 === 0
                                          ? -2.5
                                          : 2.5
                                        : 0,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 16,
                                    delay:
                                      otpStatus === "success"
                                        ? index * 0.06
                                        : 0,
                                  }}
                                  className={`flex h-11 min-w-0 items-center justify-center rounded-xl border-[1.5px] font-mono text-base font-black transition-colors duration-200 sm:h-13 sm:rounded-2xl sm:text-xl ${
                                    otpStatus === "success"
                                      ? "border-success-border bg-success text-on-success shadow-[0_8px_20px_rgba(var(--success-rgb),0.32)]"
                                      : otpStatus === "error"
                                        ? "border-danger-border bg-danger text-on-danger shadow-[0_8px_20px_rgba(var(--danger-rgb),0.28)]"
                                        : digit
                                          ? "border-border-strong bg-action text-on-action shadow-[0_6px_16px_rgba(var(--shadow-rgb),0.14)]"
                                          : isCurrent
                                            ? "border-border-strong bg-surface text-primary ring-4 ring-focus/[0.05]"
                                            : "border-border bg-surface-subtle text-subtle"
                                  }`}
                                >
                                  <AnimatePresence mode="wait">
                                    {otpStatus === "success" ? (
                                      <motion.span
                                        key="check"
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 15,
                                          delay: index * 0.06 + 0.1,
                                        }}
                                      >
                                        <FaCheck size={14} />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key={`digit-${digit}`}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.12 }}
                                      >
                                        {digit || (
                                          <span className="text-subtle">
                                            ·
                                          </span>
                                        )}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      </Field>
                    )}

                    {visualStep === 3 && (
                      <>
                        <Field label="New Password" icon={<FaLock size={11} />}>
                          <PasswordInput
                            name="newPassword"
                            value={formData.newPassword}
                            placeholder="Enter new password"
                            showPassword={showPassword}
                            onToggle={() =>
                              setShowPassword((previous) => !previous)
                            }
                            onChange={handleChange}
                            onFocus={() => setFocusedField("newPassword")}
                            onBlur={() => setFocusedField(null)}
                            focused={focusedField === "newPassword"}
                          />
                        </Field>

                        <Field
                          label="Confirm Password"
                          icon={<FaLock size={11} />}
                        >
                          <PasswordInput
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm new password"
                            showPassword={showPassword}
                            onToggle={() =>
                              setShowPassword((previous) => !previous)
                            }
                            onChange={handleChange}
                            onFocus={() => setFocusedField("confirmPassword")}
                            onBlur={() => setFocusedField(null)}
                            focused={focusedField === "confirmPassword"}
                          />
                        </Field>

                        {/* Password Checklist */}
                        <div className="rounded-xl border border-border bg-surface-subtle/90 p-3.5 sm:rounded-2xl">
                          <div className="mb-2.5 flex items-center justify-between gap-2">
                            <p className="text-[9.5px] font-black uppercase tracking-[0.12em] text-secondary sm:text-[10px]">
                              Security Requirements
                            </p>
                            <span className="rounded bg-action px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-on-action">
                              {strengthScore}/3
                            </span>
                          </div>

                          <div className="mb-3 flex gap-1.5">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className="h-1 flex-1 overflow-hidden rounded-full bg-surface-hover"
                              >
                                <motion.div
                                  className="h-full rounded-full bg-action"
                                  animate={{
                                    width:
                                      strengthScore >= level ? "100%" : "0%",
                                  }}
                                  transition={{ duration: 0.2 }}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: "6+ Chars", met: hasMinLength },
                              { label: "1+ Number", met: hasNumber },
                              { label: "Matched", met: passwordsMatch },
                            ].map((rule) => (
                              <span
                                key={rule.label}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider transition-all sm:text-[10px] ${
                                  rule.met
                                    ? "bg-action text-on-action shadow-sm"
                                    : "border border-border bg-surface text-muted"
                                }`}
                              >
                                <FaCheck size={7} />
                                {rule.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Primary Action Button */}
                <div className="space-y-2.5 pt-1">
                  <motion.button
                    whileHover={
                      reduceMotion || otpStatus === "success"
                        ? undefined
                        : { scale: 1.01 }
                    }
                    whileTap={
                      reduceMotion || otpStatus === "success"
                        ? undefined
                        : { scale: 0.985 }
                    }
                    type="submit"
                    disabled={isLoading || otpStatus === "success"}
                    className={`group relative flex h-11.5 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-5 text-[11px] font-black uppercase tracking-[0.14em] transition-all focus:outline-none focus:ring-4 sm:h-12.5 sm:rounded-2xl sm:text-xs ${
                      otpStatus === "success"
                        ? "bg-success text-on-success shadow-[0_10px_24px_rgba(var(--success-rgb),0.3)] focus:ring-success/20"
                        : otpStatus === "error"
                          ? "bg-danger text-on-danger shadow-[0_10px_24px_rgba(var(--danger-rgb),0.25)] focus:ring-danger/20"
                          : "bg-action text-on-action shadow-[0_10px_24px_rgba(var(--shadow-rgb),0.18)] hover:bg-action-hover focus:ring-focus/15 disabled:cursor-not-allowed disabled:opacity-50"
                    }`}
                  >
                    <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {otpStatus === "success" ? (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <FaCheck size={12} />
                        Identity Verified — Unlocking...
                      </motion.span>
                    ) : otpStatus === "error" ? (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <FaTimes size={12} />
                        Invalid Code — Try Again
                      </motion.span>
                    ) : isLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>
                          {visualStep === 1
                            ? "Send Recovery Code"
                            : visualStep === 2
                              ? "Verify 6-Digit Code"
                              : "Save New Password"}
                        </span>
                        <FaArrowRight
                          size={10}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </motion.button>

                  {visualStep === 2 && otpStatus !== "success" && (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setOtpStatus("idle");
                        setStep(1);
                      }}
                      className="w-full py-1 text-center text-[11px] font-semibold text-muted transition-colors hover:text-primary"
                    >
                      Wrong email address?{" "}
                      <span className="font-bold text-primary underline underline-offset-4">
                        Edit email
                      </span>
                    </button>
                  )}
                </div>
              </form>

              {/* Card Footer */}
              <div className="mt-6 border-t border-border-subtle pt-4 text-center sm:mt-7">
                <Link
                  href="/auth/signin"
                  className="group inline-flex items-center justify-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.13em] text-muted transition-colors hover:text-primary sm:text-[11px]"
                >
                  <FaArrowLeft
                    size={9}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  rightElement,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-[0.13em] text-secondary sm:text-[10.5px]">
          <span className="text-primary">{icon}</span>
          {label}
        </label>
        {rightElement}
      </div>
      {children}
    </div>
  );
}

function PasswordInput({
  name,
  value,
  placeholder,
  showPassword,
  onToggle,
  onChange,
  onFocus,
  onBlur,
  focused,
}: {
  name: "newPassword" | "confirmPassword";
  value: string;
  placeholder: string;
  showPassword: boolean;
  onToggle: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}) {
  return (
    <div
      className={`flex h-11 items-center rounded-xl border transition-all duration-200 sm:h-12 sm:rounded-2xl ${
        focused
          ? "border-border-strong bg-surface ring-4 ring-focus/[0.05]"
          : "border-border bg-surface-subtle/80 hover:border-border-strong"
      }`}
    >
      <span
        className={`pl-3.5 transition-colors sm:pl-4 ${
          focused ? "text-primary" : "text-muted"
        }`}
      >
        <FaLock size={12} />
      </span>

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        autoComplete="new-password"
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-[13px] font-medium text-primary outline-none placeholder:font-normal placeholder:text-muted sm:rounded-2xl sm:text-sm"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-primary focus:outline-none"
      >
        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
    </div>
  );
}
