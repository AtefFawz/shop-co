"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Colors from "@/components/common/Colors";
import Sizes from "@/components/common/Sizes";
import Counter from "./Counter";
import { useProduct } from "@/store/cardStore";
import { useRouter } from "next/navigation";
export default function ProductClientWrapper({ product }: { product: any }) {
  const update = useProduct((state) => state.update);
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(product.colors);
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const finalProduct = {
      ...product,
      colors: selectedColor,
      size: selectedSize,
      count: quantity,
      isChose: true,
    };
    update(finalProduct);
    toast.success(
      (t) => (
        <span className="flex items-center gap-3 ">
          <b>Awesome! {product.name} added to your cart.</b>
          <button
            onClick={() => {
              router.push("/shopping/details/cart");
              toast.dismiss(t.id);
            }}
            className="bg-black text-white text-[10px] px-3 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors text-nowrap"
          >
            View Cart
          </button>
        </span>
      ),
      {
        duration: 4000,
        position: "top-center",
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className=" border-gray-100 pt-4 space-y-2.5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Select Color
        </h3>
        <div className="flex items-center flex-wrap gap-2">
          <Colors
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      </div>{" "}
      {/* Sizes */}
      <div className="border-t border-gray-100 pt-4 space-y-2.5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Choose Size
        </h3>
        <div className="flex items-center flex-wrap gap-2">
          <Sizes
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </div>
      </div>
      {/* Quantity */}
      <div className="border-t border-gray-100 pt-4 space-y-2.5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Quantity
        </h3>
        <div className="grid grid-cols-3 content-center items-center gap-2 w-full">
          <div className="col-span-1 ">
            <Counter quantity={quantity} setQuantity={setQuantity} />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black col-span-2 text-white py-2 rounded-full font-bold text-nowrap hover:bg-gray-800 transition-colors"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
