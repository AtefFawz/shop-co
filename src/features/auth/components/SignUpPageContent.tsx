"use client";
import SocialAuthButton from "@/features/auth/components/SocialAuthButton";


import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Crown, CheckCircle2, ArrowUpRight } from "lucide-react";
import Signup from "@/assets/shop/signup.png";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import ThemeToggle from "@/shared/theme/ThemeToggle";

export default function SignUpPageContent() {
  const { t, direction } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}auth/google`;
  };

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

  return (
    <div dir={direction} className="relative flex min-h-screen w-full overflow-hidden bg-surface-subtle text-primary selection:bg-action selection:text-on-action">
      {/* ================================================================== */}
      {/* LEFT — 3D VIP CLUB SHOWCASE STAGE (DESKTOP ONLY)                   */}
      {/* ================================================================== */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1300px" }}
        className="relative hidden h-screen w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-action p-8 text-on-action md:flex lg:p-12"
      >
        {/* Background Editorial Image */}
        <Image
          src={Signup}
          alt="SHOP.CO VIP Club"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-55 transition-transform duration-1000 ease-out hover:scale-105"
        />

        {/* Multi-Layer Studio Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-action via-action/45 to-black/30" />
        <div className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_40%,transparent_100%)]" />

        {/* 1. Top Navigation */}
        <div className="relative z-20 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-on-action backdrop-blur-md transition-all hover:bg-surface hover:text-primary"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>{t("authBackToFlagship")}</span>
          </Link>

          <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] font-extrabold tracking-[0.2em] text-on-action/80 backdrop-blur-md">
            {t("authArchive2026")}
          </span>
        </div>

        {/* 2. Center Interactive 3D Holographic VIP Membership Card */}
        <div className="relative z-20 my-auto flex flex-col items-center justify-center">
          <div
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="w-full max-w-[390px] rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_35px_80px_rgba(var(--shadow-rgb),0.65)] backdrop-blur-2xl transition-transform duration-200 ease-out"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-xs font-black text-primary">
                  S.
                </span>
                <span className="text-xs font-black tracking-[0.24em] text-on-action">
                  SHOP.CO™ PASS
                </span>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-warning">
                <Crown size={11} /> {t("authFounderTier")}
              </span>
            </div>

            <div className="my-6 space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-action/50">
                {t("authMemberPrivileges")}
              </p>
              <p className="text-2xl font-black uppercase tracking-tight text-on-action">
                {t("authAtelierPass")}
              </p>
            </div>

            <div className="space-y-2 border-t border-white/15 pt-4 text-xs font-semibold text-on-action/85">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success-bright" />
                <span>{t("authEarlyAccess")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success-bright" />
                <span>{t("authPriorityDispatch")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success-bright" />
                <span>{t("authArchivePricing")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Editorial Headline */}
        <div className="relative z-20 space-y-2">
          <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-on-action lg:text-5xl">
            {t("authJoinHeadline")}
            <br />
            <span className="text-on-action/50">{t("authAtelierClub")}</span>
          </h2>
          <p className="max-w-sm text-xs font-medium leading-relaxed text-on-action/65">
            {t("authWelcomeMembers")}
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT — ARCHITECTURAL SIGN-UP FORM PANEL                           */}
      {/* ================================================================== */}
      <div className="relative flex min-h-screen w-full flex-col justify-center overflow-y-auto px-4 py-8 sm:px-8 md:w-1/2 lg:px-14">
        {/* Mobile Header */}
        <div className="mb-5 flex items-center justify-between md:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>{t("catalogFlagship")}</span>
          </Link>
          <span className="text-xs font-black tracking-[-0.04em] text-primary">
            SHOP.CO™
          </span>
        </div>

        <div className="mx-auto mb-4 flex w-full max-w-[450px] items-center justify-end gap-2" aria-label={t("authLanguageAndTheme")}>
          <LocaleSwitcher compact />
          <ThemeToggle compact />
        </div>

        {/* Form Card Container */}
        <div className="mx-auto w-full max-w-[450px] rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_-15px_rgba(var(--shadow-rgb),0.07)] sm:p-8">
          {/* Header */}
          <div className="mb-6 space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <Sparkles size={11} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
                {t("authOnboarding")}
              </span>
            </div>

            <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
              {t("authCreateAccountHeading")}
            </h1>
            <p className="text-xs font-medium text-muted">
              {t("authProfileHint")}
            </p>
          </div>

          {/* Interactive Sign-Up Form */}
          <SignUpForm />

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-4 text-[9px] font-black uppercase tracking-[0.22em] text-muted">
                {t("authRegistrationDivider")}
              </span>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <SocialAuthButton label="Google" onClick={handleGoogleLogin}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </SocialAuthButton>
          </div>

          {/* Switch to Sign In */}
          <div className="mt-6 border-t border-border-subtle pt-4 text-center">
            <p className="text-xs font-medium text-muted">
              {t("authExistingMember")}{" "}
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-primary underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-primary"
              >
                <span>{t("authLoginLink")}</span>
                <ArrowUpRight size={13} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

