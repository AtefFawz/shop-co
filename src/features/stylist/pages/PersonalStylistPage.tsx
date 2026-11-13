"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, LoaderCircle, LockKeyhole, RefreshCw, ShoppingBag, Sparkles, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/formatCurrency";
import { resolveProductImageUrl } from "@/lib/imageUrl";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { saveForLater } from "@/features/engagement/api";
import { requestPersonalizedLook, type PersonalStylistResult, type StylistSlot } from "@/features/stylist/api";

type Preferences = {
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  style: "casual" | "streetwear" | "minimal" | "classic" | "formal" | "sporty" | "elegant";
  occasion: "everyday" | "work" | "evening" | "party" | "sport" | "travel";
  color: string;
  budget: string;
};

const INITIAL_PREFERENCES: Preferences = {
  gender: "MEN",
  style: "casual",
  occasion: "everyday",
  color: "",
  budget: "3000",
};

export default function PersonalStylistPage() {
  const { locale, direction } = useLocale();
  const ar = locale === "ar";
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [preferences, setPreferences] = useState<Preferences>(INITIAL_PREFERENCES);
  const [result, setResult] = useState<PersonalStylistResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);

  const copy = {
    eyebrow: ar ? "مختبر تنسيق الإطلالات" : "PERSONAL STYLING STUDIO",
    title: ar ? "إطلالة متناسقة، على ذوقك وميزانيتك." : "A considered look. Your taste. Your budget.",
    subtitle: ar ? "اختار المناسبة والستايل والميزانية، وهنركّب لك اقتراحًا من المنتجات المتاحة فعليًا في SHOP.CO." : "Set the occasion, your style and budget. We’ll build a look from products currently available at SHOP.CO.",
    live: ar ? "مطابقة مباشرة مع كتالوج المتجر" : "LIVE CATALOGUE MATCH",
    privacy: ar ? "تفضيلاتك تُستخدم لمطابقة كتالوج المتجر فقط، ولا تُرسل إلى مزوّد ذكاء اصطناعي خارجي." : "Your preferences are matched against the store catalogue only; they are not sent to an external AI provider.",
    gender: ar ? "لمن الإطلالة؟" : "SHOPPING FOR",
    style: ar ? "الستايل" : "STYLE DIRECTION",
    occasion: ar ? "المناسبة" : "OCCASION",
    color: ar ? "اللون المفضل" : "PREFERRED COLOUR",
    anyColor: ar ? "بدون تفضيل" : "No preference",
    budget: ar ? "الميزانية الإجمالية (جنيه)" : "TOTAL BUDGET (EGP)",
    generate: ar ? "نسّق إطلالتي" : "BUILD MY LOOK",
    building: ar ? "بننسّق إطلالتك..." : "BUILDING YOUR LOOK...",
    result: ar ? "اقتراحك من SHOP.CO" : "YOUR SHOP.CO EDIT",
    complete: ar ? "إطلالة متكاملة" : "COMPLETE LOOK",
    partial: ar ? "اقتراح حسب المتاح" : "BEST AVAILABLE MATCH",
    total: ar ? "إجمالي الإطلالة" : "LOOK TOTAL",
    left: ar ? "المتبقي من الميزانية" : "BUDGET LEFT",
    addAll: ar ? "أضف الإطلالة للسلة" : "ADD LOOK TO BAG",
    adding: ar ? "جاري الإضافة..." : "ADDING...",
    saveAll: ar ? "احفظ القطع لوقت لاحق" : "SAVE PIECES FOR LATER",
    saving: ar ? "جاري الحفظ..." : "SAVING...",
    regenerate: ar ? "جرّب تنسيقًا آخر" : "TRY ANOTHER LOOK",
    emptyTitle: ar ? "لسه مفيش اقتراح" : "Your edit starts here",
    emptyDescription: ar ? "حدد تفضيلاتك واضغط على زر التنسيق عشان نبحث في المنتجات المتاحة." : "Choose your preferences and build a look from the products in the live catalogue.",
    noItems: ar ? "ملقيناش منتجات مناسبة بالميزانية والتفضيلات دي. جرّب تزود الميزانية أو تغيّر الاختيارات." : "No matching in-stock pieces fit these preferences and budget. Try a higher budget or different preferences.",
    incomplete: ar ? "الكتالوج الحالي مش فيه كل القطع المطلوبة لإطلالة كاملة. عرضنا المنتجات المتاحة فقط، من غير اقتراح منتجات غير موجودة." : "The current catalogue does not contain every piece needed for a complete look. Only available products are shown; no missing products are invented.",
    signin: ar ? "سجّل الدخول عشان تحفظ القطع في حسابك." : "Sign in to save these pieces to your account.",
    added: ar ? "تمت إضافة قطع الإطلالة للسلة." : "Look pieces added to your bag.",
    saved: ar ? "تم حفظ المنتجات المتاحة في قائمة محفوظ لوقت لاحق." : "Available pieces saved for later.",
    saveError: ar ? "تعذر حفظ بعض المنتجات. راجع حسابك وحاول مرة أخرى." : "Some pieces could not be saved. Check your account and try again.",
    details: ar ? "تفاصيل المنتج" : "VIEW DETAILS",
  };

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const buildLook = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const budget = Number(preferences.budget);
    if (!Number.isFinite(budget) || budget < 100 || budget > 10_000_000) {
      toast.error(ar ? "أدخل ميزانية بين 100 و10,000,000 جنيه." : "Enter a budget between EGP 100 and EGP 10,000,000.");
      return;
    }
    setLoading(true);
    try {
      const nextResult = await requestPersonalizedLook({
        gender: preferences.gender,
        style: preferences.style,
        occasion: preferences.occasion,
        budget,
        ...(preferences.color ? { color: preferences.color } : {}),
      });
      setResult(nextResult);
      if (!nextResult.items.length) toast(ar ? "مفيش قطع مطابقة حاليًا. جرّب تغيّر الميزانية أو التفضيلات." : "No matching pieces right now. Try changing your budget or preferences.");
    } catch {
      // The shared API interceptor reports server/network errors without exposing internals.
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const addFullLook = () => {
    if (!result?.items.length) return;
    setAdding(true);
    try {
      for (const item of result.items) {
        const product = item.product;
        addItem({
          ...product,
          price: Number(product.price),
          discount: Number(product.discount) || 0,
          colors: Array.isArray(product.colors) ? product.colors.slice(0, 1) : [],
          size: Array.isArray(product.size) ? product.size.slice(0, 1) : [],
          count: 1,
          isChose: true,
        });
      }
      toast.success(copy.added);
    } catch {
      toast.error(ar ? "تعذرت إضافة الإطلالة للسلة." : "Could not add this look to your bag.");
    } finally {
      setAdding(false);
    }
  };

  const saveFullLook = async () => {
    if (!result?.items.length) return;
    if (!isAuthenticated) {
      toast.error(copy.signin);
      return;
    }
    setSaving(true);
    try {
      const responses = await Promise.allSettled(result.items.map(({ product }) => saveForLater(product._id)));
      const savedCount = responses.filter((response) => response.status === "fulfilled").length;
      if (savedCount === result.items.length) toast.success(copy.saved);
      else if (savedCount > 0) toast.error(copy.saveError);
      else toast.error(copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  const slotLabel = (slot: StylistSlot) => {
    const labels: Record<StylistSlot, [string, string]> = {
      onePiece: ["قطعة أساسية", "ONE-PIECE"],
      top: ["القطعة العلوية", "TOP"],
      bottom: ["القطعة السفلية", "BOTTOM"],
      shoes: ["الأحذية", "FOOTWEAR"],
      accessory: ["إضافة مكملة", "ACCESSORY"],
    };
    return ar ? labels[slot][0] : labels[slot][1];
  };

  const selectClass = "mt-2 h-12 w-full appearance-none rounded-xl border border-border bg-surface-subtle px-3 pe-9 text-sm font-semibold text-primary outline-none transition focus:border-action focus:ring-2 focus:ring-action/15";

  return (
    <main dir={direction} className="page-section min-h-[75vh] bg-surface-subtle text-primary">
      <div className="Responsive space-y-8 sm:space-y-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-card sm:p-10 lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-28 -z-10 h-80 w-80 rounded-full bg-action/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 start-1/3 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-3 py-1.5"><Sparkles size={13} className="text-action" />{copy.eyebrow}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-action/20 bg-action/5 px-3 py-1.5 text-action"><span className="h-1.5 w-1.5 rounded-full bg-action" />{copy.live}</span>
          </div>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-action">SHOP.CO / STYLE LAB 01</p>
              <h1 className="max-w-3xl text-3xl font-black leading-[1.15] tracking-[-.04em] sm:text-5xl lg:text-6xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">{copy.subtitle}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-subtle/80 p-4 sm:p-5">
              <div className="flex items-start gap-3"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-action"/><p className="text-xs leading-6 text-muted">{copy.privacy}</p></div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[.82fr_1.18fr] xl:items-start">
          <form onSubmit={buildLook} className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-action">01 / PERSONALIZE</p><h2 className="mt-2 text-xl font-black">{ar ? "ظبّط تفضيلاتك" : "Set your preferences"}</h2></div>
              <Sparkles size={21} className="text-muted" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-[10px] font-black uppercase tracking-[.16em] text-muted">{copy.gender}<span className="relative block"><select className={selectClass} value={preferences.gender} onChange={(event) => update("gender", event.target.value as Preferences["gender"])}><option value="MEN">{ar ? "رجالي" : "Men"}</option><option value="WOMEN">{ar ? "نسائي" : "Women"}</option><option value="KIDS">{ar ? "أطفال" : "Kids"}</option><option value="UNISEX">{ar ? "Unisex" : "Unisex"}</option></select><ChevronDown size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"/></span></label>
              <label className="text-[10px] font-black uppercase tracking-[.16em] text-muted">{copy.style}<span className="relative block"><select className={selectClass} value={preferences.style} onChange={(event) => update("style", event.target.value as Preferences["style"])}><option value="casual">{ar ? "كاجوال" : "Casual"}</option><option value="streetwear">Streetwear</option><option value="minimal">{ar ? "مينيمال" : "Minimal"}</option><option value="classic">{ar ? "كلاسيك" : "Classic"}</option><option value="formal">{ar ? "رسمي" : "Formal"}</option><option value="sporty">{ar ? "رياضي" : "Sporty"}</option><option value="elegant">{ar ? "أنيق" : "Elegant"}</option></select><ChevronDown size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"/></span></label>
              <label className="text-[10px] font-black uppercase tracking-[.16em] text-muted">{copy.occasion}<span className="relative block"><select className={selectClass} value={preferences.occasion} onChange={(event) => update("occasion", event.target.value as Preferences["occasion"])}><option value="everyday">{ar ? "يومي" : "Everyday"}</option><option value="work">{ar ? "شغل / مكتب" : "Work"}</option><option value="evening">{ar ? "خروجة مسائية" : "Evening"}</option><option value="party">{ar ? "حفلة / مناسبة" : "Party"}</option><option value="sport">{ar ? "رياضة" : "Sport"}</option><option value="travel">{ar ? "سفر" : "Travel"}</option></select><ChevronDown size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"/></span></label>
              <label className="text-[10px] font-black uppercase tracking-[.16em] text-muted">{copy.color}<span className="relative block"><select className={selectClass} value={preferences.color} onChange={(event) => update("color", event.target.value)}><option value="">{copy.anyColor}</option><option value="black">{ar ? "أسود" : "Black"}</option><option value="white">{ar ? "أبيض" : "White"}</option><option value="beige">{ar ? "بيج" : "Beige"}</option><option value="gray">{ar ? "رمادي" : "Gray"}</option><option value="navy">{ar ? "كحلي" : "Navy"}</option><option value="blue">{ar ? "أزرق" : "Blue"}</option><option value="brown">{ar ? "بني" : "Brown"}</option><option value="green">{ar ? "أخضر" : "Green"}</option><option value="red">{ar ? "أحمر" : "Red"}</option><option value="pink">{ar ? "وردي" : "Pink"}</option></select><ChevronDown size={15} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"/></span></label>
              <label className="text-[10px] font-black uppercase tracking-[.16em] text-muted sm:col-span-2">{copy.budget}<input className={selectClass} type="number" inputMode="decimal" min="100" max="10000000" step="50" required value={preferences.budget} onChange={(event) => update("budget", event.target.value)} /></label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={loading} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-action px-5 text-xs font-black uppercase tracking-[.12em] text-on-action transition hover:bg-action-hover disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={15} className="animate-spin"/> : <Sparkles size={15}/>}{loading ? copy.building : copy.generate}</button>
              <button type="button" onClick={() => { setPreferences(INITIAL_PREFERENCES); setResult(null); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-4 text-xs font-bold text-secondary transition hover:border-border-strong hover:text-primary"><RefreshCw size={14}/>{ar ? "إعادة ضبط" : "RESET"}</button>
            </div>
          </form>

          <div className="min-w-0 space-y-5">
            {!result ? (
              <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-action"><Sparkles size={27}/></span>
                <h2 className="mt-5 text-xl font-black">{copy.emptyTitle}</h2>
                <p className="mt-2 max-w-sm text-sm leading-7 text-muted">{copy.emptyDescription}</p>
                <div className="mt-7 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-muted"><span className="h-px w-8 bg-border"/>REAL PRODUCTS ONLY<span className="h-px w-8 bg-border"/></div>
              </div>
            ) : result.items.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-8 text-center"><Sparkles size={22} className="mx-auto text-muted"/><p className="mt-3 text-sm font-semibold text-muted">{copy.noItems}</p></div>
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                  <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-action">02 / CURATED RESULT</p><h2 className="mt-2 text-2xl font-black">{copy.result}</h2></div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary">{result.isComplete ? <Check size={12} className="text-action"/> : <Sparkles size={12}/>}{result.isComplete ? copy.complete : copy.partial}</span>
                </div>
                {!result.isComplete && <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-xs leading-6 text-muted">{copy.incomplete}</p>}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2">
                  {result.items.map((item) => {
                    const product = item.product;
                    const image = resolveProductImageUrl(product, "/placeholder.png");
                    return (
                      <article key={`${item.slot}-${product._id}`} className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-1 hover:border-border-strong hover:shadow-panel">
                        <Link href={`/shop/details/${product._id}`} className="relative block aspect-[4/4.7] overflow-hidden bg-surface-subtle">
                          <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 48vw, (max-width: 1280px) 42vw, 320px" className="object-cover object-top transition duration-700 group-hover:scale-[1.035]" />
                          <span className="absolute start-2 top-2 rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur">{slotLabel(item.slot)}</span>
                        </Link>
                        <div className="p-3 sm:p-4">
                          <h3 className="line-clamp-2 min-h-10 text-xs font-black leading-5 sm:text-sm">{product.name}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-sm font-black text-primary">{formatCurrency(item.effectivePrice, locale)}</span>{product.isSale && Number(product.discount) > 0 && <span className="text-[10px] font-bold text-muted line-through">{formatCurrency(product.price, locale)}</span>}</div>
                          <p className="mt-2 text-[10px] font-semibold text-muted">{ar ? `متاح: ${product.countInStock}` : `In stock: ${product.countInStock}`}</p>
                          <Link href={`/shop/details/${product._id}`} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-action hover:underline">{copy.details}<ArrowUpRight size={12}/></Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] font-black uppercase tracking-[.15em] text-muted">{copy.total}</p><p className="mt-2 text-2xl font-black tabular-nums">{formatCurrency(result.total, locale)}</p></div>
                    <div className="text-end"><p className="text-[10px] font-black uppercase tracking-[.15em] text-muted">{copy.left}</p><p className="mt-2 text-2xl font-black tabular-nums text-action">{formatCurrency(result.remaining, locale)}</p></div>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-subtle"><div className="h-full rounded-full bg-action transition-all" style={{ width: `${Math.min(100, result.budget ? (result.total / result.budget) * 100 : 0)}%` }}/></div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={addFullLook} disabled={adding} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-action px-4 text-[10px] font-black uppercase tracking-wider text-on-action transition hover:bg-action-hover disabled:opacity-60">{adding ? <LoaderCircle size={14} className="animate-spin"/> : <ShoppingBag size={14}/>}{adding ? copy.adding : copy.addAll}</button>
                    <button type="button" onClick={saveFullLook} disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-4 text-[10px] font-black uppercase tracking-wider text-secondary transition hover:border-border-strong hover:text-primary disabled:opacity-60">{saving ? <LoaderCircle size={14} className="animate-spin"/> : <Bookmark size={14}/>}{saving ? copy.saving : copy.saveAll}</button>
                  </div>
                  <button type="button" onClick={() => buildLook()} disabled={loading} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full text-[10px] font-black uppercase tracking-[.15em] text-muted transition hover:bg-surface-subtle hover:text-primary"><RefreshCw size={13}/>{copy.regenerate}</button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
