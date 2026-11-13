"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BellRing, Bookmark, Clock3, GitCompareArrows, Heart, Package, Settings2, Sparkles, WandSparkles } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useCompareStore } from "@/store/compareStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { fetchEngagements } from "@/features/engagement/api";

type Counts = { saved: number; recent: number; alerts: number };

export default function CustomerSpacePage() {
  const { locale, direction } = useLocale();
  const ar = locale === "ar";
  const compareCount = useCompareStore((state) => state.items.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [counts, setCounts] = useState<Counts>({ saved: 0, recent: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([fetchEngagements("saved"), fetchEngagements("recent"), fetchEngagements("price-alert")])
      .then(([saved, recent, alerts]) => {
        if (!active) return;
        setCounts({ saved: saved.status === "fulfilled" ? saved.value.length : 0, recent: recent.status === "fulfilled" ? recent.value.length : 0, alerts: alerts.status === "fulfilled" ? alerts.value.length : 0 });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const cards = [
    { href: "/stylist", title: ar ? "منسّق الإطلالات" : "Personal Stylist", desc: ar ? "كوّن إطلالة من المنتجات المتاحة وضمن ميزانيتك." : "Build a look from real in-stock products within your budget.", count: null, Icon: WandSparkles, tone: "from-lime-500/15 to-emerald-500/5" },
    { href: "/compare", title: ar ? "مقارنة المنتجات" : "Compare products", desc: ar ? "قارن المواصفات والأسعار قبل اتخاذ القرار." : "Compare specifications and prices before deciding.", count: compareCount, Icon: GitCompareArrows, tone: "from-indigo-500/15 to-violet-500/5" },
    { href: "/saved-for-later", title: ar ? "محفوظ لوقت لاحق" : "Saved for later", desc: ar ? "كل المنتجات التي حفظتها للرجوع إليها." : "Products you saved to come back to.", count: counts.saved, Icon: Bookmark, tone: "from-emerald-500/15 to-teal-500/5" },
    { href: "/recently-viewed", title: ar ? "شوهدت مؤخرًا" : "Recently viewed", desc: ar ? "ارجع بسرعة للمنتجات التي تصفحتها." : "Pick up where you left off.", count: counts.recent, Icon: Clock3, tone: "from-sky-500/15 to-cyan-500/5" },
    { href: "/price-alerts", title: ar ? "تنبيهات الأسعار" : "Price alerts", desc: ar ? "تابع الأسعار المستهدفة للمنتجات." : "Keep an eye on your target prices.", count: counts.alerts, Icon: BellRing, tone: "from-amber-500/15 to-orange-500/5" },
    { href: "/wishlist", title: ar ? "قائمة الأمنيات" : "Wishlist", desc: ar ? "المنتجات التي أعجبتك." : "The pieces you have liked.", count: wishlistCount, Icon: Heart, tone: "from-rose-500/15 to-pink-500/5" },
    { href: "/my-orders", title: ar ? "طلباتي" : "My orders", desc: ar ? "تابع الطلبات والفواتير وحالة التوصيل." : "Track orders, invoices and delivery updates.", count: null, Icon: Package, tone: "from-violet-500/15 to-fuchsia-500/5" },
    { href: "/user/profile", title: ar ? "إعدادات الحساب" : "Account settings", desc: ar ? "حدّث بياناتك وتفضيلاتك وأمان حسابك." : "Manage your details, preferences and security.", count: null, Icon: Settings2, tone: "from-slate-500/15 to-zinc-500/5" },
  ];

  return <main dir={direction} className="page-section min-h-[70vh] bg-surface-subtle text-primary"><div className="Responsive space-y-8">
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-card sm:p-9"><div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"/><div className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-muted"><Sparkles size={13}/>{ar ? "مساحتك في SHOP.CO" : "YOUR SHOP.CO SPACE"}</div><h1 className="text-3xl font-black tracking-tight sm:text-5xl">{ar ? "كل اختياراتك، في مكان واحد." : "Everything you care about, in one place."}</h1><p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">{ar ? "المقارنة، المحفوظات، سجل المشاهدة، تنبيهات الأسعار والطلبات — وصول مباشر بدون ما تدور في الموقع." : "Your comparisons, saved items, viewing history, price alerts and orders — all one tap away."}</p></div><Link href="/shop" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-action px-5 text-xs font-black text-on-action transition hover:bg-action-hover">{ar ? "اكتشف المتجر" : "Explore the store"}<ArrowUpRight size={15}/></Link></div></section>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ href, title, desc, count, Icon, tone }) => <Link key={href} href={href} className="group relative flex min-h-[174px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-panel sm:p-6"><div aria-hidden="true" className={`pointer-events-none absolute -end-8 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${tone} blur-2xl transition-transform duration-500 group-hover:scale-125`}/><div className="relative flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-primary"><Icon size={20}/></span><span className="flex items-center gap-1 text-xs font-black text-muted">{loading && count !== null ? "…" : count === null ? "" : count}<ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span></div><div className="relative mt-6"><h2 className="text-lg font-black">{title}</h2><p className="mt-1 text-xs leading-6 text-muted">{desc}</p></div></Link>)}</section>
  </div></main>;
}
