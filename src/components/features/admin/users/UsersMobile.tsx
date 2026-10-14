"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  Crown,
  Shield,
  UserCheck,
  Calendar,
  ChevronRight,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  users: User[];
}

export default function UsersMobile({ users }: Props) {
  const router = useRouter();
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
    toast.success(`ID #${id.slice(-6).toUpperCase()} copied`);
    setTimeout(() => setCopiedId(null), 1800);
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
        className: "border-black bg-[#111111] text-white",
        dotClass: "bg-emerald-500",
      };
    }
    if (r === "MANAGER" || r === "MANGER") {
      return {
        label: "MANAGER",
        icon: Shield,
        className: "border-sky-500/30 bg-sky-500/10 text-sky-800",
        dotClass: "bg-sky-500",
      };
    }
    return {
      label: "MEMBER",
      icon: UserCheck,
      className: "border-neutral-200 bg-neutral-100 text-neutral-700",
      dotClass: "bg-neutral-400",
    };
  };

  return (
    <div className="space-y-3.5 md:hidden">
      {users.map((user: any) => {
        const shortId = (user._id || "").slice(-6).toUpperCase();
        const roleInfo = getRoleBadge(user.role);
        const RoleIcon = roleInfo.icon;
        const hasAvatar = user.avatar && !brokenAvatars[user._id];

        return (
          <div
            key={user._id}
            onClick={() => handleNavigate(user._id)}
            className="group cursor-pointer overflow-hidden rounded-3xl border border-white/90 bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.07)] transition-all duration-300 active:scale-[0.99]"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* Smart Avatar with Monogram Fallback */}
                <div className="relative shrink-0">
                  {hasAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || "User"}
                      loading="lazy"
                      onError={() =>
                        setBrokenAvatars((prev) => ({
                          ...prev,
                          [user._id]: true,
                        }))
                      }
                      className="h-12 w-12 rounded-2xl border-2 border-neutral-100 object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] font-mono text-xs font-black text-white shadow-2xs">
                      {getInitials(user.fullName)}
                    </div>
                  )}

                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${roleInfo.dotClass}`}
                  />
                </div>

                {/* User Info */}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black uppercase tracking-tight text-[#111111]">
                    {user.fullName || "Unnamed User"}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-neutral-400">
                    <Mail size={10} className="shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Copyable User ID Pill */}
              <button
                type="button"
                onClick={(e) => handleCopyId(e, user._id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 font-mono text-[10px] font-black text-[#111111]"
              >
                <span>#{shortId}</span>
                {copiedId === user._id ? (
                  <Check size={10} className="text-emerald-500" />
                ) : (
                  <Copy size={10} className="text-neutral-400" />
                )}
              </button>
            </div>

            <div className="mx-4 h-px bg-neutral-100" />

            {/* Bottom Section */}
            <div className="flex items-center justify-between gap-2 bg-[#F8F8F8]/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${roleInfo.className}`}
                >
                  <RoleIcon size={10} />
                  {roleInfo.label}
                </span>

                {user.createdAt && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                    <Calendar size={10} />
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#111111] shadow-2xs">
                <span>Profile</span>
                <ChevronRight size={12} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
