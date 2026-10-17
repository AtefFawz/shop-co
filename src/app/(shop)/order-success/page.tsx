"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Package,
  ShoppingBag,
  ArrowUpRight,
  Copy,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Order Confirmed · Atelier Dispatch | SHOP.CO™";
  }, []);

  const handleCopyId = () => {
    if (!orderId) return;
    navigator.clipboard?.writeText(orderId);
    setCopied(true);
    toast.success(`Order Number #${orderId.slice(-6).toUpperCase()} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortId = orderId ? orderId.slice(-6).toUpperCase() : "ATELIER";

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-12 text-[#111111] sm:py-20">
      {/* Subtle Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_40%,#000_50%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Main 3D Success Card */}
        <div className="w-full max-w-lg rounded-[2.5rem] border border-white/90 bg-white p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] sm:p-10">
          {/* Animated Success Check Pedestal */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-inner">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl bg-emerald-500 opacity-25" />
            <Check size={42} strokeWidth={2.8} className="relative z-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F3F4] px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-neutral-700">
            <Sparkles size={11} className="text-[#111111]" /> DISPATCH QUEUED
          </span>

          <h1 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
            Your Order Is Confirmed!
          </h1>

          <p className="mt-2 text-xs font-medium leading-relaxed text-neutral-500 sm:text-sm">
            Thank you for curating with SHOP.CO Atelier. Your items are being
            inspected and securely packaged for express dispatch.
          </p>

          {/* Order ID Pill */}
          {orderId && (
            <div className="my-6 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-neutral-300 bg-[#F8F8F8] p-4">
              <div className="text-left">
                <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400">
                  Official Tracking Reference
                </span>
                <span className="font-mono text-sm font-black text-[#111111]">
                  #{shortId}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-[#111111] shadow-2xs transition-all hover:bg-[#111111] hover:text-white"
              >
                <span>{copied ? "Copied" : "Copy ID"}</span>
                <Copy size={12} />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3.5 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_-8px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              <ShoppingBag size={14} />
              <span>Continue Shopping</span>
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/my-orders"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-neutral-800 shadow-2xs transition-all hover:border-black hover:bg-neutral-50"
            >
              <Truck size={14} />
              <span>Track Orders</span>
            </Link>
          </div>

          {/* Security Guarantee Footer */}
          <div className="mt-7 flex items-center justify-center gap-1.5 border-t border-neutral-100 pt-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Insured Dispatch &amp; Real-Time SMS Updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
