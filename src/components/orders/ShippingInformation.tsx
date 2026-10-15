"use client";

import React, { useState } from "react";
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

export default function ShippingInformation({
  shippingAddress,
  customer,
  paymentMethod = "Cash on Delivery / Card",
}: ShippingInformationProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, key: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const fullAddressQuery = encodeURIComponent(
    `${shippingAddress?.address || ""}, ${shippingAddress?.city || ""}`,
  );

  return (
    <div className="sticky top-24 space-y-5">
      {/* Main Shipping Dossier Card */}
      <div className="overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-5 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.06)] sm:p-6">
        {/* Card Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-xs">
              <MapPin size={18} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-[#111111]">
                Dispatch Destination
              </h2>
              <p className="text-xs font-semibold text-neutral-400">
                Verified courier coordinates
              </p>
            </div>
          </div>
        </div>

        {/* Optional Customer Block (if returned by API) */}
        {customer?.fullName && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
              <User size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase text-[#111111]">
                {customer.fullName}
              </p>
              {customer.email && (
                <p className="truncate text-[11px] font-medium text-neutral-400">
                  {customer.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Shipping Telemetry Rows */}
        <div className="space-y-3">
          {/* Street Address */}
          <div className="group rounded-2xl border border-neutral-200/70 bg-[#F8F8F8]/80 p-3.5 transition-colors hover:border-black/20 hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
                <MapPin size={12} className="text-[#111111]" />
                Street Address
              </span>

              <button
                type="button"
                onClick={() =>
                  handleCopy(shippingAddress?.address, "Address", "addr")
                }
                className="cursor-pointer text-neutral-400 hover:text-[#111111]"
                title="Copy address"
              >
                {copiedKey === "addr" ? (
                  <Check size={13} className="text-emerald-500" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>

            <p className="mt-1.5 break-words text-xs font-extrabold leading-relaxed text-[#111111] sm:text-sm">
              {shippingAddress?.address || "No street address specified"}
            </p>
          </div>

          {/* City / Region */}
          <div className="rounded-2xl border border-neutral-200/70 bg-[#F8F8F8]/80 p-3.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
              <Truck size={12} className="text-[#111111]" />
              Destination City
            </span>
            <p className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-[#111111] sm:text-sm">
              {shippingAddress?.city || "—"}
            </p>
          </div>

          {/* Phone Contact with Call & Copy */}
          <div className="group rounded-2xl border border-neutral-200/70 bg-[#F8F8F8]/80 p-3.5 transition-colors hover:border-black/20 hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
                <Phone size={12} className="text-[#111111]" />
                Recipient Phone
              </span>

              <div className="flex items-center gap-2">
                {shippingAddress?.phone && (
                  <a
                    href={`tel:${shippingAddress.phone}`}
                    className="rounded-lg bg-[#111111] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white hover:bg-neutral-800"
                  >
                    Call
                  </a>
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(shippingAddress?.phone, "Phone number", "phone")
                  }
                  className="cursor-pointer text-neutral-400 hover:text-[#111111]"
                  title="Copy phone"
                >
                  {copiedKey === "phone" ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            <p className="mt-1.5 font-mono text-sm font-black text-[#111111]">
              {shippingAddress?.phone || "—"}
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-neutral-200/70 bg-[#F8F8F8]/80 p-3.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
              <CreditCard size={12} className="text-[#111111]" />
              Settlement Method
            </span>
            <p className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-[#111111]">
              {paymentMethod}
            </p>
          </div>
        </div>

        {/* Open in Google Maps CTA */}
        {shippingAddress?.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-3 text-xs font-black uppercase tracking-widest text-[#111111] shadow-2xs transition-all hover:border-black hover:bg-[#111111] hover:text-white"
          >
            <span>Locate on Google Maps</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Buyer Protection Guarantee Card */}
      <div className="rounded-3xl border border-white/90 bg-white p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              SHOP.CO™ Authenticity Guarantee
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
              Every garment is inspected, sealed with a security tag, and
              insured during courier transit until signed delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
