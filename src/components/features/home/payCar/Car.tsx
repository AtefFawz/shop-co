"use client";
import { useProduct } from "@/store/cardStore";
import { Product } from "@/types";
import { Pricing } from "./Pricing";
import { EmptyCart } from "./EmptyCart";
import { Card } from "./Card";
import { PromoCode } from "./PromoCode";
//  5. Car (Main Cart Page)
// ════════════════════════════════════════════════════════════
export const Car = () => {
  const Stack = useProduct((e) => e.stack);

  if (!Stack || Stack.length === 0) return <EmptyCart />;

  return (
    <section className="bg-[#F8F8F8]">
      <div className="min-h-screen px-3 sm:px-6 pb-16">
        <div className="max-w-5xl container mx-auto space-y-6">
          {/* Header */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-400 inline-block" />
              {Stack.length} item{Stack.length !== 1 ? "s" : ""}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">
              Your Cart
            </h1>
          </div>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Items list */}
            <div className="w-full lg:flex-1 space-y-3">
              {Stack.map((e: Product) => (
                <Card productItem={e} key={e._id} />
              ))}
            </div>

            {/* Summary sidebar */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <Pricing product={Stack} />
              <PromoCode />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
