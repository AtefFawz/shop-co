"use client";

import { useState, type FormEvent } from "react";
import type { CheckoutShippingData, PaymentMethod } from "@/features/checkout/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
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

interface ShippingAddressFormProps {
  onSubmit: (data: CheckoutShippingData) => void;
  state: boolean;
}

const POPULAR_CITIES = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"];

export const ShippingAddressForm = ({ onSubmit, state }: ShippingAddressFormProps) => {
  const { t, locale, direction } = useLocale();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
  });
  const cardPaymentsEnabled = process.env.NEXT_PUBLIC_CARD_PAYMENTS_ENABLED === "true";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ ...formData, paymentMethod: cardPaymentsEnabled ? paymentMethod : "cod" });
  };

  return (
    <div
      dir={direction}
      className="overflow-hidden rounded-4xl border border-border bg-surface p-6 shadow-panel sm:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5 border-b border-border-subtle pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action text-on-action shadow-xs">
          <Truck size={19} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-primary">
            {t("shippingAddress")}
          </h3>
          <p className="text-xs font-medium text-muted">
            {t("shippingAddressHint")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Street Address */}
        <div className="space-y-2">
          <label htmlFor="shipping-address" className="block px-1 text-xs font-black uppercase tracking-[0.18em] text-muted">
            {t("streetAddress")}
          </label>
          <div
            className={`relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
              focused === "address"
                ? "-translate-y-0.5 border-border bg-surface shadow-md ring-4 ring-focus/20"
                : "border-border/90 hover:border-border-strong"
            }`}
          >
            <span
              className={`pointer-events-none absolute start-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                focused === "address"
                  ? "bg-action text-on-action"
                  : "bg-surface text-muted shadow-2xs"
              }`}
            >
              <MapPin size={14} />
            </span>

            <input
              id="shipping-address"
              autoComplete="street-address"
              required
              type="text"
              value={formData.address}
              onFocus={() => setFocused("address")}
              onBlur={() => setFocused(null)}
              placeholder={t("addressPlaceholder")}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-transparent py-3.5 pe-4 ps-14 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[0.8125rem]"
            />
          </div>
        </div>

        {/* 2. City & Phone Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <label htmlFor="shipping-city" className="block px-1 text-xs font-black uppercase tracking-[0.18em] text-muted">
              {t("city")}
            </label>
            <div
              className={`relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
                focused === "city"
                  ? "-translate-y-0.5 border-border bg-surface shadow-md ring-4 ring-focus/20"
                  : "border-border/90 hover:border-border-strong"
              }`}
            >
              <span
                className={`pointer-events-none absolute start-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  focused === "city"
                    ? "bg-action text-on-action"
                    : "bg-surface text-muted shadow-2xs"
                }`}
              >
                <Building2 size={14} />
              </span>

              <input
              id="shipping-city"
              autoComplete="address-level2"
                required
                type="text"
                value={formData.city}
                onFocus={() => setFocused("city")}
                onBlur={() => setFocused(null)}
                placeholder={t("cityPlaceholder")}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full bg-transparent py-3.5 pe-4 ps-14 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[0.8125rem]"
              />
            </div>

            {/* Quick City Selector Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, city: c })}
                  className={`cursor-pointer rounded-lg border px-2 py-0.5 text-xs font-black uppercase transition-all ${
                    formData.city.toLowerCase() === c.toLowerCase()
                      ? "border-border-strong bg-action text-on-action"
                      : "border-border bg-surface-subtle text-muted hover:border-border-strong hover:text-primary"
                  }`}
                >
                  {locale === "ar"
                    ? (
                        {
                          Cairo: t("cityCairo"),
                          Alexandria: t("cityAlexandria"),
                          Giza: t("cityGiza"),
                          Mansoura: t("cityMansoura"),
                          Tanta: t("cityTanta"),
                        } as Record<string, string>
                      )[c]
                    : c}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="shipping-phone" className="block px-1 text-xs font-black uppercase tracking-[0.18em] text-muted">
              {t("phone")}
            </label>
            <div
              className={`relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
                focused === "phone"
                  ? "-translate-y-0.5 border-border bg-surface shadow-md ring-4 ring-focus/20"
                  : "border-border/90 hover:border-border-strong"
              }`}
            >
              <span
                className={`pointer-events-none absolute start-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  focused === "phone"
                    ? "bg-action text-on-action"
                    : "bg-surface text-muted shadow-2xs"
                }`}
              >
                <Phone size={14} />
              </span>

              <input
              id="shipping-phone"
              autoComplete="tel"
              inputMode="tel"
                required
                type="tel"
                value={formData.phone}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="+20 100 000 0000"
                style={{
                  unicodeBidi: "plaintext",
                  textAlign: direction === "rtl" ? "right" : "left",
                }}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-transparent py-3.5 ps-14 pe-4 font-mono text-xs font-bold text-primary placeholder:font-sans placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[0.8125rem]"
              />
            </div>
          </div>
        </div>

        {/* 3. Interactive Payment Method Selector */}
        <div className="space-y-2.5 border-t border-border-subtle pt-5">
          <label className="block px-1 text-xs font-black uppercase tracking-[0.18em] text-muted">
            {t("paymentMethod")}
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-start transition-all ${
                paymentMethod === "cod"
                  ? "border-border bg-action text-on-action shadow-md"
                  : "border-border bg-surface-subtle text-primary hover:border-border-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <Banknote size={18} />
                <div>
                  <span className="block text-xs font-black uppercase">
                    {t("cashOnDelivery")}
                  </span>
                  <span
                    className={`block text-xs ${
                      paymentMethod === "cod"
                        ? "text-on-action/65"
                        : "text-muted"
                    }`}
                  >
                    {t("payOnArrival")}
                  </span>
                </div>
              </div>
              {paymentMethod === "cod" && (
                <CheckCircle2 size={16} className="text-success" />
              )}
            </button>

            <button
              type="button"
              disabled={!cardPaymentsEnabled}
              onClick={() => cardPaymentsEnabled && setPaymentMethod("card")}
              aria-disabled={!cardPaymentsEnabled}
              title={!cardPaymentsEnabled ? (locale === "ar" ? "الدفع بالبطاقة غير متاح حاليًا" : "Card payments are not enabled yet") : undefined}
              className={`flex items-center justify-between rounded-2xl border p-3.5 text-start transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                paymentMethod === "card"
                  ? "border-border bg-action text-on-action shadow-md"
                  : "border-border bg-surface-subtle text-primary hover:border-border-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} />
                <div>
                  <span className="block text-xs font-black uppercase">
                    {t("cardOnDelivery")}
                  </span>
                  <span
                    className={`block text-xs ${
                      paymentMethod === "card"
                        ? "text-on-action/65"
                        : "text-muted"
                    }`}
                  >
                    {cardPaymentsEnabled ? t("cardTerminal") : (locale === "ar" ? "غير متاح حاليًا" : "Not available yet")}
                  </span>
                </div>
              </div>
              {paymentMethod === "card" && (
                <CheckCircle2 size={16} className="text-success" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Submit Order CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={state}
            className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-panel active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface-hover disabled:shadow-none"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

            {state ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>{t("placingOrder")}</span>
              </>
            ) : (
              <>
                <span>{t("placeOrder")}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-surface group-hover:text-primary">
                  <ArrowRight
                    size={13}
                    className={direction === "rtl" ? "rotate-180" : undefined}
                  />
                </span>
              </>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted">
            <ShieldCheck size={13} className="text-success" />
            <span>{t("returnsProtection")}</span>
          </p>
        </div>
      </form>
    </div>
  );
};
