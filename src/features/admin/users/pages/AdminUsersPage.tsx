"use client";

import { useEffect, useMemo, useState } from "react";
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

import UsersTable from "@/features/admin/users/components/AdminUsersTable";
import UsersMobile from "@/features/admin/users/components/AdminUsersMobileList";
import EmptyState from "@/features/admin/users/components/UsersEmptyState";
import useData from "@/hooks/getData";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import type { AdminUserRecord } from "@/types/domain";
export default function AdminUsersPage() {
  const { t, direction } = useLocale();
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
    document.title = `${t("usersDirectoryTitle")} | SHOP.CO™`;
  }, [t]);

  const users: AdminUserRecord[] = useMemo(() => {
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

    users.forEach((u: AdminUserRecord) => {
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
    const list = [...users].filter((u: AdminUserRecord) => {
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
    <div dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-6 text-primary sm:py-8">
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
            box-shadow: 0 22px 44px -12px rgba(var(--shadow-rgb), 0.12);
          }
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className=" Responsive relative z-10 space-y-6 ">
        {/* ================================================================ */}
        {/* 1. EXECUTIVE DIRECTORY HEADER                                    */}
        {/* ================================================================ */}
        <header className="user-enter-1 flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-12px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="md:text-[10px] text-[8px] text-nowrap font-black uppercase tracking-[0.22em] text-secondary">
                {t("usersPanelTitle")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
                {t("usersDirectoryTitle")}
              </h1>
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-[11px] font-black text-secondary">
                {countUsers} {t("usersAccounts")}
              </span>
            </div>

            <p className="text-xs font-medium text-muted">
              {t("usersManageDescription")}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border/90 bg-surface px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-subtle"
            >
              <Store size={14} />
              <span className="hidden sm:inline">{t("usersCommandCenter")}</span>
              <ArrowUpRight
                size={13}
                className="text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>

            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-action px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-on-action shadow-[0_12px_28px_-6px_rgba(var(--shadow-rgb),0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover active:scale-95 disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin text-success"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />
              <span>{loading ? t("usersSyncing") : t("usersSyncDirectory")}</span>
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. DARK LUXURY ACCESS TELEMETRY RIBBON                           */}
        {/* ================================================================ */}
        <div className="user-enter-2 relative overflow-hidden rounded-2xl bg-action px-5 py-3.5 text-on-action shadow-[0_14px_34px_-10px_rgba(var(--shadow-rgb),0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-on-action">
                <Sparkles size={14} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-action/50">
                  {t("usersMembershipPulse")}
                </p>
                <p className="text-xs font-extrabold tracking-wide text-on-action">
                  {telemetry.customerRatio}% {t("usersClientele")} ·{" "}
                  {telemetry.privilegedCount} {t("usersCommandStaff")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("usersSystemAdmins")}
                </span>
                <span className="font-mono text-sm font-black text-on-action">
                  {telemetry.admins} {t("usersRoot")}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("usersStoreManagers")}
                </span>
                <span className="font-mono text-sm font-black text-info">
                  {telemetry.managers} {t("usersActive")}
                </span>
              </div>

              <span className="hidden h-6 w-px bg-white/15 sm:block" />

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-on-action/45">
                  {t("usersNewThisMonth")}
                </span>
                <span className="font-mono text-sm font-black text-success">
                  +{telemetry.joinedThisMonth} {t("usersJoinedSuffix")}
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
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("usersTotalDirectory")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {countUsers}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("usersRegisteredProfiles")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-subtle text-primary transition-colors group-hover:bg-action group-hover:text-on-action">
              <Users size={19} />
            </div>
          </div>

          {/* Verified Members */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("usersClientele")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {telemetry.customers}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("usersStandardMembers")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-soft text-success">
              <ShieldCheck size={19} />
            </div>
          </div>

          {/* Privileged Roles */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("usersCommandStaff")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-primary sm:text-2xl">
                {telemetry.privilegedCount}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("usersAdminsAndManagers")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action text-on-action">
              <Crown size={19} />
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="user-3d-card group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted">
                {t("usersRecentOnboarding")}
              </p>
              <p className="mt-1 font-mono text-xl font-black text-success sm:text-2xl">
                +{telemetry.joinedThisMonth}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted">
                {t("usersJoinedThisMonth")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-secondary transition-colors group-hover:bg-action group-hover:text-on-action">
              <UserPlus size={19} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. INTERACTIVE SEARCH, ROLE FILTER, SORT & VIEW SWITCHER         */}
        {/* ================================================================ */}
        <div className="user-enter-3 flex flex-col justify-between gap-3.5 rounded-3xl border border-border bg-surface p-4 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)] sm:p-5 lg:flex-row lg:items-center">
          {/* Left: Instant Search + Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[230px] flex-1 sm:w-64 sm:flex-initial">
              <Search
                size={14}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("usersSearchPlaceholder")}
                className="w-full rounded-xl border border-border/90 bg-surface-subtle py-2 ps-9 pe-3 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border border-border/90 bg-surface-subtle p-1">
              {(
                [
                  { id: "all", label: `${t("usersFilterAll")} (${users.length})` },
                  { id: "admin", label: `${t("usersFilterAdmins")} (${telemetry.admins})` },
                  { id: "manager", label: `${t("usersFilterManagers")} (${telemetry.managers})` },
                  { id: "user", label: `${t("usersFilterMembers")} (${telemetry.customers})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                    roleFilter === tab.id
                      ? "bg-action text-on-action shadow-2xs"
                      : "text-muted hover:text-primary"
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
                className="pointer-events-none absolute start-3 text-muted"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label={t("usersSortLabel")}
                className="cursor-pointer appearance-none rounded-xl border border-border/90 bg-surface-subtle py-2 ps-8 pe-7 text-[11px] font-extrabold uppercase tracking-wider text-secondary focus:border-primary focus:bg-surface focus:outline-none"
              >
                <option value="newest">{t("usersSortNewest")}</option>
                <option value="oldest">{t("usersSortOldest")}</option>
                <option value="name-asc">{t("usersSortName")}</option>
              </select>
            </div>

            {/* Desktop View Switcher (Table vs 3D VIP Cards) */}
            <div className="hidden rounded-xl border border-border/90 bg-surface-subtle p-1 md:inline-flex">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "table"
                    ? "bg-action text-on-action"
                    : "text-muted hover:text-primary"
                }`}
              >
                <List size={13} />
                <span>{t("usersTableView")}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "grid"
                    ? "bg-action text-on-action"
                    : "text-muted hover:text-primary"
                }`}
              >
                <LayoutGrid size={13} />
                <span>{t("usersCardsView")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. LOADING SKELETON / EMPTY STATE / DIRECTORY VIEWS              */}
        {/* ================================================================ */}
        {loading ? (
          <div className="space-y-3 rounded-3xl border border-border bg-surface p-5 shadow-xs">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-full animate-pulse items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-subtle px-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-surface-hover/90" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-40 rounded bg-surface-hover/90" />
                    <div className="h-2.5 w-28 rounded bg-surface-hover/60" />
                  </div>
                </div>
                <div className="hidden h-7 w-24 rounded-xl bg-surface-hover/70 sm:block" />
                <div className="h-8 w-8 rounded-xl bg-surface-hover/90" />
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
