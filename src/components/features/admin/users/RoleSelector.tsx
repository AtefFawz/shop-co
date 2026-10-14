"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ChevronDown,
  Loader2,
  Crown,
  Shield,
  UserCheck,
  Check,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

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
    badgeClass: "bg-[#111111] text-white border-black shadow-md",
  },
  MANAGER: {
    label: "MANAGER",
    icon: Shield,
    badgeClass: "bg-sky-500/15 text-sky-800 border-sky-500/30",
  },
  USER: {
    label: "USER",
    icon: UserCheck,
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
  },
};

export default function RoleSelector({
  userId,
  initialRole,
}: RoleSelectorProps) {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>(
    (initialRole?.toUpperCase() as RoleType) || "USER",
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      left: Math.max(12, rect.left),
    });
  };

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
  }, [isOpen]);

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
      toast.success(`Clearance updated to ${newRole}`);
      router.refresh();
    } catch (error: any) {
      console.error("Role update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
      setRole(prevRole);
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = ROLE_CONFIG[role] || ROLE_CONFIG.USER;
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
        <span>{role}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
        />
      </button>

      {/* Floating Portal Menu */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
            className="w-44 overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="mb-1 flex items-center gap-1 border-b border-neutral-100 px-3 py-1.5">
              <Sparkles size={11} className="text-[#111111]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                Access Level
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
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                    isSelected
                      ? "bg-[#111111] text-white shadow-2xs"
                      : "hover:bg-[#F4F3F4] text-neutral-800"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={13} className="opacity-80" />
                    <span>{item.label}</span>
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
