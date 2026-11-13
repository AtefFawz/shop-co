"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Bookmark, BellRing, Eye, TrendingUp } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type Insights = { savedProducts: number; activePriceAlerts: number; recentlyViewed: number; popularSaved: { _id: string; name: string; saves: number; photo: string }[] };
export default function AdminFeatureInsights() {
  const { locale } = useLocale();
  const [data, setData] = useState<Insights | null>(null);
  useEffect(() => { api.get("/features/admin/insights").then((r) => setData(r.data?.data)).catch(() => {}); }, []);
  if (!data) return null;
  const cards = [
    { label: locale === "ar" ? "منتجات محفوظة" : "Saved products", value: data.savedProducts, icon: Bookmark },
    { label: locale === "ar" ? "تنبيهات سعر نشطة" : "Active price alerts", value: data.activePriceAlerts, icon: BellRing },
    { label: locale === "ar" ? "مشاهدات آخر 7 أيام" : "Views in last 7 days", value: data.recentlyViewed, icon: Eye },
  ];
  return <section className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6"><div className="flex items-center gap-2"><TrendingUp size={17}/><h2 className="text-base font-black">{locale === "ar" ? "تفاعل العملاء" : "Customer engagement"}</h2></div><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{cards.map((card) => <div key={card.label} className="rounded-2xl border border-border bg-surface-subtle p-4"><div className="flex items-center justify-between text-muted"><span className="text-xs font-bold">{card.label}</span><card.icon size={16}/></div><p className="mt-3 font-mono text-2xl font-black tabular-nums">{card.value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</p></div>)}</div>{data.popularSaved.length > 0 && <div className="mt-5"><h3 className="text-xs font-black uppercase tracking-wider text-muted">{locale === "ar" ? "الأكثر حفظًا" : "Most saved products"}</h3><div className="mt-2 divide-y divide-border">{data.popularSaved.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="truncate font-semibold">{item.name}</span><span className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-xs font-bold">{item.saves} {locale === "ar" ? "حفظ" : "saves"}</span></div>)}</div></div>}</section>;
}
