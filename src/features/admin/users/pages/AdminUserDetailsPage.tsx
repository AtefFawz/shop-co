import { cookies } from "next/headers";
import { serverApi } from "@/lib/serverApi";
import { messages, type Locale } from "@/shared/i18n/messages";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Calendar,
  ShoppingBag,
  Star,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Crown,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquareQuote,
} from "lucide-react";

import RoleSelector from "@/features/admin/users/components/UserRoleSelector";
import DeleteUserButton from "@/features/admin/users/components/DeleteUserButton";
import { AdminMetricCard } from "@/features/admin/dashboard/components/AdminMetricCard";

/* -------------------------------------------------------------------------- */
/*                                HELPER UTILS                                */
/* -------------------------------------------------------------------------- */

const getItemImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/80x80/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

/* -------------------------------------------------------------------------- */
/*                              MAIN SERVER PAGE                              */
/* -------------------------------------------------------------------------- */

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get("shopco-language")?.value === "en" ? "en" : "ar";
  const t = messages[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

  const currencyFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-EG",
    {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    },
  );

  let user = null;

  try {
    const response = await serverApi(`admin/users/${id}`);
    user = response?.data?.user;
  } catch (error: any) {
    console.error("Error loading user in Server Component:", error);
  }

  if (!user) return notFound();

  const ordersList: any[] = Array.isArray(user.orders) ? user.orders : [];
  const reviewsList: any[] = Array.isArray(user.reviews) ? user.reviews : [];

  // Financial & Loyalty Telemetry
  const totalSpent = ordersList.reduce(
    (acc: number, curr: any) => acc + (Number(curr.totalPrice) || 0),
    0,
  );
  const avgOrderValue =
    ordersList.length > 0 ? Math.round(totalSpent / ordersList.length) : 0;

  const deliveredOrders = ordersList.filter((o) =>
    ["delivered", "completed"].includes((o.status || "").toLowerCase()),
  ).length;

  const avgRating =
    reviewsList.length > 0
      ? (
          reviewsList.reduce(
            (acc: number, r: any) => acc + (Number(r.rating) || 5),
            0,
          ) / reviewsList.length
        ).toFixed(1)
      : "5.0";

  // Loyalty Tier Calculation
  const loyaltyTier =
    totalSpent >= 1500
      ? {
          name: t.userTierBlack,
          nextGoal: 3000,
          progress: 100,
          badge: t.userBadgeTop,
        }
      : totalSpent >= 500
        ? {
            name: t.userTierGold,
            nextGoal: 1500,
            progress: Math.min(100, Math.round((totalSpent / 1500) * 100)),
            badge: t.userBadgePriority,
          }
        : totalSpent > 0
          ? {
              name: t.userTierSilver,
              nextGoal: 500,
              progress: Math.min(100, Math.round((totalSpent / 500) * 100)),
              badge: t.userBadgeVerified,
            }
          : {
              name: t.userTierRegistered,
              nextGoal: 250,
              progress: 12,
              badge: t.userBadgeNew,
            };

  const joinDate = new Date(
    user.memberSince || user.createdAt || Date.now(),
  ).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getInitials = (name?: string) => {
    if (!name) return "VIP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const roleUpper = (user.role || "USER").toUpperCase();
  const roleLabel =
    roleUpper === "ADMIN"
      ? t.usersRoleAdmin
      : roleUpper === "MANAGER" || roleUpper === "MANGER"
        ? t.usersRoleManager
        : t.usersRoleMember;

  const statusLabel = (raw: string) => {
    const status = raw.toLowerCase();
    if (status === "delivered" || status === "completed")
      return t.userDetailDelivered;
    if (status === "shipped" || status === "transit" || status === "in transit")
      return t.ordersFilterShipped;
    if (status === "processing") return t.ordersFilterProcessing;
    if (status === "cancelled" || status === "canceled")
      return t.ordersFilterCancelled;
    return t.ordersFilterPending;
  };

  const shortId = (user._id || "").slice(-6).toUpperCase();

  return (
    <div
      dir={direction}
      className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-8"
    >
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS & HOLOGRAPHIC CARD STYLES                        */}
      {/* ================================================================== */}
      <style>{`
        @keyframes dossierEnter {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .dossier-stagger-1 { animation: dossierEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both; }
        .dossier-stagger-2 { animation: dossierEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.09s both; }
        .dossier-stagger-3 { animation: dossierEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
        .dossier-stagger-4 { animation: dossierEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.21s both; }

        .vip-3d-pass {
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .vip-3d-pass:hover {
            transform: rotateX(6deg) rotateY(-8deg) translateY(-4px);
            box-shadow: 0 30px 60px -15px rgba(var(--shadow-rgb),0.5);
          }
        }
      `}</style>

      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 w-full! space-y-6">
        {/* ================================================================ */}
        {/* 1. TOP COMMAND BAR & NAVIGATION                                  */}
        {/* ================================================================ */}
        <div className="dossier-stagger-1 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface/90 p-4 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)] backdrop-blur-xl sm:px-6 sm:py-4">
          <Link
            href="/dashboard/admin/users"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface-subtle px-4 py-2 text-xs font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>{t.userDetailBack}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-surface-subtle px-3.5 py-2 font-mono text-[11px] font-bold text-secondary sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span>
                {t.userDetailDossier} #{shortId}
              </span>
            </div>

            <DeleteUserButton userId={user._id} userName={user.fullName} />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. HERO DOSSIER STAGE + 3D VIP BLACK MEMBERSHIP PASS             */}
        {/* ================================================================ */}
        <div className="dossier-stagger-2 relative overflow-hidden rounded-[2.2rem] border border-border bg-surface p-2 shadow-[0_16px_45px_-14px_rgba(var(--shadow-rgb),0.07)] sm:p-8">
          {/* Giant Background Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 select-none text-[160px] font-black uppercase leading-none tracking-tighter text-primary/2.5"
          >
            SHOP.CO
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left 7 Columns: Avatar & Identity Details */}
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start lg:col-span-7">
              {/* Avatar Stage */}
              <div className="relative shrink-0">
                {user.avatar ? (
                  <div className="relative h-28 w-28 overflow-hidden rounded-4xl border-4 border-border bg-surface-muted shadow-lg sm:h-34 sm:w-34">
                    <Image
                      src={user.avatar}
                      alt={user.fullName || t.userDetailUnnamed}
                      fill
                      sizes="136px"
                      priority
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-4xl border-4 border-border bg-action font-mono text-3xl font-black text-on-action shadow-lg sm:h-34 sm:w-34">
                    {getInitials(user.fullName)}
                  </div>
                )}

                <span className="absolute -bottom-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-surface bg-success text-on-success shadow-md">
                  <ShieldCheck size={18} />
                </span>
              </div>

              {/* Identity Metadata & Role Controller */}
              <div className="min-w-0 flex-1 space-y-3.5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
                    <Crown size={11} className="text-rating" />
                    {roleLabel} · {t.userDetailClearance}
                  </span>

                  <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 font-mono text-[10px] font-extrabold text-secondary">
                    {loyaltyTier.badge}
                  </span>
                </div>

                <div>
                  <h1 className="truncate text-2xl font-black uppercase tracking-[-0.03em] text-primary sm:text-3xl">
                    {user.fullName || t.userDetailUnnamed}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-bold text-muted sm:justify-start">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={13} className="text-primary" />
                      {user.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      {t.userDetailMemberSince} {joinDate}
                    </span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                    {t.userDetailModifyRole}
                  </span>
                  <RoleSelector userId={user._id} initialRole={user.role} />
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 3D Holographic VIP Membership Pass */}
            <div style={{ perspective: "1100px" }} className="lg:col-span-5">
              <div className="vip-3d-pass relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-br from-action via-action to-action p-5 text-on-action shadow-[0_22px_50px_-12px_rgba(var(--shadow-rgb),0.4)]">
                {/* Ambient Foil Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-primary font-black text-xs">
                      S.
                    </span>
                    <span className="text-xs font-black tracking-[0.22em] text-on-action">
                      {t.userDetailPass}
                    </span>
                  </div>

                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-rating">
                    {loyaltyTier.name}
                  </span>
                </div>

                {/* Middle Pass Stats */}
                <div className="relative z-10 my-5 flex items-end justify-between">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/45">
                      {t.userDetailCumulativeSpend}
                    </span>
                    <span className="mt-0.5 block font-mono text-2xl font-black tracking-tight text-on-action">
                      {currencyFormatter.format(totalSpent)}
                    </span>
                  </div>

                  <div className="text-end font-mono">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/45">
                      {t.userDetailAverageOrder}
                    </span>
                    <span className="mt-0.5 block text-sm font-black text-success">
                      {currencyFormatter.format(avgOrderValue)}
                    </span>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-widest text-on-action/55">
                    <span>{t.userDetailTierReadiness}</span>
                    <span>{loyaltyTier.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${loyaltyTier.progress}%` }}
                      className="h-full rounded-full bg-linear-to-r from-white/70 via-white to-rating"
                    />
                  </div>
                </div>

                {/* Bottom Card Chip & Serial */}
                <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px] tracking-[0.22em] text-on-action/40">
                  <span>ID // {user._id}</span>
                  <span>2026™</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. DARK EXECUTIVE CLIENT TELEMETRY RIBBON                        */}
        {/* ================================================================ */}
        <div className="dossier-stagger-3 relative overflow-hidden rounded-2xl bg-action px-5 py-3.5 text-on-action shadow-[0_14px_34px_-10px_rgba(var(--shadow-rgb),0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-on-action">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/50">
                  {t.userDetailIntelligence}
                </p>
                <p className="text-xs font-extrabold tracking-wide text-on-action">
                  {t.userDetailOrdersSummary
                    .replace("{orders}", String(deliveredOrders))
                    .replace("{rating}", avgRating)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t.userDetailAverageTicket}
                </span>
                <span className="font-mono text-sm font-black text-on-action">
                  {currencyFormatter.format(avgOrderValue)}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t.userDetailCompletedOrders}
                </span>
                <span className="font-mono text-sm font-black text-success">
                  {deliveredOrders} {t.userDetailDelivered}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t.userDetailClientRating}
                </span>
                <span className="font-mono text-sm font-black text-rating">
                  {avgRating} / 5.0 ★
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. 3D KPI STAT CARDS GRID                                        */}
        {/* ================================================================ */}
        <div className="dossier-stagger-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminMetricCard
            icon={<ShoppingBag />}
            title={t.userDetailAllOrders}
            value={ordersList.length}
            trend={
              ordersList.length > 0
                ? `${deliveredOrders} ${t.userDetailCompleted}`
                : t.userDetailNoOrders
            }
            trendUp={ordersList.length > 0}
            subtitle={t.userDetailAllTimeVolume}
            verifiedLabel={t.userBadgeVerified}
            liveLabel={t.dashboardLiveStatus}
          />

          <AdminMetricCard
            icon={<DollarSign />}
            title={t.userDetailLifetimeValue}
            value={currencyFormatter.format(totalSpent)}
            trend={loyaltyTier.badge}
            trendUp={true}
            subtitle={`${t.userDetailAvgPerOrder}: ${currencyFormatter.format(
              avgOrderValue,
            )}`}
            verifiedLabel={t.userBadgeVerified}
            liveLabel={t.dashboardLiveStatus}
          />

          <AdminMetricCard
            icon={<Star />}
            title={t.userDetailSubmittedReviews}
            value={reviewsList.length}
            trend={`${avgRating} ★ ${t.userDetailRatingAverage}`}
            trendUp={Number(avgRating) >= 4}
            subtitle={t.userDetailVerifiedFeedback}
            verifiedLabel={t.userBadgeVerified}
            liveLabel={t.dashboardLiveStatus}
          />
        </div>

        {/* ================================================================ */}
        {/* 5. DETAILED ORDERS MANIFEST & CLIENT REVIEWS                     */}
        {/* ================================================================ */}
        <div className="dossier-stagger-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column: Recent Orders */}
          <section className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                    {t.userDetailTransactionLog}
                  </p>
                  <h2 className="mt-0.5 flex items-center gap-2 text-base font-black uppercase tracking-tight text-primary sm:text-lg">
                    <PackageCheck size={18} className="text-primary" />
                    {t.userDetailOrderHistory}
                  </h2>
                </div>

                <span className="rounded-full bg-surface-subtle px-3 py-1 font-mono text-xs font-black text-primary">
                  {ordersList.length} {t.userDetailRecords}
                </span>
              </div>

              {ordersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-subtle text-muted">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    {t.userDetailNoOrdersTitle}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {t.userDetailNoOrdersDescription}
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pe-1">
                  {ordersList.map((order: any) => {
                    const status = (
                      order.status || t.userDetailStatus
                    ).toLowerCase();
                    const isDelivered =
                      status === "delivered" || status === "completed";
                    const isShipped =
                      status === "shipped" || status === "transit";
                    const items: any[] = order.orderItems || [];

                    return (
                      <div
                        key={order._id}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface-subtle p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:shadow-md"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Order Item Thumbnails Stack */}
                          {items.length > 0 ? (
                            <div className="flex -space-x-2 shrink-0">
                              {items.slice(0, 3).map((it: any, idx: number) => (
                                <img
                                  key={idx}
                                  src={getItemImageUrl(it.image)}
                                  alt=""
                                  className="h-10 w-10 rounded-xl border-2 border-surface bg-surface object-cover shadow-2xs"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action text-on-action">
                              <ShoppingBag size={15} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-surface px-2 py-0.5 font-mono text-[10px] font-black text-primary shadow-2xs">
                                #{(order._id || "").slice(-6).toUpperCase()}
                              </span>
                              {order.createdAt && (
                                <span className="text-[10px] font-bold text-muted">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    locale === "ar" ? "ar-EG" : "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 font-mono text-sm font-black text-primary">
                              {currencyFormatter.format(
                                Number(order.totalPrice || 0),
                              )}
                              {items.length > 0 && (
                                <span className="ms-2 font-sans text-[11px] font-semibold text-muted">
                                  · {items.length} {t.userDetailUnits}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                            isDelivered
                              ? "border-success-border bg-success-soft text-success"
                              : isShipped
                                ? "border-info-border bg-info-soft text-info"
                                : "border-warning-border bg-warning-soft text-warning"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 size={11} />
                          ) : isShipped ? (
                            <Truck size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          {statusLabel(order.status || t.userDetailStatus)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Latest Reviews */}
          <section className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                    {t.userDetailCustomerSentiment}
                  </p>
                  <h2 className="mt-0.5 flex items-center gap-2 text-base font-black uppercase tracking-tight text-primary sm:text-lg">
                    <MessageSquareQuote size={18} className="text-primary" />
                    {t.userDetailLatestReviews}
                  </h2>
                </div>

                <span className="rounded-full bg-surface-subtle px-3 py-1 font-mono text-xs font-black text-primary">
                  {reviewsList.length} {t.userDetailReviewCount}
                </span>
              </div>

              {reviewsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-subtle text-muted">
                    <Star size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    {t.userDetailNoReviews}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {t.userDetailNoReviewsDescription}
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pe-1">
                  {reviewsList.map((review: any) => {
                    const rating = Number(review.rating) || 5;
                    return (
                      <div
                        key={review._id}
                        className="group space-y-3 rounded-2xl border border-border/80 bg-surface-subtle p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5 text-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={
                                    i < rating
                                      ? "fill-rating text-rating"
                                      : "text-subtle"
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[11px] font-black text-primary">
                              {rating}.0
                            </span>
                          </div>

                          <span className="truncate max-w-[180px] rounded-lg border border-border/80 bg-surface px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-secondary shadow-2xs">
                            {review.product?.name || t.userDetailCatalogGarment}
                          </span>
                        </div>

                        <p className="text-xs font-medium italic leading-relaxed text-secondary">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
