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
    // تحديث الحالة وتوجيه المستخدم
    product.isChose = !product.isChose; // لو السطر ده ضروري للوجيك بتاعك سيبه
    toggleProduct(product);
    router.push(`/shopping/details/${product.id}`);
  };

  return (
    <div className="group relative w-full space-y-3 py-4">
      {/* --- Image Container --- */}
      <div
        className="relative h-64 md:h-80 w-full overflow-hidden rounded-3xl bg-gray-100 cursor-pointer"
        onClick={handleNavigate}
      >
        {/* 1. الصورة بتعمل زووم خفيف */}
        <Image
          unoptimized
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* 2. طبقة سوداء تظهر بنعومة */}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 3. زرار التفاصيل يظهر من تحت لفوق */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl"
          >
            Show Details
            <GoArrowUpRight className="text-lg" />
          </motion.button>
        </div>
      </div>

      {/* --- Card Info --- */}
      <div>
        <div className="flex justify-between items-start">
          <h4
            className="font-bold text-base md:text-lg truncate w-3/4"
            title={product.title}
          >
            {product.title}
          </h4>
          {/* زرار إضافة سريع (اختياري)
          <button
            onClick={(e) => {
              e.stopPropagation();
              // هنا لو عايز تضيف للكارت علطول
            }}
            className="bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <GoPlus size={20} />
          </button> */}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">{product.rating}/5</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Pricing product={product} />
        </div>
      </div>
    </div>
  );
}
// <button
//   onClick={() => {
//     product.isChose = !product.isChose;
//     handel(product);

//     router.push(`/shopping/details/${product.id}`);
//   }}
// >
//   add me
// </button>;
