"use client";

import { useState, type FormEvent } from "react";
import { Tag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export const PromoCodeForm = ({ canCheckout = true }: { canCheckout?: boolean }) => {
  const router = useRouter();
  const { t, direction } = useLocale();
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleApplyPromo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      toast.error(t("promoEnterCode"));
      return;
    }

    if (["SHOP20", "VIP10", "ATELIER26"].includes(clean)) {
      setAppliedCode(clean);
      toast.success(t("promoCodeActivated").replace("{code}", clean));
    } else {
      toast.error(t("promoCodeInvalid"));
    }
  };

  return (
    <div dir={direction} className="space-y-4 border-t border-border-subtle px-4 pb-6 pt-4 sm:px-6">
      {/* Interactive Promo Form */}
      <form onSubmit={handleApplyPromo} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              size={14}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("promoCodePlaceholder")}
              className="w-full rounded-xl border border-border/90 bg-surface-subtle py-3 ps-9 pe-3 text-xs font-bold uppercase text-primary outline-none transition-all placeholder:font-medium placeholder:normal-case placeholder:text-muted focus:border-primary focus:bg-surface"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:border-border-strong hover:bg-action hover:text-on-action active:scale-95"
          >
            {t("promoApply")}
          </button>
        </div>

        {appliedCode && (
          <div className="flex items-center justify-between rounded-xl bg-success-soft px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-success">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={12} /> {t("promoApplied").replace("{code}", appliedCode)}
            </span>
            <button
              type="button"
              onClick={() => {
                setAppliedCode(null);
                setCode("");
              }}
              className="cursor-pointer text-danger hover:underline"
            >
              {t("promoRemove")}
            </button>
          </div>
        )}
      </form>

      {/* Primary 3D Checkout CTA */}
      {!canCheckout && (
        <p className="text-center text-[11px] leading-relaxed text-muted">
          {t("noCheckoutSelectionHint")}
        </p>
      )}
      <button
        type="button"
        disabled={!canCheckout}
        onClick={() => router.push("/shop/details/cart/checkout")}
        className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-[0_16px_36px_-10px_rgba(var(--shadow-rgb),0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-[0_22px_44px_-10px_rgba(var(--shadow-rgb),0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative z-10">{t("promoProceedCheckout")}</span>
        <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-surface group-hover:text-primary">
          <ArrowRight size={13} className={direction === "rtl" ? "rotate-180" : undefined} />
        </span>
      </button>
    </div>
  );
};
