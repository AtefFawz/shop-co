"use client";

import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function ProductPrice({ product }: { product: Product }) {
  const { locale } = useLocale();
  const result = calculateFinalPrice(product.price, Number(product.discount));
  return (
    <div className="flex items-center gap-2 flex-nowrap text-nowrap">
      <span className="text-sm md:text-xl font-bold text-primary ">
        {formatCurrency(result, locale)}
      </span>

      {product.discount && (
        <>
          <del className="text-muted text-xs md:text-lg">
            {formatCurrency(product.price, locale)}
          </del>
          <span className="bg-danger-soft text-danger rounded-full px-2 md:px-3 md:py-1 text-xs md:text-sm font-bold">
            -{product.discount}%
          </span>
        </>
      )}
    </div>
  );
}
