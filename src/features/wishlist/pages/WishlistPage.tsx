"use client";

import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import ProductCard from "@/features/catalog/components/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function WishlistPage() {
  const { t, locale } = useLocale();
  const items = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-surface-subtle py-8 text-primary sm:py-12">
      <div className="Responsive relative z-10 space-y-8 px-4 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.08)] sm:p-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1 text-xs font-bold text-danger">
              <Heart size={14} fill="currentColor" />
              {t("savedItems")}
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {t("wishlistTitle")}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted">
              {items.length > 0
                ? `${items.length} ${t("products")}`
                : t("wishlistEmptyHint")}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold text-secondary transition-colors hover:border-danger-border hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 size={14} />
              {t("clearAll")}
            </button>
          )}
        </header>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-3 gap-y-5 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <section className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft text-danger">
              <Heart size={28} />
            </div>
            <h2 className="text-lg font-black">{t("wishlistEmpty")}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              {t("wishlistEmptyHint")}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-action px-5 py-3 text-sm font-bold text-on-action transition hover:bg-action-hover"
            >
              {t("exploreProducts")}
              <ArrowRight
                size={16}
                className={locale === "ar" ? "rotate-180" : undefined}
              />
            </Link>
          </section>
        )}
      </div>
    </section>
  );
}
