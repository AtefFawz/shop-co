"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Star, Layers, ArrowUpRight } from "lucide-react";
import Login from "@/assets/shop/screenShop.webp";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import ThemeToggle from "@/shared/theme/ThemeToggle";

export default function SignInPageContent() {
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
      {/* LEFT — 3D INTERACTIVE EDITORIAL SHOWCASE (DESKTOP ONLY)            */}
      {/* ================================================================== */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1300px" }}
        className="relative hidden h-screen w-1/2 shrink-0 flex-col justify-between overflow-hidden border-r border-border-subtle bg-surface-subtle p-8 md:flex lg:p-12"
      >
        {/* Architectural Studio Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.2rem_3.2rem]"
        />

        {/* Soft Radial Studio Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface/95 blur-[110px]"
        />

        {/* Giant Background Watermark */}
        <div
          aria-hidden="true"
          style={{
            transform: `translate3d(${tilt.x * -1.2}px, ${tilt.y * -1.2}px, 0)`,
          }}
          className="pointer-events-none absolute inset-x-0 top-20 z-0 flex justify-center select-none transition-transform duration-200 ease-out"
        >
          <span className="text-[clamp(4.5rem,8vw,7.5rem)] font-black uppercase leading-none tracking-[-0.07em] text-primary/[0.05]">
            SHOP.CO
          </span>
        </div>

        {/* 1. Top Bar: Brand Identity & Back to Store */}
        <div className="relative z-30 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary shadow-2xs backdrop-blur-md transition-all hover:bg-action hover:text-on-action"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>{t("authBackToFlagship")}</span>
          </Link>

          <span className="rounded-full border border-border-subtle bg-surface/80 px-3.5 py-1.5 font-mono text-[10px] font-extrabold tracking-[0.2em] text-secondary backdrop-blur-md">
            {t("authArchive2026")}
          </span>
        </div>

        {/* 2. Center 3D Tilting Fashion Monolith */}
        <div className="relative z-20 my-auto flex items-center justify-center py-4">
          <div
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="relative aspect-[4/4.5] w-full max-w-[420px] transition-transform duration-200 ease-out"
          >
            {/* Main Arch Pedestal */}
            <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] border-2 border-surface bg-app shadow-[0_35px_80px_-20px_rgba(var(--shadow-rgb),0.22)]">
              <Image
                src={Login}
                alt="SHOP.CO Luxury Fashion"
                fill
                priority
                sizes="50vw"
                className="object-cover object-top mix-blend-multiply transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

              {/* Bottom Editorial Copy Inside Frame */}
              <div className="absolute inset-x-6 bottom-6 z-20 text-on-action">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action backdrop-blur-md">
                  <Sparkles size={10} /> {t("authMemberPortal")}
                </span>
                <h2 className="mt-2 text-3xl font-black uppercase leading-[0.92] tracking-[-0.04em] lg:text-4xl">
                  {t("authWelcomeBack")}
                </h2>
              </div>
            </div>

            {/* Floating 3D Badge 1 (Top-Left) */}
            <div
              style={{ transform: "translateZ(55px)" }}
              className="absolute -left-5 top-8 z-30 flex items-center gap-3 rounded-2xl border border-surface bg-surface/95 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(var(--shadow-rgb),0.14)] backdrop-blur-xl"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-action text-on-action">
                <Layers size={15} />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted">
                  {t("authCuratedCatalog")}
                </p>
                <p className="text-[11px] font-black text-primary">
                  {t("authLuxuryHouses")}
                </p>
              </div>
            </div>

            {/* Floating 3D Badge 2 (Bottom-Right) */}
            <div
              style={{ transform: "translateZ(70px)" }}
              className="absolute -bottom-4 -right-4 z-30 flex items-center gap-2.5 rounded-2xl border border-surface bg-action px-4 py-3 text-on-action shadow-[0_22px_45px_rgba(var(--shadow-rgb),0.3)]"
            >
              <div className="flex text-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </div>
              <span className="font-mono text-xs font-black">4.9/5</span>
              <span className="text-[10px] text-on-action/60">{t("authVipRating")}</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Telemetry Footer */}
        <div className="relative z-30 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          <span>{t("authOfficialFlagship")}</span>
          <span>{t("authVerifiedAuthenticity")}</span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT — ARCHITECTURAL FORM PANEL                                   */}
      {/* ================================================================== */}
      <div className="relative flex min-h-screen w-full flex-col justify-center overflow-y-auto px-4 py-10 sm:px-8 md:w-1/2 lg:px-14">
        {/* Mobile Top Navigation */}
        <div className="mb-6 flex items-center justify-between md:hidden">
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
        <div className="mx-auto w-full max-w-[440px] rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_-15px_rgba(var(--shadow-rgb),0.07)] sm:p-9">
          {/* Top Pill & Headline */}
          <div className="mb-7 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
                {t("authLoginPanelLabel")}
              </span>
            </div>

            <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
              {t("authLoginHeading")}
            </h1>
            <p className="text-xs font-medium leading-relaxed text-muted">
              {t("authLoginDescription")}
            </p>
          </div>

          {/* Interactive Sign-In Form */}
          <SignInForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-4 text-[9px] font-black uppercase tracking-[0.22em] text-muted">
                {t("authSocialDivider")}
              </span>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <SocialButton label="Google" onClick={handleGoogleLogin}>
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
            </SocialButton>
          </div>

          {/* Switch to Sign Up */}
          <div className="mt-7 border-t border-border-subtle pt-5 text-center">
            <p className="text-xs font-medium text-muted">
              {t("authNewToStore")}{" "}
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-primary underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-primary"
              >
                <span>{t("authCreateAccountLink")}</span>
                <ArrowUpRight size={13} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-border/90 bg-surface-subtle py-3 text-xs font-black uppercase tracking-widest text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface hover:shadow-sm active:scale-95"
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {children}
      </span>
      <span>{label}</span>
    </button>
  );
}
