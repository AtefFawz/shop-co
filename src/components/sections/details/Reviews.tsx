"use client";
import VerifiedRoucndedIcon from "@mui/icons-material/VerifiedRounded";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { ScrollingItem } from "../../../data/rating";
import StarRating from "@/components/common/StarsRating";
import Heading from "@/components/ui/Heading";
export const Reviews = ({ item }: { item: Product }) => {
  const reviews = ScrollingItem.filter((e) => e.type === item.section);
  console.log("item reviews", reviews);
  return (
    <section className="container mx-auto px-2 md:px-6 lg:px-8 xl:px-10 my-10">
      <Heading title="Customer Reviews" styling="!text-start mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 ">
        {reviews.map((e, id) => (
          <motion.div
            whileInView={{}}
            whileHover={{ rotate: 2 }}
            transition={{ duration: 0.4 }}
            key={id}
            className="shadow-md p-8 rounded-2xl space-y-4 bg-[#FAFAFA]"
          >
            <StarRating rating={e.rate} />
            <h3 className="text-xl font-bold space-x-3 flex items-center">
              <span>{e.name}</span>
              <span>
                <VerifiedRoucndedIcon className="text-green-500 text-sm" />
              </span>
            </h3>
            <p className="mt-2 text-gray-500 tracking-wide">{e.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
