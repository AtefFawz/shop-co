"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Users,
  ShieldCheck,
  UserPlus,
  Sparkles,
  Search,
  ArrowUpDown,
  LayoutGrid,
  List,
  Store,
  ArrowUpRight,
  Crown,
} from "lucide-react";

import UsersTable from "@/components/features/admin/users/UsersTable";
import UsersMobile from "@/components/features/admin/users/UsersMobile";
import EmptyState from "@/components/features/admin/users/EmptyState";
import useData from "@/hooks/getData";

export default function AdminUsers() {
  const { loading, data, refetch } = useData("admin/users");

  // Interactive Studio States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "manager" | "user"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name-asc">(
    "newest",
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Update Browser Tab Title
  useEffect(() => {
    document.title = "Identity Directory · Users | SHOP.CO™";
  }, []);

  const users: any[] = useMemo(() => {
    return data?.data?.users ?? [];
  }, [data]);

  const countUsers = data?.pagination?.total ?? users.length;

  // Live Directory Telemetry
  const telemetry = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let admins = 0;
    let managers = 0;
    let customers = 0;
    let joinedThisMonth = 0;

    users.forEach((u: any) => {
      const role = (u.role || "USER").toUpperCase();
      if (role === "ADMIN") admins++;
      else if (role === "MANAGER" || role === "MANGER") managers++;
      else customers++;

      if (u.createdAt) {
        const d = new Date(u.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          joinedThisMonth++;
        }
      }
    });

    const privilegedCount = admins + managers;
    const customerRatio =
      users.length > 0 ? Math.round((customers / users.length) * 100) : 100;

    return {
      admins,
      managers,
      privilegedCount,
      customers,
      joinedThisMonth,
      customerRatio,
    };
  }, [users]);

  // Filtered & Sorted Users List
  const processedUsers = useMemo(() => {
    const list = [...users].filter((u: any) => {
      const role = (u.role || "USER").toUpperCase();

      if (roleFilter === "admin" && role !== "ADMIN") return false;
      if (roleFilter === "manager" && role !== "MANAGER" && role !== "MANGER")
        return false;
      if (
        roleFilter === "user" &&
        (role === "ADMIN" || role === "MANAGER" || role === "MANGER")
      )
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (u.fullName || "").toLowerCase().includes(q);
        const emailMatch = (u.email || "").toLowerCase().includes(q);
        const idMatch = (u._id || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || idMatch;
      }

      return true;
    });

    if (sortBy === "name-asc") {
      list.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    } else if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime(),
      );
    } else {
      // newest first
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    }

    return list;
  }, [users, searchQuery, roleFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-6 text-[#111111] sm:py-8">
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS & ENTRANCE KEYFRAMES                             */}
      {/* ================================================================== */}
      <style>{`
        @keyframes userFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .user-enter-1 { animation: userFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s both; }
        .user-enter-2 { animation: userFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.09s both; }
        .user-enter-3 { animation: userFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }

        .user-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .user-3d-card:hover {
            transform: translateY(-4px) rotateX(3deg) rotateY(-3deg);
            box-shadow: 0 22px 44px -12px rgba(17, 17, 17, 0.12);
          }
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className=" Responsive relative z-10 space-y-6 ">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE DIRECTORY HEADER                                    */}
        {/* ================================================================ */}
        <header className="user-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[#F4F3F4] px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="md:text-[10px] text-[8px] text-nowrap font-black uppercase tracking-[0.22em] text-neutral-700">
                ADMIN PANEL · IDENTITY &amp; ACCESS DIRECTORY
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
                All Users
              </h1>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-black text-neutral-700">
                {countUsers} Account{countUsers !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs font-medium text-neutral-500">
              Manage registered clientele, administrative privileges, and
              membership telemetry.
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-neutral-200/90 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-neutral-800 transition-all duration-200 hover:border-black hover:bg-neutral-50"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Command Center</span>
              <ArrowUpRight
                size={13}
                className="text-neutral-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
              />
            </Link>

            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#111111] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-emerald-400"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />
              <span>{loading ? "Syncing..." : "Sync Directory"}</span>
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. DARK LUXURY ACCESS TELEMETRY RIBBON                           */}
        {/* ================================================================ */}
        <div className="user-enter-2 relative overflow-hidden rounded-2xl bg-[#111111] px-5 py-3.5 text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Security &amp; Membership Pulse
                </p>
                <p className="text-xs font-extrabold tracking-wide text-white">
                  {telemetry.customerRatio}% Storefront Clientele ·{" "}
                  {telemetry.privilegedCount} Privileged Staff Account
                  {telemetry.privilegedCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  System Admins
                </span>
                <span className="font-mono text-sm font-black text-white">
                  {telemetry.admins} Root
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Store Managers
                </span>
                <span className="font-mono text-sm font-black text-sky-400">
                  {telemetry.managers} Active
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  New This Month
                </span>
                <span className="font-mono text-sm font-black text-emerald-400">
                  +{telemetry.joinedThisMonth} Joined
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. 3D KPI DIRECTORY STAT CARDS                                   */}
        {/* ================================================================ */}
        <div
          style={{ perspective: "1100px" }}
          className="user-enter-2 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {/* Total Accounts */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Total Directory
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {countUsers}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Registered Profiles
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F3F4] text-[#111111] transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <Users size={19} />
            </div>
          </div>

          {/* Verified Members */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Storefront Clients
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {telemetry.customers}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Standard Members
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck size={19} />
            </div>
          </div>

          {/* Privileged Roles */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Command Staff
              </p>
              <p className="mt-1 font-mono text-xl font-black text-[#111111] sm:text-2xl">
                {telemetry.privilegedCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Admins &amp; Managers
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <Crown size={19} />
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Recent Onboarding
              </p>
              <p className="mt-1 font-mono text-xl font-black text-emerald-600 sm:text-2xl">
                +{telemetry.joinedThisMonth}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                Joined This Month
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800 transition-colors group-hover:bg-[#111111] group-hover:text-white">
              <UserPlus size={19} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. INTERACTIVE SEARCH, ROLE FILTER, SORT & VIEW SWITCHER         */}
        {/* ================================================================ */}
        <div className="user-enter-3 flex flex-col justify-between gap-3.5 rounded-3xl border border-white/90 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Instant Search + Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[230px] flex-1 sm:w-64 sm:flex-initial">
              <Search
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, or #ID..."
                className="w-full rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-9 pr-3 text-xs font-semibold text-[#111111] placeholder:text-neutral-400 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border border-neutral-200/90 bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all", label: `All (${users.length})` },
                  { id: "admin", label: `Admins (${telemetry.admins})` },
                  { id: "manager", label: `Managers (${telemetry.managers})` },
                  { id: "user", label: `Members (${telemetry.customers})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                    roleFilter === tab.id
                      ? "bg-[#111111] text-white shadow-2xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort Dropdown + Desktop View Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute left-3 text-neutral-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort users"
                className="cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2 pl-8 pr-7 text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 focus:border-black focus:bg-white focus:outline-none"
              >
                <option value="newest">Sort: Newest Joined</option>
                <option value="oldest">Sort: Oldest Joined</option>
                <option value="name-asc">Sort: Name (A → Z)</option>
              </select>
            </div>

            {/* Desktop View Switcher (Table vs 3D VIP Cards) */}
            <div className="hidden rounded-xl border border-neutral-200/90 bg-[#F8F8F8] p-1 md:inline-flex">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "table"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                <List size={13} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "grid"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                <LayoutGrid size={13} />
                <span>3D Badges</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. LOADING SKELETON / EMPTY STATE / DIRECTORY VIEWS              */}
        {/* ================================================================ */}
        {loading ? (
          <div className="space-y-3 rounded-3xl border border-white/90 bg-white p-5 shadow-xs">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-full animate-pulse items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-[#F8F8F8] px-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-neutral-200/90" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-40 rounded bg-neutral-200/90" />
                    <div className="h-2.5 w-28 rounded bg-neutral-200/60" />
                  </div>
                </div>
                <div className="hidden h-7 w-24 rounded-xl bg-neutral-200/70 sm:block" />
                <div className="h-8 w-8 rounded-xl bg-neutral-200/90" />
              </div>
            ))}
          </div>
        ) : processedUsers.length === 0 ? (
          <EmptyState
            hasFilters={searchQuery.trim() !== "" || roleFilter !== "all"}
            onReset={resetFilters}
          />
        ) : (
          <div className="user-enter-3">
            {/* Desktop Table or 3D Grid */}
            <UsersTable users={processedUsers} viewMode={viewMode} />

            {/* Mobile Cards */}
            <UsersMobile users={processedUsers} />
          </div>
        )}
      </div>
    </div>
  );
}
