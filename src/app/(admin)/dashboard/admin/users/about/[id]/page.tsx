// app/dashboard/admin/users/about/[id]/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { serverApi } from "@/lib/serverApi";
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
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquareQuote,
} from "lucide-react";

import RoleSelector from "@/components/features/admin/users/RoleSelector";
import DeleteUserButton from "@/components/features/admin/users/DeleteUserButton";
import { StatCard } from "@/components/features/admin/StateCard";

/* -------------------------------------------------------------------------- */
/*                         DYNAMIC METADATA GENERATOR                         */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await serverApi(`admin/users/${id}`);
    const u = response?.data?.user;
    if (u?.fullName) {
      return {
        title: `${u.fullName} · VIP Dossier`,
        description: `Manage profile, access clearance, and order history for ${u.fullName} (${u.email}).`,
      };
    }
  } catch {
    // ignore fallback
  }
  return {
    title: "Member Dossier · Admin Studio",
    description: "Detailed profile telemetry and transaction records.",
  };
}

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

export default async function AboutUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
          name: "BLACK MONOLITH VIP",
          nextGoal: 3000,
          progress: 100,
          badge: "Top 1% Client",
        }
      : totalSpent >= 500
        ? {
            name: "GOLD ATELIER",
            nextGoal: 1500,
            progress: Math.min(100, Math.round((totalSpent / 1500) * 100)),
            badge: "Priority Client",
          }
        : totalSpent > 0
          ? {
              name: "SILVER ARCHIVE",
              nextGoal: 500,
              progress: Math.min(100, Math.round((totalSpent / 500) * 100)),
              badge: "Verified Buyer",
            }
          : {
              name: "REGISTERED MEMBER",
              nextGoal: 250,
              progress: 12,
              badge: "New Account",
            };

  const joinDate = new Date(
    user.memberSince || user.createdAt || Date.now(),
  ).toLocaleDateString("en-US", {
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
  const shortId = (user._id || "").slice(-6).toUpperCase();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-8">
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
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>

      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10  w-full! space-y-6 ">
        {/* ================================================================ */}
        {/* 1. TOP COMMAND BAR & NAVIGATION                                  */}
        {/* ================================================================ */}
        <div className="dossier-stagger-1 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white/90 p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:px-6 sm:py-4">
          <Link
            href="/dashboard/admin/users"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-700 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Back to Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] px-3.5 py-2 font-mono text-[11px] font-bold text-neutral-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>DOSSIER #{shortId}</span>
            </div>

            <DeleteUserButton userId={user._id} userName={user.fullName} />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. HERO DOSSIER STAGE + 3D VIP BLACK MEMBERSHIP PASS             */}
        {/* ================================================================ */}
        <div className="dossier-stagger-2 relative overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-2 shadow-[0_16px_45px_-14px_rgba(0,0,0,0.07)] sm:p-8">
          {/* Giant Background Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 select-none text-[160px] font-black uppercase leading-none tracking-tighter text-black/2.5"
          >
            SHOP.CO
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left 7 Columns: Avatar & Identity Details */}
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left lg:col-span-7">
              {/* Avatar Stage */}
              <div className="relative shrink-0">
                {user.avatar ? (
                  <div className="relative h-28 w-28 overflow-hidden rounded-4xl border-4 border-[#F4F3F4] bg-neutral-100 shadow-lg sm:h-34 sm:w-34">
                    <Image
                      src={user.avatar}
                      alt={user.fullName || "User"}
                      fill
                      sizes="136px"
                      priority
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-4xl border-4 border-[#F4F3F4] bg-[#111111] font-mono text-3xl font-black text-white shadow-lg sm:h-34 sm:w-34">
                    {getInitials(user.fullName)}
                  </div>
                )}

                <span className="absolute -bottom-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-emerald-500 text-white shadow-md">
                  <ShieldCheck size={18} />
                </span>
              </div>

              {/* Identity Metadata & Role Controller */}
              <div className="min-w-0 flex-1 space-y-3.5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    <Crown size={11} className="text-amber-400" />
                    {roleUpper} CLEARANCE
                  </span>

                  <span className="rounded-full border border-neutral-200 bg-[#F8F8F8] px-3 py-1 font-mono text-[10px] font-extrabold text-neutral-600">
                    {loyaltyTier.badge}
                  </span>
                </div>

                <div>
                  <h1 className="truncate text-2xl font-black uppercase tracking-[-0.03em] text-[#111111] sm:text-3xl">
                    {user.fullName || "Unnamed Client"}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-bold text-neutral-500 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={13} className="text-neutral-900" />
                      {user.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-900" />
                      Member since {joinDate}
                    </span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Modify Clearance:
                  </span>
                  <RoleSelector userId={user._id} initialRole={user.role} />
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 3D Holographic VIP Membership Pass */}
            <div style={{ perspective: "1100px" }} className="lg:col-span-5">
              <div className="vip-3d-pass relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-br from-[#18181C] via-[#111111] to-[#08080A] p-5 text-white shadow-[0_22px_50px_-12px_rgba(0,0,0,0.4)]">
                {/* Ambient Foil Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-black text-xs">
                      S.
                    </span>
                    <span className="text-xs font-black tracking-[0.22em] text-white">
                      SHOP.CO PASS
                    </span>
                  </div>

                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-400">
                    {loyaltyTier.name}
                  </span>
                </div>

                {/* Middle Pass Stats */}
                <div className="relative z-10 my-5 flex items-end justify-between">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                      Cumulative Spend
                    </span>
                    <span className="mt-0.5 block font-mono text-2xl font-black tracking-tight text-white">
                      ${totalSpent.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                      Avg Order
                    </span>
                    <span className="mt-0.5 block text-sm font-black text-emerald-400">
                      ${avgOrderValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-widest text-white/55">
                    <span>Tier Readiness</span>
                    <span>{loyaltyTier.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${loyaltyTier.progress}%` }}
                      className="h-full rounded-full bg-linear-to-r from-white/70 via-white to-amber-300"
                    />
                  </div>
                </div>

                {/* Bottom Card Chip & Serial */}
                <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px] tracking-[0.22em] text-white/40">
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
        <div className="dossier-stagger-3 relative overflow-hidden rounded-2xl bg-[#111111] px-5 py-3.5 text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Client Intelligence Summary
                </p>
                <p className="text-xs font-extrabold tracking-wide text-white">
                  {deliveredOrders} of {ordersList.length} Orders Fulfilled ·{" "}
                  {avgRating}★ Average Product Sentiment
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Average Ticket
                </span>
                <span className="font-mono text-sm font-black text-white">
                  ${avgOrderValue.toLocaleString()}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Completed Orders
                </span>
                <span className="font-mono text-sm font-black text-emerald-400">
                  {deliveredOrders} Delivered
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Client Rating
                </span>
                <span className="font-mono text-sm font-black text-amber-400">
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
          <StatCard
            icon={ShoppingBag}
            title="Total Orders Placed"
            value={ordersList.length}
            trend={
              ordersList.length > 0
                ? `${deliveredOrders} Completed`
                : "No Orders"
            }
            trendUp={ordersList.length > 0}
            subtitle="All-time checkout volume"
          />

          <StatCard
            icon={DollarSign}
            title="Lifetime Value (LTV)"
            value={totalSpent}
            prefix="$"
            trend={loyaltyTier.badge}
            trendUp={true}
            subtitle={`Avg. $${avgOrderValue.toLocaleString()} per order`}
          />

          <StatCard
            icon={Star}
            title="Submitted Reviews"
            value={reviewsList.length}
            trend={`${avgRating} ★ Avg`}
            trendUp={Number(avgRating) >= 4}
            subtitle="Verified catalog feedback"
          />
        </div>

        {/* ================================================================ */}
        {/* 5. DETAILED ORDERS MANIFEST & CLIENT REVIEWS                     */}
        {/* ================================================================ */}
        <div className="dossier-stagger-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column: Recent Orders */}
          <section className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white p-5 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    Transaction Log
                  </p>
                  <h2 className="mt-0.5 flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111] sm:text-lg">
                    <PackageCheck size={18} className="text-[#111111]" />
                    Order History
                  </h2>
                </div>

                <span className="rounded-full bg-[#F4F3F4] px-3 py-1 font-mono text-xs font-black text-[#111111]">
                  {ordersList.length} Record{ordersList.length === 1 ? "" : "s"}
                </span>
              </div>

              {ordersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F8F8] text-neutral-400">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#111111]">
                    No Orders Placed Yet
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Purchases made by this client will appear here
                    automatically.
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {ordersList.map((order: any) => {
                    const status = (order.status || "Pending").toLowerCase();
                    const isDelivered =
                      status === "delivered" || status === "completed";
                    const isShipped =
                      status === "shipped" || status === "transit";
                    const items: any[] = order.orderItems || [];

                    return (
                      <div
                        key={order._id}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:shadow-md"
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
                                  className="h-10 w-10 rounded-xl border-2 border-white bg-white object-cover shadow-2xs"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                              <ShoppingBag size={15} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-black text-[#111111] shadow-2xs">
                                #{(order._id || "").slice(-6).toUpperCase()}
                              </span>
                              {order.createdAt && (
                                <span className="text-[10px] font-bold text-neutral-400">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 font-mono text-sm font-black text-[#111111]">
                              ${Number(order.totalPrice || 0).toLocaleString()}
                              {items.length > 0 && (
                                <span className="ml-2 font-sans text-[11px] font-semibold text-neutral-400">
                                  · {items.length} item
                                  {items.length === 1 ? "" : "s"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                            isDelivered
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                              : isShipped
                                ? "border-sky-500/25 bg-sky-500/10 text-sky-700"
                                : "border-amber-500/25 bg-amber-500/10 text-amber-800"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 size={11} />
                          ) : isShipped ? (
                            <Truck size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          {order.status || "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Latest Reviews */}
          <section className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white p-5 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    Client Sentiment
                  </p>
                  <h2 className="mt-0.5 flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111] sm:text-lg">
                    <MessageSquareQuote size={18} className="text-[#111111]" />
                    Latest Reviews
                  </h2>
                </div>

                <span className="rounded-full bg-[#F4F3F4] px-3 py-1 font-mono text-xs font-black text-[#111111]">
                  {reviewsList.length} Review
                  {reviewsList.length === 1 ? "" : "s"}
                </span>
              </div>

              {reviewsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F8F8] text-neutral-400">
                    <Star size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#111111]">
                    No Reviews Submitted Yet
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Product ratings and written feedback will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {reviewsList.map((review: any) => {
                    const rating = Number(review.rating) || 5;
                    return (
                      <div
                        key={review._id}
                        className="group space-y-3 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={
                                    i < rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-neutral-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[11px] font-black text-[#111111]">
                              {rating}.0
                            </span>
                          </div>

                          <span className="truncate max-w-[180px] rounded-lg border border-neutral-200/80 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-neutral-700 shadow-2xs">
                            {review.product?.name || "Catalog Garment"}
                          </span>
                        </div>

                        <p className="text-xs font-medium italic leading-relaxed text-neutral-600">
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
