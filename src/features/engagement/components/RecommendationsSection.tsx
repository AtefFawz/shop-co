"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/features/catalog/components/ProductCard";
import { fetchRecommendations } from "@/features/engagement/api";
import type { Product } from "@/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function RecommendationsSection() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    let active = true;
    fetchRecommendations()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!items.length) return null;
  return (
    <section
      className="Responsive space-y-5 py-10"
      aria-labelledby="recommendations-heading"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-muted">
            {locale === "ar"
              ? "اختيارات مبنية على اهتماماتك"
              : "Picked around your interests"}
          </p>
          <h2
            id="recommendations-heading"
            className="mt-2 text-2xl font-black sm:text-3xl"
          >
            {locale === "ar" ? "قد يعجبك أيضًا" : "You may also like"}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
