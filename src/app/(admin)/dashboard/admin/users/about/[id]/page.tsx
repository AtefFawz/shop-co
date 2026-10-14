// app/dashboard/admin/users/about/[id]/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { serverApi } from "@/lib/serverApi";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  Calendar,
  ShoppingBag,
  Star,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import RoleSelector from "@/components/features/admin/users/RoleSelector";
import DeleteUserButton from "@/components/features/admin/users/DeleteUserButton";
import StatCard from "@/components/features/admin/users/StateCard";

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
  } catch (e) {
    // fallback
  }
  return {
    title: "Member Dossier · Admin Studio",
    description: "Detailed profile telemetry and transaction records.",
  };
}

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

  const totalSpent =
    user.orders?.reduce(
      (acc: number, curr: any) => acc + (Number(curr.totalPrice) || 0),
      0,
    ) || 0;

  const joinDate = new Date(
    user.memberSince || user.createdAt,
  ).toLocaleDateString("en-US", {
    month: "long",
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

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-8">
      {/* ================================================================== */}
      {/* GPU 3D ENTRANCE KEYFRAMES                                          */}
      {/* ================================================================== */}
      <style>{`
        @keyframes dossierFade {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .dossier-enter { animation: dossierFade 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.04s both; }
        .dossier-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .dossier-3d-card:hover {
            transform: translateY(-4px) rotateX(2deg) rotateY(-2deg);
            box-shadow: 0 24px 48px -12px rgba(17, 17, 17, 0.12);
          }
        }
      `}</style>

      {/* Subtle Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className=" relative z-10 space-y-6 ">
        {/* ================================================================ */}
        {/* 1. TOP NAVIGATION & ACTIONS HEADER                               */}
        {/* ================================================================ */}
        <div className="dossier-enter flex items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white/90 p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-5">
          <Link
            href="/dashboard/admin/users"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 transition-colors hover:text-[#111111]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Back to Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-neutral-200/80 bg-[#F8F8F8] px-3.5 py-1.5 font-mono text-[10px] font-bold text-neutral-500 sm:inline-block">
              ID: {user._id}
            </span>
            <DeleteUserButton userId={user._id} userName={user.fullName} />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. MAIN 3D PROFILE BANNER CARD                                   */}
        {/* ================================================================ */}
        <div className="dossier-enter relative overflow-hidden rounded-[2.5rem] border border-white/90 bg-white p-6 shadow-[0_16px_45px_-14px_rgba(0,0,0,0.07)] sm:p-8 lg:p-10">
          {/* Background Decorative Stamp */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 select-none text-[180px] font-black uppercase tracking-tighter text-black/[0.02]"
          >
            VIP
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* User Avatar with Monogram Fallback */}
            <div className="relative shrink-0">
              {user.avatar ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-[2.2rem] border-4 border-[#F4F3F4] shadow-md sm:h-36 sm:w-36">
                  <Image
                    src={user.avatar}
                    alt={user.fullName || "User"}
                    fill
                    sizes="144px"
                    priority
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-[2.2rem] border-4 border-[#F4F3F4] bg-[#111111] font-mono text-3xl font-black text-white shadow-md sm:h-36 sm:w-36">
                  {getInitials(user.fullName)}
                </div>
              )}

              {/* Clearance Badge Icon */}
              <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-white bg-emerald-500 text-white shadow-sm">
                <ShieldCheck size={20} />
              </span>
            </div>

            {/* Profile Info & Role Controller */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-700">
                    {roleUpper} CLEARANCE
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="font-mono text-xs font-semibold text-neutral-400">
                    #{(user._id || "").slice(-6).toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111] sm:text-3xl">
                  {user.fullName || "Unnamed Client"}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-xs font-bold text-neutral-500 sm:text-sm lg:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} className="text-neutral-400" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-neutral-400" />
                    Joined {joinDate}
                  </span>
                </div>
              </div>

              {/* Interactive Role Selector */}
              <div className="flex items-center justify-center pt-2 lg:justify-start">
                <RoleSelector userId={user._id} initialRole={user.role} />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. 3D STATS GRID                                                 */}
        {/* ================================================================ */}
        <div
          style={{ perspective: "1100px" }}
          className="dossier-enter grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div className="dossier-3d-card h-full">
            <StatCard
              icon={<ShoppingBag className="text-blue-600" size={22} />}
              label="Total Orders"
              value={user.orders?.length || 0}
            />
          </div>

          <div className="dossier-3d-card h-full">
            <StatCard
              icon={<DollarSign className="text-emerald-600" size={22} />}
              label="Lifetime Value"
              value={`$${totalSpent.toLocaleString()}`}
            />
          </div>

          <div className="dossier-3d-card h-full">
            <StatCard
              icon={<Star className="text-amber-500" size={22} />}
              label="Catalog Reviews"
              value={user.reviews?.length || 0}
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. RECENT ORDERS & REVIEWS DETAILED SECTIONS                      */}
        {/* ================================================================ */}
        <div className="dossier-enter grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Orders Column */}
          <section className="space-y-4 rounded-3xl border border-white/90 bg-white p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] sm:p-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111] sm:text-lg">
                <PackageCheck size={18} className="text-[#111111]" />
                Recent Orders
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-xs font-extrabold text-neutral-600">
                {user.orders?.length || 0} Total
              </span>
            </div>

            {!user.orders || user.orders.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-neutral-400">
                No orders recorded for this profile yet.
              </div>
            ) : (
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {user.orders.map((order: any) => {
                  const status = (order.status || "Pending").toLowerCase();
                  const isDelivered =
                    status === "delivered" || status === "completed";
                  const isShipped =
                    status === "shipped" || status === "transit";

                  return (
                    <div
                      key={order._id}
                      className="group flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-4 transition-all duration-300 hover:border-black/20 hover:bg-white hover:shadow-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          #{(order._id || "").slice(-6).toUpperCase()}
                        </span>
                        <p className="font-mono text-sm font-black text-[#111111]">
                          ${Number(order.totalPrice || 0).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                          isDelivered
                            ? "bg-emerald-500/10 text-emerald-700"
                            : isShipped
                              ? "bg-sky-500/10 text-sky-700"
                              : "bg-amber-500/10 text-amber-800"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isDelivered
                              ? "bg-emerald-500"
                              : isShipped
                                ? "bg-sky-500"
                                : "bg-amber-500"
                          }`}
                        />
                        {order.status || "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Reviews Column */}
          <section className="space-y-4 rounded-3xl border border-white/90 bg-white p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] sm:p-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111] sm:text-lg">
                <Star size={18} className="fill-amber-400 text-amber-500" />
                Latest Reviews
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-xs font-extrabold text-neutral-600">
                {user.reviews?.length || 0} Total
              </span>
            </div>

            {!user.reviews || user.reviews.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-neutral-400">
                No catalog reviews submitted by this client.
              </div>
            ) : (
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {user.reviews.map((review: any) => (
                  <div
                    key={review._id}
                    className="space-y-2.5 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-4 transition-all duration-300 hover:border-black/20 hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < (review.rating || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-300"
                            }
                          />
                        ))}
                      </div>

                      <span className="rounded-md border border-neutral-200/80 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-neutral-700">
                        {review.product?.name || "Catalog Item"}
                      </span>
                    </div>

                    <p className="text-xs font-medium italic leading-relaxed text-neutral-600">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
