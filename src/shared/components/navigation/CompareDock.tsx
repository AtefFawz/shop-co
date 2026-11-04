"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, GitCompareArrows, X } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";
export default function CompareDock() {
 const { locale, direction } = useLocale(); const pathname=usePathname(); const [mounted,setMounted]=useState(false); const items=useCompareStore(s=>s.items); const clear=useCompareStore(s=>s.clear); useEffect(()=>{setMounted(true)},[]); if(!mounted||!items.length||pathname==="/compare")return null; const ar=locale==="ar";
 return <aside dir={direction} className="fixed inset-x-3 bottom-4 z-[45] mx-auto w-fit max-w-[calc(100vw-24px)] sm:bottom-6"><div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-2.5 shadow-[0_18px_55px_rgba(0,0,0,.18)] backdrop-blur-xl sm:gap-4 sm:px-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary"><GitCompareArrows size={17}/></span><span className="min-w-0"><strong className="block text-xs font-black">{ar?`${items.length} منتجات في المقارنة`:`${items.length} products to compare`}</strong><span className="block text-[10px] text-muted">{ar?"قارن اختياراتك جنبًا إلى جنب":"Review your picks side by side"}</span></span><Link href="/compare" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-action px-3 text-[11px] font-black text-on-action transition hover:bg-action-hover">{ar?"افتح المقارنة":"Compare"}<ArrowUpRight size={13}/></Link><button type="button" onClick={clear} aria-label={ar?"مسح المقارنة":"Clear comparison"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-muted hover:text-danger"><X size={15}/></button></div></aside>;
}
