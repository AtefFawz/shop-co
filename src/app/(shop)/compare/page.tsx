"use client";
import Link from "next/link";
import { useCompareStore } from "@/store/compareStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import { Trash2, ArrowUpRight } from "lucide-react";

export default function ComparePage() {
  const { locale } = useLocale();
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const ar = locale === "ar";
  const rows = [
    { label: ar ? "السعر" : "Price", value: (p: typeof items[number]) => formatCurrency(Number(p.price || 0) * (p.isSale ? 1 - Number(p.discount || 0) / 100 : 1), locale) },
    { label: ar ? "التصنيف" : "Category", value: (p: typeof items[number]) => p.category || "—" },
    { label: ar ? "المقاسات" : "Sizes", value: (p: typeof items[number]) => p.size?.join(", ") || "—" },
    { label: ar ? "الألوان" : "Colors", value: (p: typeof items[number]) => p.colors?.join(", ") || "—" },
    { label: ar ? "التقييم" : "Rating", value: (p: typeof items[number]) => Number(p.ratingsAverage || 0).toFixed(1) },
    { label: ar ? "التوفر" : "Availability", value: (p: typeof items[number]) => Number(p.countInStock) > 0 ? (ar ? "متاح" : "In stock") : (ar ? "غير متاح" : "Out of stock") },
  ];
  return <main className="page-section min-h-[70vh] bg-surface-subtle text-primary"><div className="Responsive space-y-6"><header className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-surface p-6"><div><p className="text-xs font-black uppercase tracking-[.2em] text-muted">SHOP.CO / {ar ? "مقارنة المنتجات" : "Product comparison"}</p><h1 className="mt-2 text-3xl font-black">{ar ? "قارن اختياراتك" : "Compare your picks"}</h1><p className="mt-2 text-sm text-muted">{ar ? "قارن حتى 4 منتجات جنبًا إلى جنب." : "Compare up to 4 products side by side."}</p></div>{items.length > 0 && <button onClick={clear} className="rounded-full border border-border px-4 py-2 text-xs font-bold text-muted hover:text-danger">{ar ? "مسح الكل" : "Clear all"}</button>}</header>
    {!items.length ? <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center"><p className="font-bold">{ar ? "لم تضف أي منتجات للمقارنة بعد" : "No products selected yet"}</p><Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded-full bg-action px-5 py-3 text-xs font-black text-on-action">{ar ? "تصفح المتجر" : "Browse shop"}<ArrowUpRight size={14}/></Link></div> : <div className="overflow-x-auto rounded-3xl border border-border bg-surface"><table className="w-full min-w-[680px] border-collapse text-start"><thead><tr><th className="w-36 p-4 text-start text-xs text-muted">{ar ? "المواصفات" : "Specifications"}</th>{items.map((p)=><th key={p._id} className="min-w-40 border-s border-border p-4 text-start"><div className="flex items-start justify-between gap-2"><Link href={`/shop/details/${p._id}`} className="text-sm font-black hover:underline">{p.name}</Link><button onClick={()=>remove(p._id)} aria-label="Remove" className="text-muted hover:text-danger"><Trash2 size={14}/></button></div></th>)}</tr></thead><tbody>{rows.map((row)=><tr key={row.label} className="border-t border-border"><th className="p-4 text-start text-xs font-bold text-muted">{row.label}</th>{items.map((p)=><td key={p._id} className="border-s border-border p-4 text-sm font-semibold">{row.value(p)}</td>)}</tr>)}</tbody></table></div>}
  </div></main>;
}
