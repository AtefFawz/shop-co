"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Truck,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  User,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type ShippingAddress = {
  address: string;
  city: string;
  phone: string;
};

interface ShippingInformationProps {
  shippingAddress: ShippingAddress;
  customer?: {
    fullName?: string;
    email?: string;
  };
  paymentMethod?: string;
  status?: string;
}

export default function ShippingInformationCard({
  shippingAddress,
  customer,
  paymentMethod = "cod",
}: ShippingInformationProps) {
  const { t } = useLocale();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const normalizedPayment = String(paymentMethod || "").trim().toLowerCase().replace(/[ _-]+/g, " ");
  const paymentLabel = ["cod", "cash on delivery"].includes(normalizedPayment)
    ? t("cashOnDelivery")
    : ["card", "card on delivery"].includes(normalizedPayment)
      ? t("cardOnDelivery")
      : paymentMethod || t("paymentMethod");

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    if (!navigator.clipboard?.writeText) {
      toast.error(t("copyFailed"));
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      toast.success(t("copySuccess"));
      window.setTimeout(() => setCopiedKey(null), 1800);
    }).catch(() => toast.error(t("copyFailed")));
  };

  const fullAddressQuery = encodeURIComponent(
    `${shippingAddress?.address || ""}, ${shippingAddress?.city || ""}`,
  );

  return (
    <div className="sticky top-24 space-y-5">
      {/* Main Shipping Dossier Card */}
      <div className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-6">
        {/* Card Header */}
        <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action text-on-action shadow-xs">
              <MapPin size={18} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-primary">
                {t("dispatchDestination")}
              </h2>
              <p className="text-xs font-semibold text-muted">
                {t("verifiedCourierCoordinates")}
              </p>
            </div>
          </div>
        </div>

        {/* Optional Customer Block (if returned by API) */}
        {customer?.fullName && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/80 bg-surface-subtle p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-action text-on-action">
              <User size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase text-primary">
                {customer.fullName}
              </p>
              {customer.email && (
                <p className="truncate text-[11px] font-medium text-muted">
                  {customer.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Shipping Telemetry Rows */}
        <div className="space-y-3">
          {/* Street address */}
          <div className="group rounded-2xl border border-border/70 bg-surface-subtle/80 p-3.5 transition-colors hover:border-border hover:bg-surface">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted">
                <MapPin size={12} className="text-primary" />
                {t("streetAddress")}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleCopy(shippingAddress?.address, "addr")
                }
                className="cursor-pointer text-muted hover:text-primary"
                title={t("copyAddress")}
              >
                {copiedKey === "addr" ? (
                  <Check size={13} className="text-success" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>

            <p className="mt-1.5 break-words text-xs font-extrabold leading-relaxed text-primary sm:text-sm">
              {shippingAddress?.address || t("noAddress")}
            </p>
          </div>

          {/* City / Region */}
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/80 p-3.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted">
              <Truck size={12} className="text-primary" />
              {t("city")}
            </span>
            <p className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-primary sm:text-sm">
              {shippingAddress?.city || "—"}
            </p>
          </div>

          {/* Phone Contact with Call & Copy */}
          <div className="group rounded-2xl border border-border/70 bg-surface-subtle/80 p-3.5 transition-colors hover:border-border hover:bg-surface">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted">
                <Phone size={12} className="text-primary" />
                {t("recipientPhone")}
              </span>

              <div className="flex items-center gap-2">
                {shippingAddress?.phone && (
                  <a
                    href={`tel:${shippingAddress.phone}`}
                    className="rounded-lg bg-action px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-on-action hover:bg-action-hover"
                  >
                    {t("call")}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(shippingAddress?.phone, "phone")
                  }
                  className="cursor-pointer text-muted hover:text-primary"
                  title={t("copyPhone")}
                >
                  {copiedKey === "phone" ? (
                    <Check size={13} className="text-success" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            <p className="mt-1.5 font-mono text-sm font-black text-primary">
              {shippingAddress?.phone || "—"}
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-border/70 bg-surface-subtle/80 p-3.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted">
              <CreditCard size={12} className="text-primary" />
              {t("settlementMethod")}
            </span>
            <p className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-primary">
              {paymentLabel}
            </p>
          </div>
        </div>

        {/* Open in Google Maps CTA */}
        {shippingAddress?.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-xs font-black uppercase tracking-widest text-primary shadow-2xs transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
          >
            <span>{t("locateMaps")}</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Buyer Protection Guarantee Card */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-primary">
              {t("authenticityGuarantee")}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              {t("authenticityDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
