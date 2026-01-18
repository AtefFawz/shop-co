"use client";
import { useProduct } from "@/store/cardStore";
import { Product } from "@/types/index";
import { ButtonCard } from "./AddToCard";
export default function Counter({ product }: { product: Product }) {
  const UPCounter = useProduct((state) => state.up);
  const DOWNCounter = useProduct((state) => state.down);
  const count = useProduct(
    (state) => state.stack.find((item) => item.id === product.id)?.count || 1,
  );

  if (!product) {
    return <div>Loading...</div>;
  }
  const StyleButton = "text-2xl font-bold cursor-pointer ";
  return (
    <article className="grid grid-cols-3 gap-4 w-full justify-items-center content-around">
      <div className="gap-5 rounded-full bg-gray-200 flex justify-around items-center md:px-4 px-2 text-xl col-span-1 w-full">
        <button
          onClick={() => DOWNCounter(product)}
          disabled={count <= 0}
          className={`${StyleButton} disabled:opacity-30`}
        >
          -
        </button>
        <span>{count}</span>
        <button onClick={() => UPCounter(product)} className={`${StyleButton}`}>
          +
        </button>
      </div>
      <div className="col-span-2 w-full">
        {" "}
        <ButtonCard />
      </div>
    </article>
  );
}
