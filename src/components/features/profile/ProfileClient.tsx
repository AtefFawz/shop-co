"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import UpdateProfileModal from "./UpdateProfile";
import { EmptyState } from "./EmptyState";
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
    title: "Account Preferences",
    badge: "Configuration",
    description: "Manage your personal details and security parameters.",
  },
};

export function ProfileClient() {
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

  const mainScrollRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Mouse Spotlight Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const heroSpotlight = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.09),
      transparent 80%
    )
  `;

  if (userLoading && !userData) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#050505] text-white">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
          Initializing Portal...
        </p>
      </div>
    );
  }

  const user = userData?.data?.user || userData?.user || {};
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

  const orders = orderData?.data?.orders || [];
  const reviews = reviewData?.data?.reviews || [];

  const pagination = {
    paginationOrders: orderData?.pagination || {
      total: 0,
      totalPages: 1,
      page: 1,
    },
    paginationReviews: reviewData?.pagination || {
      total: 0,
      totalPages: 1,
      page: 1,
    },
  };

  const totalOrdersCount = pagination.paginationOrders.total || orders.length;
  const totalReviewsCount =
    pagination.paginationReviews.total || reviews.length;

  const tierProgress = Math.min(
    100,
    Math.max(18, totalOrdersCount * 15 + totalReviewsCount * 10),
  );
  const membershipTier =
    role === "ADMIN" || role === "MANAGER"
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

  const checkRole = role === "ADMIN" || role === "MANAGER";
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
    <div className="fixed inset-0 z-40 flex h-screen w-full overflow-hidden bg-[#ECECEE] text-black antialiased selection:bg-black selection:text-white">
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
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#080808] font-mono text-xs font-black text-white shadow-sm ring-2 ring-black/5">
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
                <p className="truncate text-xs font-black uppercase tracking-tight text-black">
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
            className="group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-xs font-black uppercase tracking-wider text-gray-500 transition-all hover:bg-gray-100/80 hover:text-black"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-black group-hover:text-white">
              <Store size={15} />
            </div>
            <span>Back to Store</span>
          </Link>
        }
      />

      {/* ── 3. RIGHT INSET WORKSPACE ── */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden lg:p-2.5">
        <div className="flex h-full w-full flex-col overflow-hidden bg-[#F7F7F8] lg:rounded-[24px] lg:border lg:border-neutral-200/90 lg:shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          {/* ── Sticky Command Topbar ── */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="font-black tracking-[-0.07em] text-black text-base sm:text-lg lg:hidden"
              >
                SHOP.CO
              </Link>
              <span className="text-neutral-300 lg:hidden">/</span>

              <div className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 lg:flex">
                <span>Portal</span>
                <ChevronRight size={12} className="text-neutral-300" />
              </div>

              <div className="flex min-w-0 items-center gap-2.5">
                <h2 className="truncate text-xs font-black uppercase tracking-[0.08em] text-black sm:text-sm">
                  {currentMeta.title}
                </h2>
                <span className="hidden rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-neutral-600 sm:inline-block">
                  {currentMeta.badge}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-1 rounded-xl border border-neutral-200/80 bg-neutral-100/80 p-1 xl:flex">
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
                        : "text-neutral-500 hover:text-black"
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
                        className="absolute inset-0 rounded-lg bg-[#080808] shadow-sm"
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                title="Sync Account Data"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-black hover:text-black active:scale-95"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin text-black" : ""}
                />
              </button>

              <Link
                href="/"
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-black transition hover:border-black hover:bg-neutral-50 sm:inline-flex"
              >
                <Store size={13} />
                <span>Storefront</span>
                <ArrowUpRight size={12} className="text-neutral-400" />
              </Link>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-[#080808] px-3.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 sm:px-4"
              >
                <Edit3 size={12} />
                <span>Edit Profile</span>
              </button>
            </div>
          </header>

          {/* ── Scrollable Main Canvas ── */}
          <main
            ref={mainScrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 pb-32 sm:px-7 sm:py-8 lg:px-9 lg:pb-12"
          >
            <div className="mx-auto space-y-6">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* 1. Primary Identity Card (8 Columns) */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseMove={handleHeroMouseMove}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/90 bg-[#050505] p-1 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] xl:col-span-8"
                >
                  {/* Animated Conic Border Glow */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
                    <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#333_50%,#000000_100%)] opacity-35" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#080808]/95 p-6 backdrop-blur-2xl sm:p-8">
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
                      className="pointer-events-none absolute -bottom-10 -right-6 select-none font-black tracking-tighter text-white/[0.025] text-[9rem] sm:text-[13rem] leading-none"
                    >
                      {initials || "SC"}
                    </span>

                    {/* === TOP SECTION: Centered on Mobile, Left-Aligned on Desktop === */}
                    <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
                      {/* Avatar with Rotating Ring */}
                      <div className="relative shrink-0">
                        <div className="absolute -inset-2 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-white/20 opacity-60" />
                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          title="Change Avatar"
                          className="group/avatar relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border border-white/20 bg-white/10 text-2xl font-black text-white shadow-[0_0_30px_rgba(255,255,255,0.06)] sm:h-28 sm:w-28 sm:text-3xl"
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
                        {/* Role & Tier Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <ShieldCheck size={10} />
                            {role}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-400">
                            <Sparkles size={9} />
                            {membershipTier}
                          </span>
                        </div>

                        {/* User Full Name */}
                        <h1 className="w-full truncate text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                          {fullName}
                        </h1>

                        {/* ✨ Interactive Copyable Email Pill (Guaranteed Visible) ✨ */}
                        {email ? (
                          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <motion.button
                              type="button"
                              onClick={handleCopyEmail}
                              whileTap={{ scale: 0.96 }}
                              title="Click to copy email address"
                              className={`group/copy inline-flex max-w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-[11.5px] transition-all duration-200 ${
                                copiedEmail
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                  : "border-white/15 bg-white/[0.06] text-neutral-300 hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
                              }`}
                            >
                              <Mail
                                size={12}
                                className={`shrink-0 transition-colors ${
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
                                  className="shrink-0 opacity-60 transition-opacity group-hover/copy:opacity-100"
                                />
                              )}
                            </motion.button>

                            <AnimatePresence>
                              {copiedEmail && (
                                <motion.span
                                  initial={{ opacity: 0, x: -6, scale: 0.9 }}
                                  animate={{ opacity: 1, x: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: -6, scale: 0.9 }}
                                  className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/25"
                                >
                                  Copied!
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* === BOTTOM ROW: Stats Grid === */}
                    <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:mt-7 sm:grid-cols-3">
                      <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-black/40 px-4 py-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          <span>Account Standing: Optimal</span>
                        </div>
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${tierProgress}%` }}
                              transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.3,
                              }}
                              className="h-full rounded-full bg-gradient-to-r from-neutral-500 to-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
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

                {/* 2. Right Bento Card: Pass / Quick Portal */}
                <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.03)] xl:col-span-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-black uppercase tracking-[0.18em] text-neutral-400">
                        Shop.co Pass
                      </p>
                      <h3 className="mt-1.5 text-lg font-black uppercase tracking-tight text-black">
                        {checkRole ? "Admin Command" : "Member Privileges"}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#050505] text-white shadow-lg">
                      {checkRole ? <UserCog size={18} /> : <Crown size={18} />}
                    </div>
                  </div>

                  <p className="text-[13px] leading-relaxed text-neutral-500">
                    {checkRole
                      ? "You hold elevated administrative privileges. Access the global store control center or manage personal activities below."
                      : "Enjoy priority processing, verified product reviews, and exclusive instant account recovery protection."}
                  </p>

                  <div className="mt-2 border-t border-neutral-100 pt-4">
                    {checkRole ? (
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-neutral-800 hover:shadow-xl active:scale-95"
                      >
                        <UserCog size={14} />
                        <span>Admin Dashboard</span>
                        <ArrowUpRight size={13} className="ml-1 opacity-50" />
                      </button>
                    ) : (
                      <Link
                        href="/"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-neutral-800 hover:shadow-xl active:scale-95"
                      >
                        <Store size={14} />
                        <span>Explore Store</span>
                        <ArrowUpRight size={13} className="ml-1 opacity-50" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DYNAMIC TAB CONTENT ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="[&_.mb-10]:mb-6! [&_.mb-12]:mb-6! [&_.mt-12]:mt-6! [&_.space-y-10]:space-y-6!"
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
                    <EmptyState message="Settings under maintenance" />
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
