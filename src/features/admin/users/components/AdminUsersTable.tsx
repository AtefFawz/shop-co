"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  Shield,
  ChevronRight,
  Copy,
  Check,
  Mail,
  Calendar,
  Crown,
  Sparkles,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface UsersTableProps {
  users: User[];
  viewMode?: "table" | "grid";
}

export default function AdminUsersTable({
  users,
  viewMode = "table",
}: UsersTableProps) {
  const router = useRouter();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>(
    {},
  );

  const clickUser = (id: string) => {
    router.push(`/dashboard/admin/users/about/${id}`);
  };

  const handleCopy = (
    e: React.MouseEvent,
    text: string,
    label: string,
    key: string,
  ) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleBadge = (rawRole?: string) => {
    const r = (rawRole || "USER").toUpperCase();
    if (r === "ADMIN") {
      return {
        label: "ADMIN",
        icon: Crown,
        className:
          "border-border-strong bg-action text-on-action shadow-[0_6px_16px_-4px_rgba(var(--shadow-rgb),0.4)]",
        dotClass: "bg-success-bright",
      };
    }
    if (r === "MANAGER" || r === "MANGER") {
      return {
        label: "MANAGER",
        icon: Shield,
        className: "border-info-border bg-info-soft text-info",
        dotClass: "bg-info",
      };
    }
    return {
      label: "MEMBER",
      icon: UserCheck,
      className: "border-border/80 bg-surface-subtle text-secondary",
      dotClass: "bg-surface-hover",
    };
  };

  if (viewMode === "grid") {
    /* ==================================================================== */
    /* MODE B: 3D VIP IDENTITY BADGE CARDS (DESKTOP GRID)                   */
    /* ==================================================================== */
    return (
      <div
        style={{ perspective: "1200px" }}
        className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {users.map((user: any) => {
          const shortId = (user._id || "").slice(-6).toUpperCase();
          const roleInfo = getRoleBadge(user.role);
          const RoleIcon = roleInfo.icon;
          const hasAvatar = user.avatar && !brokenAvatars[user._id];

          return (
            <div
              key={user._id}
              onClick={() => clickUser(user._id)}
              className="user-3d-card group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[0_12px_32px_-12px_rgba(var(--shadow-rgb),0.06)]"
            >
              {/* Top Lanyard Slot Aesthetic */}
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-surface-hover/80 transition-colors group-hover:bg-action" />

              {/* Header: ID + Role Pill */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) =>
                    handleCopy(e, user._id, `ID #${shortId}`, `id-${user._id}`)
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-2 py-1 font-mono text-[10px] font-black text-secondary transition-colors hover:bg-action hover:text-on-action"
                >
                  <span>#{shortId}</span>
                  {copiedKey === `id-${user._id}` ? (
                    <Check size={10} className="text-success" />
                  ) : (
                    <Copy size={10} className="opacity-60" />
                  )}
                </button>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${roleInfo.className}`}
                >
                  <RoleIcon size={11} />
                  {roleInfo.label}
                </span>
              </div>

              {/* Center Avatar & Profile */}
              <div className="my-5 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  {hasAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || "User"}
                      onError={() =>
                        setBrokenAvatars((prev) => ({
                          ...prev,
                          [user._id]: true,
                        }))
                      }
                      className="h-16 w-16 rounded-2xl border-2 border-surface object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-surface bg-action font-mono text-lg font-black text-on-action shadow-md transition-transform duration-300 group-hover:scale-105">
                      {getInitials(user.fullName)}
                    </div>
                  )}

                  <span
                    className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-surface ${roleInfo.dotClass}`}
                  />
                </div>

                <h3 className="max-w-full truncate text-sm font-black uppercase tracking-tight text-primary">
                  {user.fullName || "Unnamed User"}
                </h3>

                <button
                  type="button"
                  onClick={(e) =>
                    handleCopy(e, user.email || "", "Email", `mail-${user._id}`)
                  }
                  className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] font-medium text-muted hover:text-primary"
                >
                  <span className="truncate">{user.email}</span>
                  {copiedKey === `mail-${user._id}` && (
                    <Check size={11} className="shrink-0 text-success" />
                  )}
                </button>
              </div>

              {/* Footer: Joined Date & Inspect CTA */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-3.5 text-[10px] font-bold text-muted">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={11} />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>

                <span className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-primary group-hover:underline">
                  Inspect
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ====================================================================== */
  /* MODE A: EDITORIAL DIRECTORY TABLE (DEFAULT DESKTOP VIEW)               */
  /* ====================================================================== */
  return (
    <div className="hidden w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)] md:block">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-subtle/70 text-[9px] font-black uppercase tracking-[0.18em] text-muted">
              <th className="py-4 px-5">Account ID</th>
              <th className="py-4 px-4">Member Profile</th>
              <th className="py-4 px-4">Access Clearance</th>
              <th className="py-4 px-4">Onboarding Date</th>
              <th className="py-4 px-5 text-right">Dossier</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle text-xs">
            {users.map((user: any) => {
              const shortId = (user._id || "").slice(-6).toUpperCase();
              const roleInfo = getRoleBadge(user.role);
              const RoleIcon = roleInfo.icon;
              const hasAvatar = user.avatar && !brokenAvatars[user._id];

              return (
                <tr
                  key={user._id}
                  onClick={() => clickUser(user._id)}
                  className="group cursor-pointer transition-colors duration-150 hover:bg-surface-subtle"
                >
                  {/* 1. User ID with One-Click Copy */}
                  <td className="py-4 px-5 align-middle">
                    <button
                      type="button"
                      onClick={(e) =>
                        handleCopy(
                          e,
                          user._id,
                          `User ID #${shortId}`,
                          `id-${user._id}`,
                        )
                      }
                      title="Click to copy full User ID"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/80 bg-surface-muted px-2.5 py-1 font-mono text-xs font-black text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
                    >
                      <span>#{shortId}</span>
                      {copiedKey === `id-${user._id}` ? (
                        <Check size={11} className="text-success" />
                      ) : (
                        <Copy size={11} className="opacity-50" />
                      )}
                    </button>
                  </td>

                  {/* 2. Customer Avatar, Name & Copyable Email */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        {hasAvatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName || "User"}
                            onError={() =>
                              setBrokenAvatars((prev) => ({
                                ...prev,
                                [user._id]: true,
                              }))
                            }
                            className="h-11 w-11 rounded-2xl border-2 border-surface object-cover shadow-xs transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-surface bg-action font-mono text-xs font-black text-on-action shadow-xs transition-transform duration-300 group-hover:scale-105">
                            {getInitials(user.fullName)}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface ${roleInfo.dotClass}`}
                        />
                      </div>

                      <div className="min-w-0 max-w-[220px] xl:max-w-[280px]">
                        <p className="truncate text-xs font-black text-primary sm:text-sm">
                          {user.fullName || "Unnamed User"}
                        </p>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopy(
                              e,
                              user.email || "",
                              "Email address",
                              `mail-${user._id}`,
                            )
                          }
                          title="Click to copy email"
                          className="mt-0.5 inline-flex max-w-full cursor-pointer items-center gap-1.5 truncate text-[11px] font-medium text-muted transition-colors hover:text-primary"
                        >
                          <Mail size={10} className="shrink-0" />
                          <span className="truncate">{user.email}</span>
                          {copiedKey === `mail-${user._id}` && (
                            <Check
                              size={11}
                              className="shrink-0 text-success"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* 3. Role Badge */}
                  <td className="py-4 px-4 align-middle">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${roleInfo.className}`}
                    >
                      <RoleIcon size={11} />
                      <span>{roleInfo.label}</span>
                    </span>
                  </td>

                  {/* 4. Joined Date */}
                  <td className="py-4 px-4 align-middle">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary">
                      <Calendar size={12} className="text-muted" />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>

                  {/* 5. Action Indicator */}
                  <td className="py-4 px-5 text-right align-middle">
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary shadow-2xs transition-all duration-200 group-hover:border-border-strong group-hover:bg-action group-hover:text-on-action">
                      <span>Profile</span>
                      <ChevronRight
                        size={13}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
