//  2. Card (Cart Item)
// ════════════════════════════════════════════════════════════
"use client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/store/cardStore";
import { calculateFinalPrice } from "@/lib/logicPricing";
import { Product } from "@/types";
export const Card = ({ productItem }: { productItem: Product }) => {
  const remove = useProduct((e) => e.delete);
  const router = useRouter();
  // const Url = process.env.NEXT_PUBLIC_API_URL;

  const finalPrice = calculateFinalPrice(
    productItem.price,
    productItem.discount,
    productItem.count,
  );
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      {/* Image */}
      <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={productItem.photo}
          alt={productItem.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-1">
          <h2 className="font-black text-sm sm:text-base uppercase tracking-tight text-gray-900 truncate">
            {productItem.name || productItem.description}
          </h2>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {productItem.price && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Size: {productItem.size}
              </span>
            )}
            {productItem.colors && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Color: {productItem.colors}
              </span>
            )}
          </div>
          <span className="inline-block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Qty: {productItem.count}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-base text-gray-900">
              ${finalPrice.toFixed(2)}
            </span>
            {Number(productItem.discount) > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${(productItem.price * (productItem.count ?? 1)).toFixed(2)}
              </span>
            )}
          </div>

          {/* Delete */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              remove(productItem);
              router.refresh();
              toast.error(
                `${productItem.name || productItem.description} removed`,
              );
            }}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-500 text-red-400 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
