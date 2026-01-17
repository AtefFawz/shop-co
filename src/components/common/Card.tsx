"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import StarRating from "./StarsRating";
import { Product } from "../../types/index";
import Pricing from "./Pricing";
import { useProduct } from "@/store/cardStore";
import { useRouter } from "next/navigation";

export default function Card({ product }: { product: Product }) {
  const toggleProduct = useProduct((e) => e.toggle);
  const router = useRouter();
  const handleNavigate = () => {
    toggleProduct(product);
    router.push(`/shopping/details/${product.id}`);
  };

  return (
    <div className="group relative w-full space-y-3 py-4">
      <motion.div
        className="relative h-64 md:h-80 w-full overflow-hidden rounded-3xl bg-gray-100 cursor-pointer"
        onClick={handleNavigate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          unoptimized
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 md:group-hover:scale-110"
        />

        {/* Overlay: ظاهر خفيف في الموبايل، وبيتقل في الهوفر */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/20 opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />

        {/* الزرار:
           1. في الموبايل (block): ظاهر علطول.
           2. في الكمبيوتر (md:opacity-0): مخفي ويظهر بالهوفر.
        */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
          <motion.button
            // أنيميشن الزرار نفسه لما تدوس عليه
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation(); // عشان ميفعلش الكارت كله
              handleNavigate();
            }}
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 md:px-6 md:py-3 text-sm font-bold text-black shadow-xl backdrop-blur-sm"
          >
            Show Details
            <GoArrowUpRight className="text-lg" />
          </motion.button>
        </div>
      </motion.div>

      {/* باقي تفاصيل الكارت */}
      <div>
        <h4 className="font-bold text-base md:text-lg truncate">
          {product.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">{product.rating}/5</span>
        </div>
        <Pricing product={product} />
      </div>
    </div>
  );
}
