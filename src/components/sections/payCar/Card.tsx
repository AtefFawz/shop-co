"use client";
import Image from "next/image";
import { useProduct } from "@/store/cardStore";
export const Card = () => {
  const Stack = useProduct((e) => e.stack);
  const FILTER = Stack.filter((e) => e.isChose === true);
  if (FILTER.length > 0) {
    return (
      <div className="flex w-full mt-32">
        {" "}
        <div className="w-[65%] p-4 space-y-5 border border-gray-300">
          {FILTER.map((e) => (
            <div
              key={e.id}
              className="w-full flex gap-8 items-center rounded-2xl  border border-gray-300"
            >
              <figure className="w-[20%]">
                <Image src={e.image} alt={e.title} />
              </figure>
              <div>
                <h2 className="font-bold text-gray-900 ">{e.title}</h2>
                <h4 className="text-gray-500 font-medium ">small</h4>
                <h4 className="text-gray-500 font-medium ">black</h4>
                <h4>{e.price}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="h-screen flex items-center justify-center">NOT DATA</h1>
      </div>
    );
  }
};
