"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Brand_Item } from "@/data/brand";
import Heading from "@/components/ui/Heading";
export const Brands = () => {
  return (
    <section className="container mx-auto px-4 lg:px-6 xl:px-10 mt-22">
      <Heading title="BROWSE BRANDS" styling="mb-13 text-start px-6" />
      <motion.div className="flex flex-wrap items-center gap-4 md:gap-6 h-full w-full justify-center">
        {Brand_Item.map((brand) => {
          return (
            <motion.div
              whileTap={{ rotateY: 90 }}
              transition={{ duration: 0.8 }}
              key={brand.id}
              className="md:w-[31%] xl:w-[22%] w-[46%] bg-[#ffffff]  p-4 rounded-2xl h-46 shadow-[inset_0_0_0_3px_rgba(0,0,0,0.2)]"
            >
              <Image
                src={brand.Icon}
                alt={brand.name}
                width={400}
                height={300}
                className=" w-full h-full object-contain bg-transparent"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
