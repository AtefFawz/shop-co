"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ShoppingBag,
  ArrowUpRight,
  Copy,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function OrderConfirmationPage() {
  const { t, direction } = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = t("orderConfirmPageTitle");
  }, [t]);

  const handleCopyId = async () => {
    if (!orderId) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success(t("orderConfirmCopyToast").replace("{id}", orderId.slice(-6).toUpperCase()));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("orderConfirmCopyFailed"));
    }
  };

  const shortId = orderId ? orderId.slice(-6).toUpperCase() : "ATELIER";

  return (
    <section dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-12 text-primary sm:py-20">
      {/* Subtle Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_40%,#000_50%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Main 3D Success Card */}
        <div className="w-full max-w-lg rounded-[2.5rem] border border-border bg-surface p-8 shadow-[0_24px_60px_-15px_rgba(var(--shadow-rgb),0.08)] sm:p-10">
          {/* Animated Success Check Pedestal */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-success-border bg-success-soft text-success shadow-inner">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl bg-success opacity-25" />
            <Check size={42} strokeWidth={2.8} className="relative z-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
            <Sparkles size={11} className="text-primary" /> {t("orderConfirmDispatchQueued")}
          </span>

          <h1 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
            {t("orderConfirmHeading")}
          </h1>

          <p className="mt-2 text-xs font-medium leading-relaxed text-muted sm:text-sm">
            {t("orderConfirmDescription")}
          </p>

          {/* Order ID Pill */}
          {orderId && (
            <div className="my-6 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-border-strong bg-surface-subtle p-4">
              <div className="text-start">
                <span className="block text-[9px] font-black uppercase tracking-widest text-muted">
                  {t("orderConfirmTrackingRef")}
                </span>
                <span className="font-mono text-sm font-black text-primary">
                  #{shortId}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-surface px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-primary shadow-2xs transition-all hover:bg-action hover:text-on-action"
              >
                <span>{copied ? t("copied") : t("orderConfirmCopyId")}</span>
                <Copy size={12} />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3.5 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-action px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <ShoppingBag size={14} />
              <span>{t("orderConfirmContinueShopping")}</span>
              <ArrowUpRight
                size={14}
                className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${direction === "rtl" ? "rotate-180" : ""}`}
              />
            </Link>

            <Link
              href="/my-orders"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-secondary shadow-2xs transition-all hover:border-border-strong hover:bg-surface-subtle"
            >
              <Truck size={14} />
              <span>{t("orderConfirmTrackOrders")}</span>
            </Link>
          </div>

          {/* Security Guarantee Footer */}
          <div className="mt-7 flex items-center justify-center gap-1.5 border-t border-border-subtle pt-5 text-[10px] font-bold uppercase tracking-widest text-muted">
            <ShieldCheck size={14} className="text-success" />
            <span>{t("orderConfirmSecurityNote")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
