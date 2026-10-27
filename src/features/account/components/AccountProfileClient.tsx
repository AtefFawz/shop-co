"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  Star,
  Package,
  Settings,
  Activity,
  UserCog,
  Edit3,
  Store,
  Mail,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Crown,
  ChevronRight,
  Bell,
  Lock,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

import UpdateProfileModal from "@/features/account/components/UpdateAccountForm";
import { ReviewsContent } from "@/features/reviews/components/CustomerReviewCard";
import OrdersContent from "@/features/account/components/AccountOrdersPanel";
import OverviewContent from "@/features/account/components/AccountOverviewPanel";
import { MobileAdminNavigation } from "@/shared/components/navigation/MobileAdminNavigation";
import { AdminDesktopSidebar } from "@/shared/components/navigation/AdminDesktopSidebar";
import useData from "@/hooks/getData";
import { formatCurrency } from "@/lib/formatCurrency";
import { getInitials } from "@/lib/initials";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import ThemeToggle from "@/shared/theme/ThemeToggle";
import toast from "react-hot-toast";

import type { CustomerOrderRecord, ReviewRecord } from "@/types/domain";
const NAV = [
  { id: "overview", labelKey: "accountNavHome", icon: Activity },
  { id: "orders", labelKey: "accountNavOrders", icon: Package },
  { id: "reviews", labelKey: "accountNavReviews", icon: Star },
  { id: "settings", labelKey: "accountNavSettings", icon: Settings },
] as const;

const TAB_META = {
  overview: {
    titleKey: "accountExecutiveOverview",
    badgeKey: "accountLiveTelemetry",
    descriptionKey: "accountSummaryDescription",
  },
  orders: {
    titleKey: "accountOrderArchive",
    badgeKey: "accountPurchases",
    descriptionKey: "accountOrdersDescription",
  },
  reviews: {
    titleKey: "accountProductReviews",
    badgeKey: "accountFeedback",
    descriptionKey: "accountReviewDescription",
  },
  settings: {
    titleKey: "accountPreferencesTitle",
    badgeKey: "accountConfiguration",
    descriptionKey: "accountPreferencesDescription",
  },
} as const;

