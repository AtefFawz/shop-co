//  4. PromoCode
// ════════════════════════════════════════════════════════════
"use client";
import { Tag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
export const PromoCode = () => {
  const router = useRouter();

  return (
    <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
      {/* Promo input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Promo code"
            className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold placeholder:text-gray-400 outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
        <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl transition-colors shrink-0">
          Apply
        </button>
      </div>

      {/* Checkout */}
      <button
        onClick={() => router.push("/shopping/details/cart/checkout")}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-px active:translate-y-0"
      >
        Go to Checkout
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
