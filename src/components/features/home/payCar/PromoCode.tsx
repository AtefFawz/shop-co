"use client";

import React, { useState } from "react";
import { Tag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const PromoCode = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      toast.error("Please enter a promo code first");
      return;
    }

    if (["SHOP20", "VIP10", "ATELIER26"].includes(clean)) {
      setAppliedCode(clean);
      toast.success(`VIP Code "${clean}" activated!`);
    } else {
      toast.error(`Code "${clean}" is invalid or expired`);
    }
  };

  return (
    <div className="space-y-4 border-t border-neutral-100 px-6 pb-6 pt-4">
      {/* Interactive Promo Form */}
      <form onSubmit={handleApplyPromo} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Try SHOP20 or VIP10"
              className="w-full rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-3 pl-9 pr-3 text-xs font-bold uppercase text-[#111111] outline-none transition-all placeholder:font-medium placeholder:normal-case placeholder:text-neutral-400 focus:border-black focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#111111] transition-all hover:border-black hover:bg-[#111111] hover:text-white active:scale-95"
          >
            Apply
          </button>
        </div>

        {appliedCode && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Code {appliedCode} Applied
            </span>
            <button
              type="button"
              onClick={() => {
                setAppliedCode(null);
                setCode("");
              }}
              className="cursor-pointer text-rose-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </form>

      {/* Primary 3D Checkout CTA */}
      <button
        type="button"
        onClick={() => router.push("/shop/details/cart/checkout")}
        className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#111111] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_22px_44px_-10px_rgba(0,0,0,0.6)] active:scale-[0.99]"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative z-10">Proceed To Checkout</span>
        <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
          <ArrowRight size={13} />
        </span>
      </button>
    </div>
  );
};
