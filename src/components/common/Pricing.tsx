import { Product } from "@/types";
import { calculateFinalPrice } from "@/lib/logicPricing";

export default function Pricing({ product }: { product: Product }) {
  const result = calculateFinalPrice(product.price, product.discount);
  return (
    <div className="flex items-center gap-2 flex-nowrap text-nowrap">
      <span className="text-sm md:text-xl font-bold text-slate-900 ">
        $ {result}
      </span>

      {product.discount && (
        <>
          <del className="text-gray-500 text-xs md:text-lg">
            ${product.price}
          </del>
          <span className="bg-red-100 text-[#FF3333] rounded-full px-2 md:px-3 md:py-1 text-xs md:text-sm font-bold">
            -{product.discount}%
          </span>
        </>
      )}
    </div>
  );
}
