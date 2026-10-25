import { Crown, Shield, UserCheck, type LucideIcon } from "lucide-react";
import type { MessageKey } from "@/shared/i18n/messages";

type Translate = (key: MessageKey) => string;

export type UserRoleBadge = {
  label: string;
  icon: LucideIcon;
  className: string;
  dotClass: string;
};

/** Shared role-to-visual mapping for desktop and mobile user management views. */
export function getUserRoleBadge(
  rawRole: string | null | undefined,
  t: Translate,
): UserRoleBadge {
  const role = (rawRole || "USER").trim().toUpperCase();

  if (role === "ADMIN") {
    return {
      label: t("usersRoleAdmin"),
      icon: Crown,
      className: "border-border-strong bg-action text-on-action",
      dotClass: "bg-success-bright",
    };
  }

  if (role === "MANAGER" || role === "MANGER") {
    return {
      label: t("usersRoleManager"),
      icon: Shield,
      className: "border-info-border bg-info-soft text-info",
      dotClass: "bg-info",
    };
  }

  return {
    label: t("usersRoleMember"),
    icon: UserCheck,
    className: "border-border bg-surface-muted text-secondary",
    dotClass: "bg-surface-hover",
  };
}