export function AccountProfileClient() {
  const { locale, t, direction } = useLocale();
  // ── 1. ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP ──
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useData("/profile/me");
  const { data: orderData, refetch: refetchOrders } =
    useData("/profile/my-orders");
  const { data: reviewData, refetch: refetchReviews } = useData(
    "/profile/my-reviews",
  );

  const [active, setActive] = useState("overview");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [prefs, setPrefs] = useState({
    orderSms: true,
    dropAlerts: true,
    privateProfile: false,
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("shopco-profile-prefs");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<typeof prefs>;
        setPrefs((current) => ({
          orderSms:
            typeof parsed.orderSms === "boolean"
              ? parsed.orderSms
              : current.orderSms,
          dropAlerts:
            typeof parsed.dropAlerts === "boolean"
              ? parsed.dropAlerts
              : current.dropAlerts,
          privateProfile:
            typeof parsed.privateProfile === "boolean"
              ? parsed.privateProfile
              : current.privateProfile,
        }));
      }
    } catch {
      // Ignore malformed or unavailable browser storage; retain safe defaults.
    } finally {
      setPrefsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      window.localStorage.setItem(
        "shopco-profile-prefs",
        JSON.stringify(prefs),
      );
    } catch {
      // Preferences remain interactive for the current session if storage is unavailable.
    }
  }, [prefs, prefsLoaded]);

  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  const mainScrollRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const heroSpotlight = useMotionTemplate`
    radial-gradient(
      550px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.11),
      transparent 80%
    )
  `;

  const orders: CustomerOrderRecord[] = (orderData?.data?.orders ||
    []) as CustomerOrderRecord[];
  const reviews: ReviewRecord[] = (reviewData?.data?.reviews ||
    []) as ReviewRecord[];

  // Safely calculate total expenses BEFORE any early return
  const computedExpenses = useMemo(() => {
    const apiExpenses = orderData?.pagination?.totalExpenses;
    if (typeof apiExpenses === "number") return apiExpenses;
    const rawOrders = orderData?.data?.orders || [];
    return rawOrders.reduce(
      (sum: number, o: CustomerOrderRecord) =>
        sum + (Number(o?.totalPrice) || 0),
      0,
    );
  }, [orderData]);

  // ── 2. EVENT HANDLERS ──
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    mouseX.set(relX);
    mouseY.set(relY);

    const tiltX = (relX / rect.width - 0.5) * 6;
    const tiltY = (relY / rect.height - 0.5) * -6;
    setHeroTilt({ x: tiltX, y: tiltY });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  // ── 3. EARLY RETURN FOR INITIAL LOADING (AFTER ALL HOOKS) ──
  if (userLoading && !userData) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-surface-subtle text-primary">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-action text-on-action shadow-xl">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-muted">
          {t("accountInitializingPortal")}
        </p>
      </div>
    );
  }

  // ── 4. DERIVED USER & TELEMETRY DATA ──
  const user: any = userData?.data?.user || userData?.user || {};
  const {
    fullName = t("accountDefaultUser"),
    email = userData?.data?.email || "",
    avatar = "",
    role = "USER",
  } = user;

  const initials = getInitials(fullName, "U");

  const hasValidAvatar = Boolean(avatar) && !avatarError;

  const totalOrdersCount = orderData?.pagination?.total ?? orders.length;
  const totalReviewsCount = reviewData?.pagination?.total ?? reviews.length;

  const pagination = {
    paginationOrders: {
      total: totalOrdersCount,
      totalPages: orderData?.pagination?.totalPages || 1,
      page: orderData?.pagination?.page || 1,
      totalExpenses: computedExpenses,
    },
    paginationReviews: {
      total: totalReviewsCount,
      totalPages: reviewData?.pagination?.totalPages || 1,
      page: reviewData?.pagination?.page || 1,
    },
  };

  const tierProgress = Math.min(
    100,
    Math.max(18, totalOrdersCount * 15 + totalReviewsCount * 10),
  );

  const normalizedRole = String(role || "USER").toUpperCase();
  const checkRole = normalizedRole === "ADMIN" || normalizedRole === "MANAGER";
  const roleLabel =
    normalizedRole === "ADMIN"
      ? t("accountRoleAdmin")
      : normalizedRole === "MANAGER"
        ? t("accountRoleManager")
        : t("accountRoleCustomer");
  const membershipTier = checkRole
    ? t("accountExecutiveAdminTier")
    : totalOrdersCount >= 5
      ? t("accountBlackVipTier")
      : totalOrdersCount >= 1
        ? t("accountPlusTier")
        : t("accountVerifiedTier");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setAvatarError(false);
    await Promise.all([refetchUser(), refetchOrders(), refetchReviews()]);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleCopyEmail = async () => {
    if (!email) return;
    if (!navigator.clipboard?.writeText) {
      toast.error(t("accountCopyFailed"));
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success(t("accountEmailCopied"));
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error(t("accountCopyFailed"));
    }
  };

  const NAV_LINKS = checkRole
    ? [
        ...NAV.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
          icon: item.icon,
          badge:
            item.id === "orders"
              ? totalOrdersCount || undefined
              : item.id === "reviews"
                ? totalReviewsCount || undefined
                : undefined,
        })),
        { id: "dashboard", label: t("accountNavDashboard"), icon: UserCog },
      ]
    : NAV.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
        icon: item.icon,
        badge:
          item.id === "orders"
            ? totalOrdersCount || undefined
            : item.id === "reviews"
              ? totalReviewsCount || undefined
              : undefined,
      }));

  const goTo = (id: string) => {
    if (id === "dashboard") {
      router.push("/dashboard");
      return;
    }
    setActive(id);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentMeta =
    TAB_META[active as keyof typeof TAB_META] || TAB_META.overview;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-40 flex h-screen h-dvh w-full overflow-hidden bg-surface-subtle text-primary antialiased selection:bg-action selection:text-on-action"
    >
      {/* ── 1. MOBILE ONLY: Bottom Floating Navigation ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] lg:hidden pointer-events-none`}
      >
        <div className="pointer-events-auto w-full max-w-md">
          <MobileAdminNavigation
            arrayOfData={NAV_LINKS}
            active={active}
            goTo={goTo}
            showAppearanceControls
          />
        </div>
      </div>

      {/* ── 2. DESKTOP SIDEBAR ── */}
      <AdminDesktopSidebar
        active={active}
        arrayOfData={NAV_LINKS}
        goTo={goTo}
        navTitle={t("uiWorkspaceTitle")}
        headerContent={
          <div className="flex items-center gap-3 py-0.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-action font-mono text-xs font-black text-on-action shadow-sm ring-2 ring-focus/25">
              {hasValidAvatar ? (
                <Image
                  src={avatar}
                  alt={fullName}
                  fill
                  onError={() => setAvatarError(true)}
                  className="object-cover"
                />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>
            <div className="min-w-0 text-start">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-black uppercase tracking-tight text-primary">
                  {fullName}
                </p>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              </div>
              <p className="truncate font-mono text-[10px] font-medium text-muted">
                {email}
              </p>
            </div>
          </div>
        }
        extraFooterLinks={
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle px-3 py-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-secondary">
                {t("uiLanguagePreference")}
              </span>
              <LocaleSwitcher compact />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle px-3 py-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-secondary">
                {t("uiThemePreference")}
              </span>
              <ThemeToggle compact />
            </div>
            <Link
              href="/"
              className="group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-xs font-black uppercase tracking-wider text-muted transition-all hover:bg-surface-muted hover:text-primary"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-secondary transition-colors group-hover:bg-action group-hover:text-on-action">
                <Store size={15} />
              </div>
              <span>{t("backToStorefront")}</span>
            </Link>
          </div>
        }
        collapsedFooterLinks={
          <div className="flex flex-col items-center gap-2">
            <LocaleSwitcher
              compact
              className="h-10 w-10 px-0 [&>span]:hidden"
            />
            <ThemeToggle compact className="h-10 w-10" />
            <Link
              href="/"
              aria-label={t("backToStorefront")}
              title={t("backToStorefront")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-muted hover:text-primary"
            >
              <Store size={16} aria-hidden="true" />
            </Link>
          </div>
        }
      />

      {/* ── 3. RIGHT INSET WORKSPACE ── */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden lg:p-2.5">
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface-subtle lg:rounded-[26px] lg:border lg:border-border/90 lg:shadow-[0_12px_45px_rgba(var(--shadow-rgb),0.05)]">
          {/* Subtle Architectural Grid inside Workspace */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem]"
          />

          {/* ── Sticky Command Topbar ── */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-surface/85 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="text-base font-black tracking-[-0.07em] text-primary sm:text-lg lg:hidden"
              >
                SHOP.CO
              </Link>
              <span className="text-subtle lg:hidden">/</span>

              <div className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted lg:flex">
                <span>{t("navProfile")}</span>
                <ChevronRight size={12} className="text-subtle" />
              </div>

              <div className="flex min-w-0 items-center gap-2.5">
                <h2 className="truncate text-xs font-black uppercase tracking-[0.08em] text-primary sm:text-sm">
                  {t(currentMeta.titleKey)}
                </h2>
                <span className="hidden rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-secondary sm:inline-block">
                  {t(currentMeta.badgeKey)}
                </span>
              </div>
            </div>

            {/* Center Quick Tab Switcher (XL Screens) */}
            <div className="hidden items-center gap-1 rounded-xl border border-border/80 bg-surface-subtle p-1 xl:flex">
              {NAV.map((tab) => {
                const isTabActive = active === tab.id;
                const TabIcon = tab.icon;
                const count =
                  tab.id === "orders"
                    ? totalOrdersCount
                    : tab.id === "reviews"
                      ? totalReviewsCount
                      : null;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goTo(tab.id)}
                    className={`relative flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider transition-colors ${
                      isTabActive
                        ? "text-on-action"
                        : "text-muted hover:text-primary"
                    }`}
                  >
                    {isTabActive && (
                      <motion.span
                        layoutId="topNavActivePill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-lg bg-action shadow-xs"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <TabIcon size={12} />
                      <span>{t(tab.labelKey)}</span>
                      {count !== null && count > 0 && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                            isTabActive
                              ? "bg-white/20 text-on-action"
                              : "bg-surface-hover text-secondary"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Topbar Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                title={t("accountRefreshTooltip")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-secondary transition hover:border-border-strong hover:text-primary active:scale-95"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin text-primary" : ""}
                />
              </button>

              <Link
                href="/shop"
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-primary transition hover:border-border-strong hover:bg-surface-subtle sm:inline-flex"
              >
                <Store size={13} />
                <span>{t("accountShowroom")}</span>
                <ArrowUpRight size={12} className="text-muted" />
              </Link>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-action px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-on-action shadow-xs transition hover:bg-action-hover active:scale-95 sm:px-4"
              >
                <Edit3 size={12} />
                <span>{t("uiEditProfileAction")}</span>
              </button>
            </div>
          </header>

          {/* ── Scrollable Main Canvas ── */}
          <main
            ref={mainScrollRef}
            className="relative Responsive z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pt-5 pb-4 lg:pb-5"
          >
            <div className="space-y-6 pb-[calc(8rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
              <div
                style={{ perspective: "1300px" }}
                className="grid grid-cols-1 gap-5 xl:grid-cols-12"
              >
                {/* 1. Primary 3D Holographic Identity Card (8 Columns) */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseMove={handleHeroMouseMove}
                  onMouseLeave={handleHeroMouseLeave}
                  style={{
                    transform: `rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-border-strong bg-action p-1 text-on-action shadow-[0_24px_60px_-15px_rgba(var(--shadow-rgb),0.25)] transition-transform duration-200 ease-out xl:col-span-8"
                >
                  {/* Animated Conic Border Glow */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
                    <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-orbit-gradient opacity-40" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-action/95 p-6 backdrop-blur-2xl sm:p-8">
                    {/* Interactive Mouse Spotlight */}
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0"
                      style={{ background: heroSpotlight }}
                    />

                    {/* Architectural Blueprint Grid */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                        maskImage:
                          "radial-gradient(ellipse 90% 90% at 50% 50%, black 25%, transparent 100%)",
                      }}
                    />

                    {/* Watermark Monogram */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[9rem] font-black leading-none tracking-tighter text-on-action/[0.03] sm:text-[13rem]"
                    >
                      {getInitials(fullName, "SC")}
                    </span>

                    {/* === TOP SECTION === */}
                    <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-start">
                      {/* Avatar with Rotating Ring */}
                      <div className="relative shrink-0">
                        <div className="absolute -inset-2 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-white/25 opacity-70" />
                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          title={t("uiProfileChangePhoto")}
                          className="group/avatar relative flex h-26 w-26 cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border border-white/20 bg-white/10 font-mono text-2xl font-black text-on-action shadow-[0_0_30px_rgba(255,255,255,0.08)] sm:h-28 sm:w-28 sm:text-3xl"
                        >
                          {hasValidAvatar ? (
                            <Image
                              src={avatar}
                              alt={fullName}
                              fill
                              onError={() => setAvatarError(true)}
                              className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                            />
                          ) : (
                            <span>{initials || "U"}</span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-action/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/avatar:opacity-100">
                            <Edit3 size={18} className="text-on-action" />
                          </div>
                        </button>
                      </div>

                      {/* Identity Details + Copyable Email Pill */}
                      <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5 sm:items-start">
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                          <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-primary shadow-sm">
                            <ShieldCheck size={10} />
                            {roleLabel}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md border border-warning-border bg-warning-soft px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-rating">
                            <Sparkles size={9} />
                            {membershipTier}
                          </span>
                        </div>

                        <h1 className="w-full truncate text-2xl font-black uppercase tracking-tight text-on-action sm:text-3xl lg:text-4xl">
                          {fullName}
                        </h1>

                        {email ? (
                          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <motion.button
                              type="button"
                              onClick={handleCopyEmail}
                              whileTap={{ scale: 0.96 }}
                              title={t("uiCopyEmailHint")}
                              className={`group/copy inline-flex max-w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-[11.5px] transition-all duration-200 ${
                                copiedEmail
                                  ? "border-success-border bg-success-soft text-success"
                                  : "border-white/15 bg-white/[0.06] text-on-action-muted hover:border-white/30 hover:bg-white/[0.12] hover:text-on-action"
                              }`}
                            >
                              <Mail
                                size={12}
                                className={`shrink-0 ${
                                  copiedEmail
                                    ? "text-success"
                                    : "text-on-action-muted group-hover/copy:text-on-action"
                                }`}
                              />
                              <span className="truncate">{email}</span>
                              {copiedEmail ? (
                                <Check
                                  size={12}
                                  className="shrink-0 text-success"
                                />
                              ) : (
                                <Copy
                                  size={11}
                                  className="shrink-0 opacity-60 group-hover/copy:opacity-100"
                                />
                              )}
                            </motion.button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* === BOTTOM ROW: Stats Grid === */}
                    <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:mt-7  sm:grid-cols-3 ">
                      <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-action/40 px-4 py-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-on-action-muted">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-success-bright" />
                          <span>{t("uiTierReadiness")}</span>
                        </div>
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${tierProgress}%` }}
                              transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.2,
                              }}
                              className="h-full rounded-full bg-linear-to-r from-border-strong via-white to-rating"
                            />
                          </div>
                          <span className="font-mono text-[10px] font-black text-on-action">
                            {tierProgress}%
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="group/stat flex cursor-pointer flex-col justify-center rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-start transition hover:border-white/25 hover:bg-white/8"
                      >
                        <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-on-action-muted">
                          {t("accountTotalOrdersMetric")}
                        </p>
                        <div className="mt-1 flex items-baseline justify-between gap-2">
                          <span className="font-mono text-xl font-black text-on-action">
                            {totalOrdersCount}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-on-action-muted transition-transform group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5 group-hover/stat:text-on-action"
                          />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => goTo("reviews")}
                        className="group/stat flex cursor-pointer flex-col justify-center rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-start transition hover:border-white/25 hover:bg-white/8"
                      >
                        <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-on-action-muted">
                          {t("accountPublishedReviewsMetric")}
                        </p>
                        <div className="mt-1 flex items-baseline justify-between gap-2">
                          <span className="font-mono text-xl font-black text-on-action">
                            {totalReviewsCount}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-on-action-muted transition-transform group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5 group-hover/stat:text-on-action"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Right Bento Card: Pass / Quick Portal (4 Columns) */}
                <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-border bg-surface p-6 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] xl:col-span-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-black uppercase tracking-[0.18em] text-muted">
                        {t("uiShopCoPass")}
                      </p>
                      <h3 className="mt-1.5 text-lg font-black uppercase tracking-tight text-primary">
                        {checkRole
                          ? t("accountAdminCommandTitle")
                          : t("accountMemberPrivilegesTitle")}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-action text-on-action shadow-md">
                      {checkRole ? <UserCog size={18} /> : <Crown size={18} />}
                    </div>
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-muted">
                    {checkRole
                      ? t("accountAdminPrivilegeDescription")
                      : t("accountMemberBenefitsDescription")}
                  </p>

                  {/* Cumulative Spend Pill */}
                  <div className="flex items-center justify-between rounded-2xl bg-surface-subtle px-4 py-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted">
                      {t("accountLifetimeSpend")}
                    </span>
                    <span className="font-mono text-base font-black text-primary">
                      {formatCurrency(computedExpenses, locale)}
                    </span>
                  </div>

                  <div className="border-t border-border-subtle pt-3">
                    {checkRole ? (
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-action text-[11px] font-black uppercase tracking-[0.14em] text-on-action shadow-md transition hover:bg-action-hover active:scale-95"
                      >
                        <UserCog size={14} />
                        <span>{t("accountOpenCommandCenter")}</span>
                        <ArrowUpRight
                          size={13}
                          className={`ms-1 opacity-60 ${direction === "rtl" ? "-scale-x-100" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link
                        href="/shop"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-action text-[11px] font-black uppercase tracking-[0.14em] text-on-action shadow-md transition hover:bg-action-hover active:scale-95"
                      >
                        <Store size={14} />
                        <span>{t("accountExploreArchive")}</span>
                        <ArrowUpRight
                          size={13}
                          className={`ms-1 opacity-60 ${direction === "rtl" ? "-scale-x-100" : ""}`}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DYNAMIC TAB CONTENT ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                >
                  {active === "overview" && (
                    <OverviewContent
                      orders={orders}
                      reviews={reviews}
                      pagination={pagination}
                      onRefresh={handleRefresh}
                      goTo={goTo}
                    />
                  )}

                  {active === "orders" && <OrdersContent />}

                  {active === "reviews" && <ReviewsContent />}

                  {active === "settings" && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      {/* Identity Configuration Card */}
                      <div className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] lg:col-span-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-action text-on-action">
                                <Settings size={17} />
                              </div>
                              <div>
                                <h3 className="text-sm font-black uppercase tracking-tight text-primary">
                                  {t("accountIdentityPortrait")}
                                </h3>
                                <p className="text-[11px] font-medium text-muted">
                                  {t("accountPublicProfileUpdate")}
                                </p>
                              </div>
                            </div>

                            <span className="rounded-full bg-success-soft px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-success">
                              {t("accountVerified")}
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between rounded-2xl bg-surface-subtle p-3.5">
                              <span className="font-bold text-muted">
                                {t("accountDisplayName")}
                              </span>
                              <span className="font-black uppercase text-primary">
                                {fullName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-surface-subtle p-3.5">
                              <span className="font-bold text-muted">
                                {t("accountRegisteredEmail")}
                              </span>
                              <span className="font-mono font-bold text-primary">
                                {email}
                              </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-surface-subtle p-3.5">
                              <span className="font-bold text-muted">
                                {t("accountAccessTier")}
                              </span>
                              <span className="font-black uppercase text-primary">
                                {membershipTier}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-action py-3.5 text-xs font-black uppercase tracking-widest text-on-action shadow-md transition hover:bg-action-hover"
                        >
                          <Edit3 size={14} />
                          <span>{t("accountModifyProfile")}</span>
                        </button>
                      </div>

                      {/* Telemetry & Notification Toggles */}
                      <div className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] lg:col-span-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-action text-on-action">
                              <Bell size={17} />
                            </div>
                            <div>
                              <h3 className="text-sm font-black uppercase tracking-tight text-primary">
                                {t("accountAlertsTitle")}
                              </h3>
                              <p className="text-[11px] font-medium text-muted">
                                {t("accountAlertsDescription")}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[
                              {
                                key: "orderSms" as const,
                                title: t("accountCourierUpdates"),
                                sub: t("accountCourierUpdatesHint"),
                                icon: Smartphone,
                              },
                              {
                                key: "dropAlerts" as const,
                                title: t("accountLimitedCollectionAlerts"),
                                sub: t("accountLimitedCollectionAlertsHint"),
                                icon: Sparkles,
                              },
                              {
                                key: "privateProfile" as const,
                                title: t("accountPrivacyPreference"),
                                sub: t("accountPrivacyPreferenceHint"),
                                icon: Lock,
                              },
                            ].map((item) => {
                              const Icon = item.icon;
                              const isOn = prefs[item.key];
                              return (
                                <div
                                  key={item.key}
                                  role="switch"
                                  tabIndex={0}
                                  aria-checked={isOn}
                                  aria-label={item.title}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      setPrefs((current) => ({
                                        ...current,
                                        [item.key]: !current[item.key],
                                      }));
                                    }
                                  }}
                                  onClick={() =>
                                    setPrefs((p) => ({
                                      ...p,
                                      [item.key]: !p[item.key],
                                    }))
                                  }
                                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface-subtle p-3.5 transition hover:border-border hover:bg-surface"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-primary shadow-2xs">
                                      <Icon size={15} />
                                    </span>
                                    <div>
                                      <p className="text-xs font-black uppercase text-primary">
                                        {item.title}
                                      </p>
                                      <p className="text-[11px] text-muted">
                                        {item.sub}
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                                      isOn ? "bg-action" : "bg-surface-hover"
                                    }`}
                                  >
                                    <span
                                      className={`h-5 w-5 rounded-full bg-surface shadow-xs transition-transform ${
                                        isOn ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-success-soft px-4 py-3 text-[11px] font-bold text-success">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 size={14} />{" "}
                            {t("accountSessionEncryptedActive")}
                          </span>
                          <span className="font-mono text-[10px] uppercase">
                            TLS 1.3
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {isEditOpen && (
        <UpdateProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          currentUser={{ fullName, avatar }}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
