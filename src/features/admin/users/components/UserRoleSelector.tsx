"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Crown, Shield, UserCheck, Check, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import { getApiErrorDetails } from "@/lib/errorUtils";
interface RoleSelectorProps {
  userId: string;
  initialRole: string;
}

type RoleType = "USER" | "MANAGER" | "ADMIN";

const ROLE_CONFIG: Record<
  RoleType,
  { label: RoleType; icon: React.ElementType; badgeClass: string }
> = {
  ADMIN: {
    label: "ADMIN",
    icon: Crown,
    badgeClass: "bg-action text-on-action border-border-strong shadow-md",
  },
  MANAGER: {
    label: "MANAGER",
    icon: Shield,
    badgeClass: "bg-info-soft text-info border-info-border",
  },
  USER: {
    label: "USER",
    icon: UserCheck,
    badgeClass: "bg-surface-muted text-secondary border-border",
  },
};

export default function UserRoleSelector({
  userId,
  initialRole,
}: RoleSelectorProps) {
  const router = useRouter();
  const { t, direction } = useLocale();
  const [role, setRole] = useState<RoleType>(
    (initialRole?.toUpperCase().replace("MANGER", "MANAGER") as RoleType) || "USER",
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      left: Math.max(12, Math.min(direction === "rtl" ? rect.right - 240 : rect.left, window.innerWidth - 240)),
    });
  }, [direction]);

  const toggleOpen = () => {
    if (loading) return;
    if (!isOpen) updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => updatePosition();

    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen, updatePosition]);

  const handleUpdateRole = async (newRole: RoleType) => {
    if (newRole === role || loading) {
      setIsOpen(false);
      return;
    }

    const prevRole = role;
    setRole(newRole);
    setIsOpen(false);
    setLoading(true);

    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      toast.success(t("usersRoleUpdatedToast"));
      router.refresh();
    } catch (error: unknown) {
      console.error("Role update failed:", error);
      toast.error(getApiErrorDetails(error).response?.data?.message || t("usersRoleFailedToast"));
      setRole(prevRole);
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = ROLE_CONFIG[role] || ROLE_CONFIG.USER;
  const translatedRole =
    role === "ADMIN"
      ? t("usersRoleAdmin")
      : role === "MANAGER"
        ? t("usersRoleManager")
        : t("usersRoleMember");
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={loading}
        onClick={toggleOpen}
        className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-2xs transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${currentConfig.badgeClass}`}
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <CurrentIcon size={13} />
        )}
        <span>{translatedRole}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
        />
      </button>

      {/* Floating Portal Menu */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            dir={direction}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
            className="w-44 overflow-hidden rounded-2xl border border-border-subtle bg-surface/95 p-1.5 shadow-[0_20px_50px_rgba(var(--shadow-rgb),0.22)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="mb-1 flex items-center gap-1 border-b border-border-subtle px-3 py-1.5">
              <Sparkles size={11} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-wider text-muted">
                {t("adminUserRole")}
              </span>
            </div>

            {(Object.keys(ROLE_CONFIG) as RoleType[]).map((r) => {
              const item = ROLE_CONFIG[r];
              const Icon = item.icon;
              const isSelected = role === r;

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleUpdateRole(r)}
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-start text-[10px] font-black uppercase tracking-widest transition-all ${
                    isSelected
                      ? "bg-action text-on-action shadow-2xs"
                      : "hover:bg-surface-subtle text-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={13} className="opacity-80" />
                    <span>
                      {r === "ADMIN"
                        ? t("usersRoleAdmin")
                        : r === "MANAGER"
                          ? t("usersRoleManager")
                          : t("usersRoleMember")}
                    </span>
                  </span>

                  {isSelected && <Check size={12} strokeWidth={3} />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
