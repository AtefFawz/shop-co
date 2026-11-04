"use client";

import { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "@/lib/signOut";
import api from "@/lib/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export function AccountSecurityPanel({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified: boolean;
}) {
  const { t } = useLocale();
  const [signingOut, setSigningOut] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  const handleResendVerification = async () => {
    if (!email || resendingVerification) return;
    setResendingVerification(true);
    try {
      await api.post("auth/resend-verification", { email });
      toast.success(t("securityVerificationSent"));
    } catch {
      toast.error(t("securityVerificationResendFailed"));
    } finally {
      setResendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    const confirmed = window.confirm(t("securitySignOutConfirm"));
    if (!confirmed) return;

    setSigningOut(true);
    try {
      await signOut();
    } catch {
      toast.error(t("securitySignOutFailed"));
      setSigningOut(false);
    }
  };

  return (
    <section
      aria-labelledby="account-security-title"
      className="surface-panel overflow-hidden p-5 sm:p-6 lg:col-span-6"
    >
      <div className="flex items-start gap-3 border-b border-border-subtle pb-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-action">
          <ShieldCheck size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3
            id="account-security-title"
            className="text-base font-extrabold tracking-tight text-primary"
          >
            {t("securityPanelTitle")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {t("securityPanelDescription")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface-subtle p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary">
            {emailVerified ? (
              <CheckCircle2 size={17} className="text-success" aria-hidden="true" />
            ) : (
              <ShieldAlert size={17} className="text-warning" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-primary">
              {t("securityEmailVerification")}
            </p>
            <p className="truncate text-xs text-muted">
              {email || t("securityEmailUnavailable")}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              emailVerified
                ? "bg-success-soft text-success"
                : "bg-warning-soft text-warning"
            }`}
          >
            {emailVerified ? t("securityVerified") : t("securityNotVerified")}
          </span>
        </div>

        {!emailVerified && (
          <button
            type="button"
            disabled={!email || resendingVerification}
            onClick={handleResendVerification}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-warning-border bg-warning-soft px-3 py-2 text-xs font-bold text-warning transition hover:bg-warning/10 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {resendingVerification
              ? t("securityVerificationSending")
              : t("securityResendVerification")}
          </button>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface-subtle p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary">
            <KeyRound size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-primary">
              {t("securityCurrentDeviceTitle")}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              {t("securityCurrentDeviceHint")}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
            {t("securityCurrentBadge")}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border-subtle bg-surface-subtle px-3.5 py-3 text-xs leading-relaxed text-muted">
        {t("securityOtherSessionsUnavailable")}
      </div>

      <button
        type="button"
        disabled={signingOut}
        onClick={handleSignOut}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger-border bg-danger-soft px-4 py-2.5 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <LogOut size={16} aria-hidden="true" />
        {signingOut ? t("securitySigningOut") : t("securitySignOutThisDevice")}
      </button>
    </section>
  );
}
