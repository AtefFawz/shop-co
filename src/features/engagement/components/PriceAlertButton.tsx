"use client";
import { useState } from "react";
import { BellRing } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { setPriceAlert } from "@/features/engagement/api";
import type { Product } from "@/types";

export default function PriceAlertButton({ product }: { product: Product }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) return toast.error(locale === "ar" ? "أدخل سعرًا صحيحًا" : "Enter a valid target price");
    setSaving(true);
    try { await setPriceAlert(product._id, value); toast.success(locale === "ar" ? "هنبلغك لما السعر يوصل للحد ده" : "We'll notify you when the price reaches your target"); setOpen(false); }
    catch { toast.error(locale === "ar" ? "سجّل الدخول لتفعيل التنبيه" : "Sign in to activate a price alert"); }
    finally { setSaving(false); }
  };
  return <div className="relative">
    <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold text-secondary transition hover:border-border-strong hover:text-primary"><BellRing size={15}/>{locale === "ar" ? "نبّهني عند انخفاض السعر" : "Alert me on price drop"}</button>
    {open && <div className="absolute bottom-full start-0 z-40 mb-2 w-72 rounded-2xl border border-border bg-surface p-4 shadow-panel"><label className="mb-2 block text-xs font-bold text-primary">{locale === "ar" ? "السعر المستهدف" : "Target price"}</label><input type="number" min="1" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} placeholder={String(product.price)} className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 text-sm text-primary outline-none focus:border-action"/><div className="mt-3 flex gap-2"><button type="button" onClick={submit} disabled={saving} className="flex-1 rounded-xl bg-action px-3 py-2 text-xs font-bold text-on-action disabled:opacity-50">{locale === "ar" ? "تفعيل" : "Activate"}</button><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-border px-3 py-2 text-xs font-bold">{locale === "ar" ? "إلغاء" : "Cancel"}</button></div></div>}
  </div>;
}
