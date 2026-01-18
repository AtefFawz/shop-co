"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useProduct } from "@/store/cardStore";
import { Product } from "@/types";

export const Card = ({ productItem }: { productItem: Product }) => {
  const remove = useProduct((e) => e.delete);
  return (
    <div className="w-full my-2 p-2 flex gap-4 items-start rounded-2xl  border border-gray-300 h-fit">
      {" "}
      <figure className="md:w-[30%] xl:w-[20%] w-[40%]  h-full ">
        <Image
          src={productItem.image}
          alt={productItem.title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </figure>
      <div className="flex justify-between items-center w-[60%] md:w-[30%] xl:w-[75%] h-full">
        <div className="space-y-2 w-full h-full mt-2">
          <h2 className="font-bold text-gray-900 text-xs lg:text-lg text-nowrap">
            {productItem.title}
          </h2>
          <h4 className="text-gray-500 font-medium text-sm">small</h4>
          <h4 className="text-gray-500 font-medium text-sm">black</h4>
          <h4 className="text-gray-500 font-medium text-sm">
            Count : {productItem.count}
          </h4>
          <h4>${productItem.price}</h4>
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-200 rounded-full p-2"
        >
          {" "}
          <MdDeleteForever
            onClick={() => {
              remove(productItem);
              toast.error(` ${productItem.title} removed successfully`);
            }}
            className="text-red-500 text-2xl cursor-pointer"
          />
        </motion.div>
      </div>
    </div>
  );
};
