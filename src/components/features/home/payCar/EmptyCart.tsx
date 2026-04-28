//  1. EmptyCart
// ════════════════════════════════════════════════════════════
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
export const EmptyCart = () => (
  <section>
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4 py-16 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-black">0</span>
        </div>
      </div>

      <div className="space-y-2 max-w-xs mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-gray-400 font-medium leading-relaxed">
          Looks like you haven't added anything yet. Explore our top categories
          and find something you love.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-px active:translate-y-0"
      >
        <ShoppingBag size={14} />
        Start Shopping
      </Link>
    </div>
  </section>
);
