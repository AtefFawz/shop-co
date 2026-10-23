"use client";

import React, { useState, useRef, useMemo } from "react";
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

import UpdateProfileModal from "./UpdateProfile";
import { ReviewsContent } from "./ReviewCard";
import OrdersContent from "./OrdersContent";
import OverviewContent from "./OverviewContent";
import { NavMobile } from "@/components/common/navbar/NavMobile";
import { SidebarDesktop } from "@/components/common/navbar/SidebarDesktop";
import useData from "@/hooks/getData";

const NAV = [
  { id: "overview", label: "Home", icon: Activity },
  { id: "orders", label: "Orders", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

const TAB_META: Record<
  string,
  { title: string; badge: string; description: string }
> = {
  overview: {
    title: "Executive Overview",
    badge: "Live Telemetry",
    description: "Real-time summary of your orders, spending, and activity.",
  },
  orders: {
    title: "Order Archive",
    badge: "Purchases",
    description: "Track shipments, inspect invoices, and rate delivered items.",
  },
  reviews: {
    title: "Product Reviews",
    badge: "Feedback",
    description: "Manage your published ratings and community contributions.",
  },
  settings: {
    title: "Atelier Preferences",
    badge: "Configuration",
    description: "Manage your personal identity, notifications, and security.",
  },
};

export function ProfileClient() {
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

  const orders: any[] = orderData?.data?.orders || [];
  const reviews: any[] = reviewData?.data?.reviews || [];

  // Safely calculate total expenses BEFORE any early return
  const computedExpenses = useMemo(() => {
    const apiExpenses = orderData?.pagination?.totalExpenses;
    if (typeof apiExpenses === "number") return apiExpenses;
    const rawOrders = orderData?.data?.orders || [];
    return rawOrders.reduce(
      (sum: number, o: any) => sum + (Number(o?.totalPrice) || 0),
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#F4F3F4] text-[#111111]">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-[#111111] text-white shadow-xl">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-neutral-500">
          Initializing Atelier Portal...
        </p>
      </div>
    );
  }

  // ── 4. DERIVED USER & TELEMETRY DATA ──

  const user: any = userData?.data?.user || userData?.user || {};
  const {
    fullName = "User",
    email = userData?.data?.email || "",
    avatar = "",
    role = "USER",
  } = user;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join("");

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

  const checkRole = role === "ADMIN" || role === "MANAGER";
  const membershipTier = checkRole
    ? "Executive Admin"
    : totalOrdersCount >= 5
      ? "Black VIP Member"
      : totalOrdersCount >= 1
        ? "Plus Member"
        : "Verified Member";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setAvatarError(false);
    await Promise.all([refetchUser(), refetchOrders(), refetchReviews()]);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const NAV_LINKS = checkRole
    ? [
        ...NAV.map((item) => ({
          ...item,
          badge:
            item.id === "orders"
              ? totalOrdersCount || undefined
              : item.id === "reviews"
                ? totalReviewsCount || undefined
                : undefined,
        })),
        { id: "dashboard", label: "Dashboard", icon: UserCog },
      ]
    : NAV.map((item) => ({
        ...item,
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

  const currentMeta = TAB_META[active] || TAB_META.overview;

  return (
    <div className="fixed inset-0 z-40 flex h-screen w-full overflow-hidden bg-[#ECECEE] text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      {/* ── 1. MOBILE ONLY: Bottom Floating Navigation ── */}
      <div className="fixed bottom-4 left-1/2 z-50 block w-[94%] max-w-md -translate-x-1/2 lg:hidden">
        <NavMobile arrayOfData={NAV_LINKS} active={active} goTo={goTo} />
      </div>

      {/* ── 2. DESKTOP SIDEBAR ── */}
      <SidebarDesktop
        active={active}
        arrayOfData={NAV_LINKS}
        goTo={goTo}
        navTitle="Client Workspace"
        headerContent={
          <div className="flex items-center gap-3 py-0.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#111111] font-mono text-xs font-black text-white shadow-sm ring-2 ring-black/5">
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
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-black uppercase tracking-tight text-[#111111]">
                  {fullName}
                </p>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              </div>
              <p className="truncate font-mono text-[10px] font-medium text-neutral-400">
                {email}
              </p>
            </div>
          </div>
        }
        extraFooterLinks={
          <Link
            href="/"
            className="group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-xs font-black uppercase tracking-wider text-neutral-500 transition-all hover:bg-neutral-100 hover:text-[#111111]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <Store size={15} />
            </div>
            <span>Back to Store</span>
          </Link>
        }
      />

      {/* ── 3. RIGHT INSET WORKSPACE ── */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden lg:p-2.5">
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F4F3F4] lg:rounded-[26px] lg:border lg:border-neutral-200/90 lg:shadow-[0_12px_45px_rgba(0,0,0,0.05)]">
          {/* Subtle Architectural Grid inside Workspace */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-size-[3.5rem_3.5rem]"
          />

          {/* ── Sticky Command Topbar ── */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="text-base font-black tracking-[-0.07em] text-[#111111] sm:text-lg lg:hidden"
              >
                SHOP.CO
              </Link>
              <span className="text-neutral-300 lg:hidden">/</span>

              <div className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 lg:flex">
                <span>Portal</span>
                <ChevronRight size={12} className="text-neutral-300" />
              </div>

              <div className="flex min-w-0 items-center gap-2.5">
                <h2 className="truncate text-xs font-black uppercase tracking-[0.08em] text-[#111111] sm:text-sm">
                  {currentMeta.title}
                </h2>
                <span className="hidden rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-neutral-600 sm:inline-block">
                  {currentMeta.badge}
                </span>
              </div>
            </div>

            {/* Center Quick Tab Switcher (XL Screens) */}
            <div className="hidden items-center gap-1 rounded-xl border border-neutral-200/80 bg-[#F4F3F4] p-1 xl:flex">
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
                        ? "text-white"
                        : "text-neutral-500 hover:text-[#111111]"
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
                        className="absolute inset-0 rounded-lg bg-[#111111] shadow-xs"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <TabIcon size={12} />
                      <span>{tab.label}</span>
                      {count !== null && count > 0 && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                            isTabActive
                              ? "bg-white/20 text-white"
                              : "bg-neutral-200 text-neutral-700"
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
                title="Sync Account Data"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-black hover:text-[#111111] active:scale-95"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin text-[#111111]" : ""}
                />
              </button>

              <Link
                href="/shop"
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-[#111111] transition hover:border-black hover:bg-neutral-50 sm:inline-flex"
              >
                <Store size={13} />
                <span>Showroom</span>
                <ArrowUpRight size={12} className="text-neutral-400" />
              </Link>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-[#111111] px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-white shadow-xs transition hover:bg-neutral-800 active:scale-95 sm:px-4"
              >
                <Edit3 size={12} />
                <span>Edit Profile</span>
              </button>
            </div>
          </header>

          {/* ── Scrollable Main Canvas ── */}
          <main
            ref={mainScrollRef}
            className="relative z-10 flex-1  overflow-y-auto Responsive py-5"
          >
            <div className=" space-y-6">
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
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/90 bg-[#050505] p-1 text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out xl:col-span-8"
                >
                  {/* Animated Conic Border Glow */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
                    <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#444_50%,#000000_100%)] opacity-40" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0A0C]/95 p-6 backdrop-blur-2xl sm:p-8">
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
                      className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[9rem] font-black leading-none tracking-tighter text-white/[0.03] sm:text-[13rem]"
                    >
                      {initials || "SC"}
                    </span>

                    {/* === TOP SECTION === */}
                    <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
                      {/* Avatar with Rotating Ring */}
                      <div className="relative shrink-0">
                        <div className="absolute -inset-2 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-white/25 opacity-70" />
                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          title="Change Portrait"
                          className="group/avatar relative flex h-26 w-26 cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border border-white/20 bg-white/10 font-mono text-2xl font-black text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] sm:h-28 sm:w-28 sm:text-3xl"
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/avatar:opacity-100">
                            <Edit3 size={18} className="text-white" />
                          </div>
                        </button>
                      </div>

                      {/* Identity Details + Copyable Email Pill */}
                      <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5 sm:items-start">
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-black shadow-sm">
                            <ShieldCheck size={10} />
                            {role}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-400">
                            <Sparkles size={9} />
                            {membershipTier}
                          </span>
                        </div>

                        <h1 className="w-full truncate text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                          {fullName}
                        </h1>

                        {email ? (
                          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <motion.button
                              type="button"
                              onClick={handleCopyEmail}
                              whileTap={{ scale: 0.96 }}
                              title="Click to copy email address"
                              className={`group/copy inline-flex max-w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-[11.5px] transition-all duration-200 ${
                                copiedEmail
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                  : "border-white/15 bg-white/[0.06] text-neutral-300 hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
                              }`}
                            >
                              <Mail
                                size={12}
                                className={`shrink-0 ${
                                  copiedEmail
                                    ? "text-emerald-400"
                                    : "text-neutral-400 group-hover/copy:text-white"
                                }`}
                              />
                              <span className="truncate">{email}</span>
                              {copiedEmail ? (
                                <Check
                                  size={12}
                                  className="shrink-0 text-emerald-400"
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
                    <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:mt-7 sm:grid-cols-3">
                      <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-black/40 px-4 py-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                          <span>Tier Readiness</span>
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
                              className="h-full rounded-full bg-linear-to-r from-neutral-400 via-white to-amber-300"
                            />
                          </div>
                          <span className="font-mono text-[10px] font-black text-white">
                            {tierProgress}%
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => goTo("orders")}
                        className="group/stat flex cursor-pointer flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/25 hover:bg-white/[0.08]"
                      >
                        <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-neutral-400">
                          Total Orders
                        </p>
                        <div className="mt-1 flex items-baseline justify-between gap-2">
                          <span className="font-mono text-xl font-black text-white">
                            {totalOrdersCount}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-neutral-500 transition-transform group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5 group-hover/stat:text-white"
                          />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => goTo("reviews")}
                        className="group/stat flex cursor-pointer flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/25 hover:bg-white/[0.08]"
                      >
                        <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-neutral-400">
                          Published Reviews
                        </p>
                        <div className="mt-1 flex items-baseline justify-between gap-2">
                          <span className="font-mono text-xl font-black text-white">
                            {totalReviewsCount}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-neutral-500 transition-transform group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5 group-hover/stat:text-white"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Right Bento Card: Pass / Quick Portal (4 Columns) */}
                <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/90 bg-white p-6 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] xl:col-span-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-black uppercase tracking-[0.18em] text-neutral-400">
                        SHOP.CO™ PASS
                      </p>
                      <h3 className="mt-1.5 text-lg font-black uppercase tracking-tight text-[#111111]">
                        {checkRole ? "Admin Command" : "Member Privileges"}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-md">
                      {checkRole ? <UserCog size={18} /> : <Crown size={18} />}
                    </div>
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-neutral-500">
                    {checkRole
                      ? "You hold elevated administrative privileges. Access the global store control center or manage personal activities below."
                      : "Enjoy priority courier processing, verified buyer badges, and complimentary 30-day atelier returns."}
                  </p>

                  {/* Cumulative Spend Pill */}
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8F8F8] px-4 py-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      Lifetime Spend
                    </span>
                    <span className="font-mono text-base font-black text-[#111111]">
                      ${computedExpenses.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-neutral-100 pt-3">
                    {checkRole ? (
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#111111] text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-neutral-800 active:scale-95"
                      >
                        <UserCog size={14} />
                        <span>Open Command Center</span>
                        <ArrowUpRight size={13} className="ml-1 opacity-60" />
                      </button>
                    ) : (
                      <Link
                        href="/shop"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-neutral-800 active:scale-95"
                      >
                        <Store size={14} />
                        <span>Explore Flagship Archive</span>
                        <ArrowUpRight size={13} className="ml-1 opacity-60" />
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
                      orders={orders as any}
                      reviews={reviews as any}
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
                      <div className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white p-6 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] lg:col-span-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-white">
                                <Settings size={17} />
                              </div>
                              <div>
                                <h3 className="text-sm font-black uppercase tracking-tight text-[#111111]">
                                  Identity &amp; Portrait
                                </h3>
                                <p className="text-[11px] font-medium text-neutral-400">
                                  Update your public patron profile
                                </p>
                              </div>
                            </div>

                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                              Verified
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between rounded-2xl bg-[#F8F8F8] p-3.5">
                              <span className="font-bold text-neutral-400">
                                Display Name
                              </span>
                              <span className="font-black uppercase text-[#111111]">
                                {fullName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-[#F8F8F8] p-3.5">
                              <span className="font-bold text-neutral-400">
                                Registered Email
                              </span>
                              <span className="font-mono font-bold text-[#111111]">
                                {email}
                              </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-[#F8F8F8] p-3.5">
                              <span className="font-bold text-neutral-400">
                                Access Tier
                              </span>
                              <span className="font-black uppercase text-[#111111]">
                                {membershipTier}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#111111] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition hover:bg-neutral-800"
                        >
                          <Edit3 size={14} />
                          <span>Modify Profile Details</span>
                        </button>
                      </div>

                      {/* Telemetry & Notification Toggles */}
                      <div className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white p-6 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] lg:col-span-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-white">
                              <Bell size={17} />
                            </div>
                            <div>
                              <h3 className="text-sm font-black uppercase tracking-tight text-[#111111]">
                                Dispatch &amp; Drop Alerts
                              </h3>
                              <p className="text-[11px] font-medium text-neutral-400">
                                Control how SHOP.CO Atelier contacts you
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[
                              {
                                key: "orderSms" as const,
                                title: "Courier Dispatch Updates",
                                sub: "Real-time notifications when your order ships",
                                icon: Smartphone,
                              },
                              {
                                key: "dropAlerts" as const,
                                title: "2026 Limited Drop Priority",
                                sub: "Early access alerts before collections sell out",
                                icon: Sparkles,
                              },
                              {
                                key: "privateProfile" as const,
                                title: "Incognito Patron Mode",
                                sub: "Hide your full name on public product reviews",
                                icon: Lock,
                              },
                            ].map((item) => {
                              const Icon = item.icon;
                              const isOn = prefs[item.key];
                              return (
                                <div
                                  key={item.key}
                                  onClick={() =>
                                    setPrefs((p) => ({
                                      ...p,
                                      [item.key]: !p[item.key],
                                    }))
                                  }
                                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-neutral-200/70 bg-[#F8F8F8] p-3.5 transition hover:border-black/20 hover:bg-white"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#111111] shadow-2xs">
                                      <Icon size={15} />
                                    </span>
                                    <div>
                                      <p className="text-xs font-black uppercase text-[#111111]">
                                        {item.title}
                                      </p>
                                      <p className="text-[11px] text-neutral-400">
                                        {item.sub}
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                                      isOn ? "bg-[#111111]" : "bg-neutral-300"
                                    }`}
                                  >
                                    <span
                                      className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                                        isOn ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-500/10 px-4 py-3 text-[11px] font-bold text-emerald-800">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Session Encrypted &amp;
                            Active
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
