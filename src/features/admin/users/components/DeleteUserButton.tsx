"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, X, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import { getApiErrorDetails } from "@/lib/errorUtils";
interface DeleteUserProps {
  userId: string;
  userName?: string;
}

export default function DeleteUserButton({
  userId,
  userName = "",
}: DeleteUserProps) {
  const { t, direction } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/users/${userId}`);
      toast.success(`${t("usersAccountDeleted")}: ${userName}`);
      setIsOpen(false);

      router.push("/dashboard/admin/users");
      router.refresh();
    } catch (error: unknown) {
      console.error("Delete user failed:", error);
      toast.error(getApiErrorDetails(error).response?.data?.message || t("usersDeleteAccountFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-danger-border bg-danger-soft px-4 py-2 text-xs font-black uppercase tracking-widest text-danger transition-all duration-200 hover:-translate-y-0.5 hover:border-danger-border hover:bg-danger hover:text-on-danger hover:shadow-[0_10px_24px_-6px_rgba(var(--danger-rgb),0.45)] active:scale-95"
        title={t("usersDeleteProfile")}
      >
        <Trash2
          size={14}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        <span className="hidden sm:inline">{t("usersDeleteProfile")}</span>
      </button>

      {/* Fullscreen Portal Modal (Never trapped by parent backdrop-blur/transform) */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div dir={direction} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              onClick={() => !loading && setIsOpen(false)}
              className="fixed inset-0 bg-action/60 backdrop-blur-md animate-in fade-in duration-200"
            />

            {/* 3D Modal Card */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.2rem] border border-border/80 bg-surface p-7 text-primary shadow-[0_35px_90px_rgba(var(--shadow-rgb),0.4)] animate-in zoom-in-95 duration-200">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="absolute end-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-muted text-muted transition-colors hover:bg-action hover:text-on-action"
              >
                <X size={16} />
              </button>

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger ring-8 ring-danger/10">
                <ShieldAlert size={28} />
              </div>

              <div className="text-center space-y-2">
                <span className="inline-block rounded-full bg-danger-soft px-3 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-danger">
                  {t("usersDeleteIrreversible")}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-primary">
                  {t("usersMemberRemovalTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-muted px-2">
                  {t("usersMemberRemovalDescription")} {userName || t("usersProfile")} (#{userId.slice(-6).toUpperCase()}).
                </p>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer rounded-2xl border border-border bg-surface py-3.5 text-xs font-black uppercase tracking-wider text-secondary transition-colors hover:border-border-strong hover:bg-surface-subtle disabled:opacity-50"
                >
                  {t("usersDeleteCancel")}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDelete}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-danger py-3.5 text-xs font-black uppercase tracking-wider text-on-danger shadow-[0_12px_28px_-6px_rgba(var(--danger-rgb),0.55)] transition-all hover:bg-danger disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{t("usersDeleting")}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={14} />
                      <span>{t("usersConfirmDeleteAction")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
