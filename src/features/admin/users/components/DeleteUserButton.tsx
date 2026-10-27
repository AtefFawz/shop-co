"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  ShieldAlert,
  UserX,
} from "lucide-react";
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

  // Close on Escape key & lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
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
      toast.error(
        getApiErrorDetails(error).response?.data?.message ||
          t("usersDeleteAccountFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const shortId = userId ? userId.slice(-6).toUpperCase() : "------";

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-danger-border bg-danger-soft px-3.5 py-2 text-xs font-black uppercase tracking-widest text-danger transition-all duration-200 hover:-translate-y-0.5 hover:border-danger hover:bg-danger hover:text-on-danger hover:shadow-[0_10px_24px_-6px_rgba(var(--danger-rgb),0.45)] active:scale-95 sm:px-4"
        title={t("usersDeleteProfile")}
      >
        <Trash2
          size={14}
          className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
        />
        <span className="hidden sm:inline">{t("usersDeleteProfile")}</span>
      </button>

      {/* Fullscreen Portal Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                dir={direction}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => !loading && setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="delete-user-modal-title"
                  aria-describedby="delete-user-modal-desc"
                  initial={{ opacity: 0, scale: 0.94, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                  }}
                  className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-border bg-surface p-5 text-primary shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] sm:p-7"
                >
                  {/* Top Ambient Danger Glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 inset-x-0 mx-auto h-36 w-36 rounded-full bg-danger/15 blur-2xl"
                  />

                  {/* Close Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setIsOpen(false)}
                    aria-label={t("usersDeleteCancel")}
                    className="absolute end-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-surface-subtle text-muted transition-all hover:border-border-strong hover:bg-action hover:text-on-action disabled:opacity-50 sm:end-5 sm:top-5"
                  >
                    <X size={15} />
                  </button>

                  {/* Danger Icon Header */}
                  <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-danger-border/70 bg-danger-soft text-danger shadow-xs ring-6 ring-danger/5">
                    <ShieldAlert size={26} strokeWidth={2.2} />
                  </div>

                  {/* Text Content */}
                  <div className="relative text-center">
                    <span className="inline-flex items-center gap-1 rounded-full border border-danger-border/60 bg-danger-soft px-3 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-danger">
                      {t("usersDeleteIrreversible")}
                    </span>

                    <h3
                      id="delete-user-modal-title"
                      className="mt-2.5 text-lg font-black uppercase tracking-tight text-primary sm:text-xl"
                    >
                      {t("usersMemberRemovalTitle")}
                    </h3>

                    <p
                      id="delete-user-modal-desc"
                      className="mt-1.5 text-xs leading-relaxed text-muted"
                    >
                      {t("usersMemberRemovalDescription")}
                    </p>

                    {/* Target Member Identity Pill */}
                    <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-border bg-surface-subtle px-3.5 py-2.5 text-start">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-danger shadow-2xs">
                          <UserX size={15} />
                        </span>
                        <span className="truncate text-xs font-extrabold text-primary">
                          {userName || t("usersProfile")}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-lg border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-black text-muted">
                        #{shortId}
                      </span>
                    </div>
                  </div>

                  {/* Responsive Action Buttons (Stacks on ultra-narrow, side-by-side with full padding on standard mobile/desktop) */}
                  <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-[46px] flex-1 cursor-pointer items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 text-xs font-black uppercase tracking-wider text-secondary transition-colors hover:border-border-strong hover:bg-surface-subtle hover:text-primary disabled:opacity-50"
                    >
                      {t("usersDeleteCancel")}
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDelete}
                      className="flex min-h-[46px] flex-[1.25] cursor-pointer items-center justify-center gap-2 rounded-2xl bg-danger px-4 py-3 text-xs font-black uppercase tracking-wider text-on-danger shadow-[0_12px_28px_-6px_rgba(var(--danger-rgb),0.5)] transition-all hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={15}
                            className="shrink-0 animate-spin"
                          />
                          <span className="truncate">{t("usersDeleting")}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={15} className="shrink-0" />
                          <span className="truncate">
                            {t("usersConfirmDeleteAction")}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
