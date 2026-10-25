"use client";
import { getInitials } from "@/lib/initials";
import { getUserRoleBadge } from "@/features/admin/users/utils/roleBadge";


import React, { useState } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

interface Props {
  users: User[];
}

export default function AdminUsersMobileList({ users }: Props) {
  const router = useRouter();
  const { t, locale, direction } = useLocale();
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>(
    {},
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleNavigate = (id: string) => {
    router.push(`/dashboard/admin/users/about/${id}`);
  };

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    toast.success(`${t("usersCopyId")}: #${id.slice(-6).toUpperCase()} · ${t("usersCopied")}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div dir={direction} className="space-y-3.5 md:hidden">
      {users.map((user: User) => {
        const shortId = (user._id || "").slice(-6).toUpperCase();
        const roleInfo = getUserRoleBadge(user.role, t);
        const RoleIcon = roleInfo.icon;
        const hasAvatar = user.avatar && !brokenAvatars[user._id];

        return (
          <div
            key={user._id}
            onClick={() => handleNavigate(user._id)}
            className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_10px_28px_-10px_rgba(var(--shadow-rgb),0.07)] transition-all duration-300 active:scale-[0.99]"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* Smart Avatar with Monogram Fallback */}
                <div className="relative shrink-0">
                  {hasAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || t("usersUnnamed")}
                      loading="lazy"
                      onError={() =>
                        setBrokenAvatars((prev) => ({
                          ...prev,
                          [user._id]: true,
                        }))
                      }
                      className="h-12 w-12 rounded-2xl border-2 border-border-subtle object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-action font-mono text-xs font-black text-on-action shadow-2xs">
                      {getInitials(user.fullName)}
                    </div>
                  )}

                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface ${roleInfo.dotClass}`}
                  />
                </div>

                {/* User Info */}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black uppercase tracking-tight text-primary">
                    {user.fullName || t("usersUnnamed")}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-muted">
                    <Mail size={10} className="shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Copyable User ID Pill */}
              <button
                type="button"
                onClick={(e) => handleCopyId(e, user._id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-surface-muted px-2.5 py-1 font-mono text-[10px] font-black text-primary"
              >
                <span>#{shortId}</span>
                {copiedId === user._id ? (
                  <Check size={10} className="text-success" />
                ) : (
                  <Copy size={10} className="text-muted" />
                )}
              </button>
            </div>

            <div className="mx-4 h-px bg-surface-muted" />

            {/* Bottom Section */}
            <div className="flex items-center justify-between gap-2 bg-surface-subtle/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${roleInfo.className}`}
                >
                  <RoleIcon size={10} />
                  {roleInfo.label}
                </span>

                {user.createdAt && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted">
                    <Calendar size={10} />
                    {new Date(user.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-primary shadow-2xs">
                <span>{t("usersProfile")}</span>
                <ChevronRight size={12} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
