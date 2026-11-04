"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Bookmark, Trash2 } from "lucide-react";
import ProductCard from "@/features/catalog/components/ProductCard";
import { fetchEngagements, removeSaved, type Engagement } from "@/features/engagement/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import toast from "react-hot-toast";

export default function EngagementListPage({ type }: { type: "saved" | "recent" }) {
  const { locale } = useLocale();
  const [items, setItems] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const isSaved = type === "saved";
  const load = () => { setLoading(true); fetchEngagements(type).then(setItems).catch(() => toast.error(locale === "ar" ? "سجّل الدخول لعرض هذه القائمة" : "Sign in to view this list")).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [type]);
  const remove = async (id: string) => { try { await removeSaved(id); setItems((prev) => prev.filter((item) => item.product?._id !== id)); } catch { toast.error(locale === "ar" ? "تعذر حذف المنتج" : "Could not remove item"); } };
  const title = isSaved ? (locale === "ar" ? "محفوظ لوقت لاحق" : "Saved for later") : (locale === "ar" ? "شوهدت مؤخرًا" : "Recently viewed");
  return <section className="page-section min-h-[70vh] bg-surface-subtle text-primary"><div className="Responsive space-y-7">
    <header className="rounded-3xl border border-border bg-surface p-6 sm:p-8"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-muted">{isSaved ? <Bookmark size={15}/> : <Clock3 size={15}/>}SHOP.CO / {title}</div><h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-muted">{locale === "ar" ? "قائمة متزامنة مع حسابك وتظل متاحة عند تسجيل الدخول من جهاز آخر." : "Synced with your account and available when you sign in on another device."}</p></header>
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({length:4}).map((_,i)=><div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface"/>)}</div> : items.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{items.map((item)=><div key={item._id} className="relative min-w-0"><ProductCard product={item.product}/>{isSaved && <button type="button" onClick={()=>remove(item.product._id)} className="mt-2 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-danger-border hover:text-danger"><Trash2 size={12}/>{locale === "ar" ? "إزالة" : "Remove"}</button>}</div>)}</div> : <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center"><p className="font-bold">{locale === "ar" ? "لا توجد منتجات هنا حتى الآن" : "Nothing here yet"}</p><Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded-full bg-action px-5 py-3 text-xs font-black text-on-action">{locale === "ar" ? "اكتشف المنتجات" : "Explore products"}<ArrowUpRight size={14}/></Link></div>}
  </div></section>;
}
