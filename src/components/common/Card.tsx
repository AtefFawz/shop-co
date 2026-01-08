"use client";
import Image from "next/image";
import StarRating from "./StarsRating";
import { Product } from "../../types/index";
import Pricing from "./Pricing";
import { useProduct } from "@/store/cardStore";
export default function Card({ product }: { product: Product }) {
  const handel = useProduct((e) => e.toggle);
  return (
    <>
      <div className=" space-y-4 py-4 ">
        <div className=" md:h-80 h-60 w-full ">
          <Image
            unoptimized
            src={product.image}
            alt={product.title}
            className=" object-cover rounded-2xl w-full h-full "
          />
        </div>

        <h4 className="font-bold italic text-xs md:text-lg text-wrap xl:text-nowrap ">
          {product.title}
        </h4>

        <div className="flex md:gap-5 gap-2">
          <StarRating rating={product.rating} />

          <span> {product.rating} </span>
        </div>

        <Pricing product={product} />
        <button
          onClick={() => {
            product.isChose = !product.isChose;
            handel(product);
          }}
        >
          add me
        </button>
      </div>
    </>
  );
}
