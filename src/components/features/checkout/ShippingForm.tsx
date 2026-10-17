"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Building2,
  Phone,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface DataType {
  onSubmit: (data: any) => void;
  state: boolean;
}

const POPULAR_CITIES = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"];

export const ShippingForm = ({ onSubmit, state }: DataType) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="overflow-hidden rounded-[2.2rem] border border-white/90 bg-white p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5 border-b border-neutral-100 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-xs">
          <Truck size={19} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-[#111111]">
            Dispatch Coordinates
          </h3>
          <p className="text-xs font-medium text-neutral-400">
            Enter your street address and contact number for courier delivery
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Street Address */}
        <div className="space-y-2">
          <label className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
            Detailed Street Address
          </label>
          <div
            className={`relative flex items-center rounded-2xl border bg-[#F8F8F8] transition-all duration-300 ${
              focused === "address"
                ? "-translate-y-0.5 border-[#111111] bg-white shadow-md ring-4 ring-black/[0.04]"
                : "border-neutral-200/90 hover:border-neutral-300"
            }`}
          >
            <span
              className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                focused === "address"
                  ? "bg-[#111111] text-white"
                  : "bg-white text-neutral-400 shadow-2xs"
              }`}
            >
              <MapPin size={14} />
            </span>

            <input
              required
              type="text"
              value={formData.address}
              onFocus={() => setFocused("address")}
              onBlur={() => setFocused(null)}
              placeholder="Building number, Street name, Apartment..."
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-transparent py-3.5 pl-14 pr-4 text-xs font-bold text-[#111111] placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:text-[13px]"
            />
          </div>
        </div>

        {/* 2. City & Phone Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <label className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
              City / Governorate
            </label>
            <div
              className={`relative flex items-center rounded-2xl border bg-[#F8F8F8] transition-all duration-300 ${
                focused === "city"
                  ? "-translate-y-0.5 border-[#111111] bg-white shadow-md ring-4 ring-black/[0.04]"
                  : "border-neutral-200/90 hover:border-neutral-300"
              }`}
            >
              <span
                className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  focused === "city"
                    ? "bg-[#111111] text-white"
                    : "bg-white text-neutral-400 shadow-2xs"
                }`}
              >
                <Building2 size={14} />
              </span>

              <input
                required
                type="text"
                value={formData.city}
                onFocus={() => setFocused("city")}
                onBlur={() => setFocused(null)}
                placeholder="e.g. Cairo"
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full bg-transparent py-3.5 pl-14 pr-4 text-xs font-bold text-[#111111] placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:text-[13px]"
              />
            </div>

            {/* Quick City Selector Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, city: c })}
                  className={`cursor-pointer rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase transition-all ${
                    formData.city.toLowerCase() === c.toLowerCase()
                      ? "border-black bg-[#111111] text-white"
                      : "border-neutral-200 bg-[#F8F8F8] text-neutral-500 hover:border-black hover:text-black"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
              Recipient Phone Number
            </label>
            <div
              className={`relative flex items-center rounded-2xl border bg-[#F8F8F8] transition-all duration-300 ${
                focused === "phone"
                  ? "-translate-y-0.5 border-[#111111] bg-white shadow-md ring-4 ring-black/[0.04]"
                  : "border-neutral-200/90 hover:border-neutral-300"
              }`}
            >
              <span
                className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  focused === "phone"
                    ? "bg-[#111111] text-white"
                    : "bg-white text-neutral-400 shadow-2xs"
                }`}
              >
                <Phone size={14} />
              </span>

              <input
                required
                type="tel"
                value={formData.phone}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="+20 100 000 0000"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-transparent py-3.5 pl-14 pr-4 font-mono text-xs font-bold text-[#111111] placeholder:font-sans placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* 3. Interactive Settlement Method Selector */}
        <div className="space-y-2.5 border-t border-neutral-100 pt-5">
          <label className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
            Settlement Method
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                paymentMethod === "cod"
                  ? "border-[#111111] bg-[#111111] text-white shadow-md"
                  : "border-neutral-200 bg-[#F8F8F8] text-[#111111] hover:border-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <Banknote size={18} />
                <div>
                  <span className="block text-xs font-black uppercase">
                    Cash on Delivery
                  </span>
                  <span
                    className={`block text-[10px] ${
                      paymentMethod === "cod"
                        ? "text-white/65"
                        : "text-neutral-400"
                    }`}
                  >
                    Pay upon receiving package
                  </span>
                </div>
              </div>
              {paymentMethod === "cod" && (
                <CheckCircle2 size={16} className="text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                paymentMethod === "card"
                  ? "border-[#111111] bg-[#111111] text-white shadow-md"
                  : "border-neutral-200 bg-[#F8F8F8] text-[#111111] hover:border-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} />
                <div>
                  <span className="block text-xs font-black uppercase">
                    POS Card on Delivery
                  </span>
                  <span
                    className={`block text-[10px] ${
                      paymentMethod === "card"
                        ? "text-white/65"
                        : "text-neutral-400"
                    }`}
                  >
                    Visa / Mastercard terminal
                  </span>
                </div>
              </div>
              {paymentMethod === "card" && (
                <CheckCircle2 size={16} className="text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Submit Order CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={state}
            className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#111111] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

            {state ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Authorizing Dispatch…</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Place Order</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={13} />
                </span>
              </>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>
              30-Day Complimentary Returns &amp; Full Transit Insurance
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
